import AWS from "aws-sdk";

/**
 * Upload file to AWS S3.
 * @param file - The file to upload.
 * @param folder - The folder inside the bucket where the file will be stored.
 * @param progressCallback - Optional progress callback.
 * @returns {Promise<{ url: string; key: string }>} - The uploaded file URL and key.
 */
export async function uploadFile(
  file: File,
  folder: string,
  progressCallback?: (progress: number) => void
): Promise<{ url: string; key: string }> {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const file_key = `${folder}/${Date.now()}_${file.name.replace(/ /g, "-")}`;

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        if (evt.total) {
          const progress = Math.round((evt.loaded / evt.total) * 100);
          if (progressCallback) {
            progressCallback(progress);
          }
        }
      })
      .promise();

    await upload;

    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;

    console.log("Successfully uploaded to S3:", file_key);

    return { url, key: file_key };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

/**
 * Delete a file from AWS S3.
 * @param fileKey - The full key of the file to delete in S3 (including folder).
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function deleteFile(
  fileKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey, // full path including folder
    };

    await s3.deleteObject(params).promise();

    console.log(`Successfully deleted file: ${fileKey}`);
    return { success: true, message: `File ${fileKey} deleted successfully.` };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { success: false, message: "Error deleting file from S3." };
  }
}
