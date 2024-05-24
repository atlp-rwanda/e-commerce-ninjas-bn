/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinary } from ".";
const uploadImages = async (fileToUpload:any): Promise<{ public_id: string; secure_url: string }> => {
    const result = await cloudinary.uploader.upload(fileToUpload.path);
    return {
        public_id: result.public_id,
        secure_url: result.secure_url
    };
};

export default uploadImages;