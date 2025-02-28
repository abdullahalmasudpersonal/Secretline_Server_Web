"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadHelper = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("../config"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const moment_1 = __importDefault(require("moment"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//     // cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// Multer Cloudinary Storage কনফিগারেশন
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        // @ts-ignore
        folder: 'uploads', // Cloudinary এর ফোল্ডার
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () { return 'png'; }), // ফাইল ফরম্যাট সেট করো
        public_id: (req, file) => file.originalname.split('.')[0],
        // allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // ফরম্যাট সীমাবদ্ধতা
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// 📂 অডিও ফাইল সংরক্ষণের জন্য multer সেটআপ
const audioStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        // @ts-ignore
        folder: 'voice-messages',
        resource_type: 'video',
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () { return 'webm'; }),
        // public_id: (req, file) => file.originalname.split('.')[0],
        public_id: (req, file) => `voice_${(0, moment_1.default)().format('ss[s]-mm[m]-hhA-DDMMM-YYYY')}`,
    },
});
/// upload local disk storage
// const audioStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // 📁 "uploads" ফোল্ডারে ফাইল সংরক্ষণ
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // 🔥 ইউনিক ফাইলনেম
//   },
// });
const uploadAudio = (0, multer_1.default)({ storage: audioStorage });
//////////// Only Single file upload in Object
// const uploadToCloudinary = async (
//   uploadFiles: IUploadFile,
// ): Promise<ICloudinaryResponse | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       uploadFiles.path,
//       (error: Error, result: ICloudinaryResponse) => {
//         fs.unlinkSync(uploadFiles.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       },
//     );
//   });
// };
const uploadToCloudinary = (uploadFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = uploadFiles.map((file) => new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
            catch (unlinkError) {
                console.error('Error while deleting the file:', unlinkError);
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    }));
    return Promise.all(uploadPromises);
});
exports.FileUploadHelper = {
    uploadToCloudinary,
    upload,
    uploadAudio,
};
