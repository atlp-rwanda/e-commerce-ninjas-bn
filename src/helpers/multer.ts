// import { Request } from "express";
// import multer from "multer";
// import path from "path";

// export default multer({
//     storage:multer.diskStorage({}),
//     fileFilter:(req:Request,file:Express.Multer.File,cb)=>{
//         const ext = path.extname(file.originalname);
//         if(ext!== ".png" && ext!== ".jpg" && ext!== ".jpeg"){
//             return cb(new Error("Only images are allowed"));
//         }
//         cb(null,true);
//     }
// })