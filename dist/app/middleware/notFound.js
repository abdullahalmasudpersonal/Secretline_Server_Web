"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const notFound = (res: Response) => {
//   return res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: 'API Not Found !!',
//     error: '',
//   });
// };
const notFound = (req, res) => {
    res.status(404).send('Route not found');
};
exports.default = notFound;
