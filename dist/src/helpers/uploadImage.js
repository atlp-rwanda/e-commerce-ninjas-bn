"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const uploadImages = async (fileToUpload) => {
    const result = await cloudinary_1.v2.uploader.upload(fileToUpload.path);
    return {
        public_id: result.public_id,
        secure_url: result.secure_url,
    };
};
exports.uploadImages = uploadImages;
exports.default = exports.uploadImages;
//# sourceMappingURL=uploadImage.js.map