"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import httpStatus from "http-status";
// const notFound = (res: Response) => {
//   return res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: 'API Not Found !!',
//     error: '',
//   });
// };
const notFound = (req, res) => {
  res.status(404).send("Route not found");
};
exports.default = notFound;
