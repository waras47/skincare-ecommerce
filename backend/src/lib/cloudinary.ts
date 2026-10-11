import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

export const cloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

function uploadOnce(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "skincare-ecommerce/products", timeout: 30000 },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

// ponytail: one retry on transient network/timeout errors, not a full backoff queue.
export async function uploadImageBuffer(buffer: Buffer): Promise<string> {
  try {
    return await uploadOnce(buffer);
  } catch (err) {
    console.error("Cloudinary upload failed, retrying once:", err);
    return uploadOnce(buffer);
  }
}
