/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Grip, Trash, LoaderIcon } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/upload-s3";

type FileState = {
  id: string;
  url: string;
  key?: string; // S3 key for deletion
  isUploading: boolean;
  isBlob?: boolean;
  file?: File;
};

type Props = {
  onImageUpload: (urls: string[]) => void;
  defaultValues?: string[];
  className?: string;
  disabled?: boolean;
  maxImages: number;
  folder?: string;
  allowVideo?: boolean;
};

const MultipleImageUpload = ({
  onImageUpload,
  className,
  defaultValues = [],
  disabled,
  maxImages,
  folder = "uploads",
  allowVideo = false,
}: Props) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (defaultValues.length > 0) {
      setFiles(
        defaultValues.map((url) => ({
          id: `existing-${url}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          isUploading: false,
          isBlob: false,
        }))
      );
    }
  }, [defaultValues]);

  const updateParent = useCallback(
    (updatedFiles: FileState[]) => {
      const completedUrls = updatedFiles
        .filter((f) => !f.isUploading && !f.isBlob)
        .map((f) => f.url);
      onImageUpload(completedUrls);
    },
    [onImageUpload]
  );

  const processFileUpload = useCallback(
    async (file: File, fileId: string) => {
      const toastId = toast.loading(`Uploading ${file.name}...`);

      try {
        const { url, key } = await uploadFile(file, folder, (progress) => {
          console.log(`${file.name} progress:`, progress);
        });

        setFiles((prevFiles) => {
          const updated = prevFiles.map((f) =>
            f.id === fileId
              ? { ...f, url, key, isUploading: false, isBlob: false }
              : f
          );
          updateParent(updated);
          return updated;
        });

        toast.success(`Uploaded ${file.name}`, { id: toastId });
      } catch (error) {
        console.error("Upload failed:", error);

        setFiles((prevFiles) => {
          const updated = prevFiles.filter((f) => f.id !== fileId);
          updateParent(updated);
          return updated;
        });

        toast.error(`Failed to upload ${file.name}`, { id: toastId });
      }
    },
    [updateParent, folder]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowVideo
      ? {
          "image/png": [".png"],
          "image/jpg": [".jpg", ".jpeg"],
          "image/webp": [".webp"],
          "image/svg+xml": [".svg"],
          "video/mp4": [".mp4"],
        }
      : {
          "image/png": [".png"],
          "image/jpg": [".jpg", ".jpeg"],
          "image/webp": [".webp"],
          "image/svg+xml": [".svg"],
        },
    maxFiles: maxImages,
    onDrop: async (acceptedFiles) => {
      if (!isMounted || disabled) return;

      const sizeErrors = acceptedFiles.filter(
        (file) => file.size > 20 * 1024 * 1024
      );
      if (files.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} files allowed`);
        return;
      }
      if (sizeErrors.length > 0) {
        toast.error(`${sizeErrors.length} file(s) exceed 20MB limit`);
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        isUploading: true,
        isBlob: true,
        file,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      await Promise.allSettled(
        newFiles.map((newFile) => processFileUpload(newFile.file!, newFile.id))
      );

      newFiles.forEach((file) => {
        if (file.isBlob) {
          URL.revokeObjectURL(file.url);
        }
      });
    },
  });

  const handleRemove = useCallback(
    async (index: number) => {
      if (index < 0 || index >= files.length) return;

      const fileToRemove = files[index];
      if (fileToRemove.isUploading) {
        toast.warning("File is still uploading");
        return;
      }

      if (fileToRemove.isBlob) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      if (fileToRemove.key) {
        try {
          await deleteFile(fileToRemove.key);
          toast.success("File deleted from S3");
        } catch (error) {
          console.error("Error deleting file:", error);
          toast.error("Failed to delete file from S3");
        }
      }

      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((_, i) => i !== index);
        updateParent(updatedFiles);
        return updatedFiles;
      });
    },
    [files, updateParent]
  );

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      setFiles((prevFiles) => {
        const items = [...prevFiles];
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        updateParent(items);
        return items;
      });
    },
    [updateParent]
  );

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.isBlob) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  if (!isMounted) {
    return (
      <div className={cn("flex items-center gap-3 flex-wrap", className)}>
        {defaultValues.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="relative bg-zinc-100 w-32 h-[120px] rounded-md overflow-hidden border border-input"
          />
        ))}
        {defaultValues.length < maxImages && (
          <div className="w-32 h-[120px] border-[2px] rounded-md border-dashed border-input" />
        )}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="files" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("flex items-center gap-3 flex-wrap", className)}
          >
            {files.map((file, index) => (
              <Draggable
                key={file.id}
                draggableId={file.id}
                index={index}
                isDragDisabled={file.isUploading}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "relative bg-zinc-100 w-32 h-[120px] rounded-md overflow-hidden border border-input flex items-center",
                      file.isUploading && "opacity-70"
                    )}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="p-2 cursor-grab absolute left-0 top-0 z-20"
                    >
                      <Grip className="h-4 w-4 text-gray-600" />
                    </div>

                    <div className="relative w-full h-full">
                      <div className="z-10 absolute top-1 right-1">
                        <Button
                          variant="destructive"
                          type="button"
                          size="sm"
                          onClick={() => handleRemove(index)}
                          className="h-8 w-8 p-0"
                          disabled={file.isUploading}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>

                      {file.url?.toLowerCase()?.endsWith?.(".mp4") ? (
                        <video
                          controls
                          className="object-cover w-full h-full"
                          src={file.url}
                        />
                      ) : (
                        <img
                          src={file.url || ""}
                          alt={`Uploaded ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      )}

                      {file.isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <LoaderIcon className="size-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {files.length < maxImages && (
              <div
                {...getRootProps({
                  className: `w-32 h-[120px] border-[2px] rounded-md border-dashed border-input flex items-center justify-center flex-col ${
                    disabled
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`,
                })}
              >
                <input {...getInputProps()} />
                <Plus className="w-5 h-5 text-gray-600" />
                <p className="mt-1 text-sm text-muted-foreground">Add File</p>
                <p className="text-xs text-muted-foreground">
                  ({files.length}/{maxImages})
                </p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MultipleImageUpload;
