"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = void 0;
/* eslint-disable comma-dangle */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
        return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
};
exports.fileFilter = fileFilter;
const storage = multer_1.default.diskStorage({});
const multerConfig = (0, multer_1.default)({
    storage,
    fileFilter: exports.fileFilter,
});
exports.default = multerConfig;
//# sourceMappingURL=multer.js.map