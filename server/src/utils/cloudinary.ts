import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../config/env.js";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

type CloudinaryResourceType = "image" | "video" | "auto";

const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".webm",
  ".m4a",
  ".ogg",
  ".aac",
  ".flac",
  ".mp4",
]);

function resolveResourceType(
  filePath: string,
  preferred: CloudinaryResourceType,
): "image" | "video" | "auto" {
  if (preferred !== "auto") return preferred;

  const ext = path.extname(filePath).toLowerCase();
  if (AUDIO_EXTENSIONS.has(ext)) return "video";
  return "auto";
}

function removeLocalFile(filePath: string) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

const uploadOnCloudinary = async function (
  filePath: string,
  resourceType: CloudinaryResourceType = "auto",
) {
  if (!filePath) {
    throw new ApiError(500, "No filePath was found in uploadOnCloudinary");
  }

  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: resolveResourceType(filePath, resourceType),
    });
    removeLocalFile(filePath);
    return response;
  } catch {
    removeLocalFile(filePath);
    throw new ApiError(500, "Failed to upload file to Cloudinary.");
  }
};

const deleteFromCloudinary = async function (fileId: string) {
  if (!fileId) {
    throw new ApiError(500, "No fileId was found in deleteFromCloudinary");
  }

  try {
    for (const resource_type of ["video", "image"] as const) {
      const response = await cloudinary.uploader.destroy(fileId, {
        resource_type,
      });
      if (response.result === "ok") return response;
    }
    return { result: "not found" };
  } catch {
    throw new ApiError(500, "Unable to remove file from cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
