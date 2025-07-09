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
import { createClient } from "@/lib/supabase/client";

type FileState = {
  id: string;
  url: string;
  isUploading: boolean;
  isBlob?: boolean;
  file?: File;
  path?: string;
};

type Props = {
  onImageUpload: (urls: string[]) => void;
  defaultValues?: string[];
  className?: string;
  disabled?: boolean;
  maxImages: number;
  bucket?: string;
  folder?: string;
  allowVideo?: boolean;
};

const MultipleImageUpload = ({
  onImageUpload,
  className,
  defaultValues = [],
  disabled,
  maxImages,
  bucket = "vendors",
  folder,
  allowVideo = false,
}: Props) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClient();

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

  const uploadToSupabase = useCallback(
    async (file: File, fileId: string) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      try {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileId ? { ...f, isUploading: true } : f
          )
        );

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (error) throw error;
        if (!data) throw new Error("Upload failed: No data returned");

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(data.path);

        if (!publicUrl) throw new Error("Could not generate public URL");

        return { url: publicUrl, path: data.path };
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    },
    [bucket, folder, supabase]
  );

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
        const { url, path } = await uploadToSupabase(file, fileId);

        setFiles((prevFiles) => {
          const updated = prevFiles.map((f) =>
            f.id === fileId
              ? { ...f, url, path, isUploading: false, isBlob: false }
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
    [uploadToSupabase, updateParent]
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

      // Validate files
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

      // Create previews with unique IDs and keep file reference
      const newFiles = acceptedFiles.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        isUploading: true,
        isBlob: true,
        file,
      }));

      // Add preview files to state
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Process uploads in parallel with proper error handling
      await Promise.allSettled(
        newFiles.map((newFile) => processFileUpload(newFile.file, newFile.id))
      );

      // Clean up blob URLs after all uploads are processed
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

      // Clean up blob URLs
      if (fileToRemove.isBlob) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      // Delete from Supabase if it was uploaded
      if (fileToRemove.path) {
        try {
          const { error } = await supabase.storage
            .from(bucket)
            .remove([fileToRemove.path]);

          if (error) {
            console.error("Error deleting file:", error);
            toast.error("Failed to delete file from storage");
            return;
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          toast.error("Failed to delete file from storage");
          return;
        }
      }

      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((_, i) => i !== index);
        updateParent(updatedFiles);
        return updatedFiles;
      });
    },
    [files, bucket, supabase, updateParent]
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

  // Clean up blob URLs on unmount
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
