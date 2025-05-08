import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generates a pre-signed URL to access an MP4 file from the S3 bucket
 * 
 * @param filePath - The path to the file within the bucket (e.g., "folder/recording.mp4")
 * @param expiresIn - Number of seconds until the URL expires (default: 3600 = 1 hour)
 * @returns A pre-signed URL that can be used to access the file directly
 * @throws Error if the signed URL generation fails
 */
export async function getRecordingUrl(filePath: string, expiresIn = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: "talentorarecordings",
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL for recording:", error);
    throw new Error("Failed to retrieve recording URL");
  }
}

/**
 * Retrieves the actual file content of an MP4 from the S3 bucket
 * 
 * @param filePath - The path to the file within the bucket (e.g., "folder/recording.mp4")
 * @returns A promise resolving to a ReadableStream of the file content
 * @throws Error if retrieval fails
 */
export async function getRecordingFile(filePath: string): Promise<ReadableStream | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: "talentorarecordings",
      Key: filePath,
    });

    const response = await s3Client.send(command);
    return response.Body?.transformToWebStream() || null;
  } catch (error) {
    console.error("Error retrieving recording file:", error);
    throw new Error("Failed to retrieve recording file");
  }
}
