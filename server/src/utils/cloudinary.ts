import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../config/env.js";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const uploadOnCloudinary = async function (filePath: string) {
  try {
    if (!filePath) {
      throw new ApiError(500, "No filePath was found in uploadOnCloudinary");
    }
    const resposne = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    fs.unlinkSync(filePath);

    return resposne;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw new ApiError(500, "Error while removing file from localStorage.");
  }
};

const deleteFromCloudinary = async function (fileId: string) {
  try {
    if (!fileId) {
      throw new ApiError(500, "No fileId was found in deleteFromCloudinary");
    }
    const response = await cloudinary.uploader.destroy(fileId);
    return response;
  } catch (error) {
    throw new ApiError(500, "Unable to remove file from cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
