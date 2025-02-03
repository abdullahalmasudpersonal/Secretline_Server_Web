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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMemberId = void 0;
const user_model_1 = require("../user/user.model");
/////////////////////// buyer id generate /////////////////////////
const findLastMemberId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastMember = yield user_model_1.User.findOne({
        role: 'member',
    }, {
        userId: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastMember === null || lastMember === void 0 ? void 0 : lastMember.userId) ? lastMember.userId : undefined;
});
const generateMemberId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastMemberId = yield findLastMemberId();
    const lastIdNumber = lastMemberId ? parseInt(lastMemberId.slice(-6)) : 0;
    const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const MemberId = `M-${month}${year}${incrementId}`;
    return MemberId;
});
exports.generateMemberId = generateMemberId;
