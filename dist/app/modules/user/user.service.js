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
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const member_constant_1 = require("../member/member.constant");
const request_ip_1 = __importDefault(require("request-ip"));
const member_model_1 = require("../member/member.model");
const createMemberIntoDB = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ip = request_ip_1.default === null || request_ip_1.default === void 0 ? void 0 : request_ip_1.default.getClientIp(req);
    const { password } = req === null || req === void 0 ? void 0 : req.body;
    const { phone } = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.member;
    const existsUser = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (existsUser) {
        throw new AppError_1.default(409, 'User Alrady Exists!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userData = {};
        userData.userId = yield (0, member_constant_1.generateMemberId)();
        userData.phone = phone;
        userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
        userData.password = password;
        userData.role = 'member';
        userData.ipAddress = ip || '';
        const createNewUser = yield user_model_1.User.create([userData], { session });
        if (!(createNewUser === null || createNewUser === void 0 ? void 0 : createNewUser.length)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        payload.userId = createNewUser[0].userId;
        payload.user = createNewUser[0]._id;
        payload.name = payload.name;
        payload.email = createNewUser[0].email;
        payload.about = payload.about;
        // payload.onlineStatus=payload./
        const createNewMember = yield member_model_1.Member.create([payload], { session });
        if (!createNewMember.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Member');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createNewMember;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getMeIntoDB = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'member') {
        result = yield member_model_1.Member.findOne({ email }).populate('user');
    }
    return result;
});
const updateMyProfileIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    ////
});
const getAllUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find();
});
exports.UserService = {
    createMemberIntoDB,
    getMeIntoDB,
    updateMyProfileIntoDB,
    getAllUserIntoDB,
};
