"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
// configure cloudinary
cloudinary_1.v2.config({
    cloud_name: "dzruagzhw",
    api_key: "965192888623839",
    api_secret: "v0fqKyZUeH4a2_6YI6g4E3leH80",
    secure: true,
});
// the function to upload the image with local path.
const uploadImage = async (localPath) => {
    try {
        if (!localPath) {
            console.log("No local path given!");
            return null;
        }
        const uploadedImage = await cloudinary_1.v2.uploader.upload(localPath, {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
        });
        if (uploadedImage?.url) {
            fs_1.default.unlinkSync(localPath);
            return uploadedImage?.url;
        }
    }
    catch (error) {
        fs_1.default.unlinkSync(localPath);
        console.log(error);
        return null;
    }
};
exports.uploadImage = uploadImage;
// the function to delete the image with the current cloudinary url
const deleteImage = async (url) => {
    try {
        if (!url) {
            console.log("no url given to delete!");
            return null;
        }
        // getting the public id using regex
        const regex = /\/upload\/v(\d+)\/([^\/]+)\./;
        const match = url.match(regex);
        const publicId = (match && match[2]);
        const deleteResponse = await cloudinary_1.v2.uploader.destroy(publicId);
        if (deleteResponse) {
            return deleteResponse;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
};
exports.deleteImage = deleteImage;
