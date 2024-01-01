import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.util";
import fs from "fs";

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// the function to upload the image with local path.
export const uploadImage = async (localPath: string) => {
  try {
    if (!localPath) {
      console.log("No local path given!");
      return null;
    }
    const uploadedImage = await cloudinary.uploader.upload(localPath, {
      use_filename: true, // will set the public id as filename.
      unique_filename: true,
      overwrite: true,
    });
    if (uploadedImage?.url) {
      fs.unlinkSync(localPath);
      return uploadedImage?.url;
    }
  } catch (error: any) {
    fs.unlinkSync(localPath);
    console.log("there was an error while uploading the image");
    return null;
  }
};

// the function to delete the image with the current cloudinary url
export const deleteImage = async (url: string) => {
  try {
    if (!url) {
      console.log("no url given to delete!");
      return null;
    }

    // getting the public id using regex
    const regex = /\/upload\/v(\d+)\/([^\/]+)\./;
    const match = url.match(regex);
    const publicId = (match && match[2]) as string;

    const deleteResponse = await cloudinary.uploader.destroy(
      publicId as string,
    );
    if (deleteResponse) {
      return deleteResponse;
    } else {
      return null;
    }
  } catch (error) {
    console.log("There was a problem while deleting the image");
    return null;
  }
};
