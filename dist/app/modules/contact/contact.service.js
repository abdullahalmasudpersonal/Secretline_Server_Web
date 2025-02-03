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
const createContactIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone } = req.body;
    const { userId } = req.user;
    const newContact = { name: name, email: email, phone: phone };
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
    const contact = yield contact_model_1.Contact.findOne({ userId });
    if (!contact) {
        const firstContact = new contact_model_1.Contact({
            userId: userId,
            contacts: [{ name: name, email: email, phone: phone }],
        });
        return yield contact_model_1.Contact.create(firstContact);
    }
    else {
        contact.contacts.push(newContact);
        return yield contact.save();
    }
});
const getMyContactIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    return yield contact_model_1.Contact.findOne({ userId });
});
exports.ContactSerivece = {
    createContactIntoDB,
    getMyContactIntoDB,
};
