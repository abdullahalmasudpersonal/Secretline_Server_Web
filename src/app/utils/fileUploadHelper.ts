import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as fs from 'fs';
import config from '../config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ICloudinaryResponse, IUploadFile } from '../interface/file';
import moment from 'moment';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
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

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-ignore
    folder: 'uploads', // Cloudinary এর ফোল্ডার
    format: async (req: any, file: any) => 'png', // ফাইল ফরম্যাট সেট করো
    public_id: (req, file) => file.originalname.split('.')[0],
    // allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // ফরম্যাট সীমাবদ্ধতা
  },
});
const upload = multer({ storage: storage });

// 📂 অডিও ফাইল সংরক্ষণের জন্য multer সেটআপ
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // @ts-ignore
    folder: 'voice-messages',
    resource_type: 'video',
    format: async (req: any, file: any) => 'webm',
    // public_id: (req, file) => file.originalname.split('.')[0],
    public_id: (req, file) =>
      `voice_${moment().format('ss[s]-mm[m]-hhA-DDMMM-YYYY')}`,
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
const uploadAudio = multer({ storage: audioStorage });

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

const uploadToCloudinary = async (
  uploadFiles: IUploadFile[],
): Promise<ICloudinaryResponse[]> => {
  const uploadPromises = uploadFiles.map(
    (file) =>
      new Promise<ICloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          (error: Error, result: ICloudinaryResponse) => {
            try {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            } catch (unlinkError) {
              console.error('Error while deleting the file:', unlinkError);
            }

            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
      }),
  );

  return Promise.all(uploadPromises);
};

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
  uploadAudio,
};
