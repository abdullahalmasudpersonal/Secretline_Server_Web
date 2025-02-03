"use strict";
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
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const request_ip_1 = __importDefault(require("request-ip"));
const loginUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = yield user_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password is incorrect!');
    const jwtPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.accessToken, config_1.default.jwt.accessTokenExpriesin);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.refreshtoken, config_1.default.jwt.refreshtokenexpiresin);
    if (user.role === 'member') {
        yield user_model_1.User.updateOne({ email: user === null || user === void 0 ? void 0 : user.email }, { $set: { isOnline: true } });
    }
    // if (user.role === 'admin') {
    //   await Admin.updateOne(
    //     { email: user?.email },
    //     { $set: { onlineStatus: 'online' } },
    //   );
    // }
    // if (user.role === 'superAdmin') {
    //   await Admin.updateOne(
    //     { email: user?.email },
    //     { $set: { onlineStatus: 'online' } },
    //   );
    // }
    const ip = request_ip_1.default.getClientIp(req);
    yield user_model_1.User.updateOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }, { ipAddress: ip });
    return {
        accessToken,
        refreshToken,
    };
});
exports.AuthService = {
    loginUserIntoDB,
};
