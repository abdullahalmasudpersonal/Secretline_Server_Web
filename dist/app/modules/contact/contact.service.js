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
exports.ContactSerivece = void 0;
const contact_model_1 = require("./contact.model");
const member_model_1 = require("../member/member.model");
const createContactIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone } = req.body;
    const { userId } = req.user;
    const existingName = yield contact_model_1.Contact.findOne({
        userId: userId,
        contacts: { $elemMatch: { name: name } },
    });
    if (existingName) {
        throw new Error(`Duplicate contact name: ${name}`);
    }
    const existingEmail = yield contact_model_1.Contact.findOne({
        userId: userId,
        contacts: { $elemMatch: { email: email } },
    });
    if (existingEmail) {
        throw new Error(`Duplicate contact email: ${email}`);
    }
    const existingPhone = yield contact_model_1.Contact.findOne({
        userId: userId,
        contacts: { $elemMatch: { phone: phone } },
    });
    if (existingPhone) {
        throw new Error(`Duplicate contact phone: ${phone}`);
    }
    const findUserId = yield member_model_1.Member.findOne({ email: email }).select("userId").lean();
    if (!(findUserId === null || findUserId === void 0 ? void 0 : findUserId.userId)) {
        throw new Error("User ID not found for the given email");
    }
    const newContact = { userId: findUserId.userId, name: name, email: email, phone: phone };
    const contact = yield contact_model_1.Contact.findOne({ userId });
    if (!contact) {
        return yield contact_model_1.Contact.create({
            userId: userId,
            contacts: [{ userId: findUserId.userId, name: name, email: email, phone: phone }],
        });
    }
    else {
        contact.contacts.push(newContact);
        return yield contact.save();
    }
});
const getMyContactIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const contact = yield contact_model_1.Contact.findOne({ userId });
    // const result = await Contact.aggregate([
    //   { $match: { userId } },
    //   { $unwind: "$contacts" },
    //   // contacts.userId field টি Member কালেকশনের _id এর সাথে মিলিয়ে information নিয়ে আসা
    //   {
    //     $lookup: {
    //       from: "members", // Member collection এর নাম (MongoDB এ collection name ছোট হাতের অক্ষরে থাকতে পারে)
    //       localField: "contacts.userId",
    //       foreignField: "userId",
    //       as: "memberInfo"
    //     }
    //   },
    //   // যদি শুধুমাত্র প্রথম মিলে তথ্য আনতে চান
    //   { $unwind: "$memberInfo" },
    //   {
    //     $project: {
    //       _id: 1,
    //       // userId: userId,
    //       // contacts:,
    //       contactUserId: "$contacts.userId",
    //       profileImg: "$memberInfo.profileImg",
    //       name: "$memberInfo.name",
    //       email: "$memberInfo.email",
    //       phone: "$memberInfo.phone",
    //       about: "$memberInfo.about"
    //     }
    //   }
    // ]);
    const results = yield contact_model_1.Contact.aggregate([
        // প্রথমে userId দ্বারা match করা
        { $match: { userId } },
        // contacts অ্যারে থেকে প্রতিটি contact আলাদা করে নিয়ে আসা
        { $unwind: "$contacts" },
        // lookup করে Member কালেকশন থেকে data নিয়ে আসা, যেখানে contacts.userId ও Member._id মেলানো হবে
        {
            $lookup: {
                from: "members", // Member কালেকশনের নাম, যদি আপনার কালেকশনের নাম members হয়
                localField: "contacts.userId",
                foreignField: "userId", // অথবা যদি Member এর userId ফিল্ড থাকে, তাহলে foreignField: "userId"
                as: "memberData"
            }
        },
        // যদি memberData অ্যারে থেকে সরাসরি অবজেক্ট নিতে চান
        { $unwind: "$memberData" },
        // এখন contacts এবং memberData কে merge করে contacts ফিল্ডে ফিরিয়ে আনতে হবে
        {
            $addFields: {
                "contacts.profileImg": "$memberData.profileImg",
                "contacts.name": "$memberData.name",
                "contacts.email": "$memberData.email",
                // যদি প্রয়োজন থাকে অন্যান্য ফিল্ড
                "contacts.about": "$memberData.about"
            }
        },
        // এরপর আবার সব contacts কে একত্রে গ্রুপ করা
        {
            $group: {
                _id: "$_id",
                userId: { $first: "$userId" },
                contacts: { $push: "$contacts" }
            }
        }
    ]);
    const result = results.length > 0 ? results[0] : null;
    console.log(result, 'results');
    console.log(contact, 'contact');
    return result;
});
// const profileImg = await Member.findOne({ userId }).select("profileImg")
exports.ContactSerivece = {
    createContactIntoDB,
    getMyContactIntoDB,
};
