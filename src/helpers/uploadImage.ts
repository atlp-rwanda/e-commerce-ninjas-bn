// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET
//   });
  
// export const uploadImages = async (fileToUpload: any): Promise<{ public_id: string; secure_url: string }> => {
//     const result = await cloudinary.uploader.upload(fileToUpload.path);
//     return {
//       public_id: result.public_id,
//       secure_url: result.secure_url
//     };
//   };

// export default uploadImages;