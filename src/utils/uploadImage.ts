import { v2 as cloudinary } from "cloudinary"; 
import fs from "fs";

// configure cloudinary
cloudinary.config({
  cloud_name: "dzruagzhw",
  api_key: "965192888623839",
  api_secret: "v0fqKyZUeH4a2_6YI6g4E3leH80",
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
    console.log(error);
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
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
