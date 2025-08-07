import { createClient } from "@/lib/supabase/client";

/**
 * Upload a file to a specified Supabase storage bucket
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder inside the bucket
 * @returns { url: string, path: string }
 */
export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  folder?: string
): Promise<{ url: string; path: string }> => {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error || !data) {
    console.error("Upload failed", error);
    throw new Error(error?.message || "Upload failed");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  if (!publicUrl) {
    throw new Error("Failed to retrieve public URL");
  }

  return { url: publicUrl, path: data.path };
};

/**
 * Delete a file from Supabase storage
 * @param path Path of the file in storage (e.g., folder/filename.ext)
 * @param bucket The storage bucket name
 */
export const deleteFileFromSupabase = async (
  path: string,
  bucket: string
): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Delete failed", error);
    throw new Error(error.message);
  }
};
