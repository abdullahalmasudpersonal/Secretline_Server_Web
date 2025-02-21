import { Request } from 'express';
import { Contact } from './contact.model';
import { Member } from '../member/member.model';

const createContactIntoDB = async (req: Request) => {
  const { name, email, phone } = req.body;
  const { userId } = req.user;

  const existingName = await Contact.findOne({
    userId: userId,
    contacts: { $elemMatch: { name: name } },
  });
  if (existingName) {
    throw new Error(`Duplicate contact name: ${name}`);
  }

  const existingEmail = await Contact.findOne({
    userId: userId,
    contacts: { $elemMatch: { email: email } },
  });
  if (existingEmail) {
    throw new Error(`Duplicate contact email: ${email}`);
  }

  const existingPhone = await Contact.findOne({
    userId: userId,
    contacts: { $elemMatch: { phone: phone } },
  });
  if (existingPhone) {
    throw new Error(`Duplicate contact phone: ${phone}`);
  }

  const findUserId = await Member.findOne({ email: email }).select("userId").lean();
  if (!findUserId?.userId) {
    throw new Error("User ID not found for the given email");
  }
  const newContact = { userId: findUserId.userId, name: name, email: email, phone: phone };

  const contact = await Contact.findOne({ userId });
  if (!contact) {
    return await Contact.create({
      userId: userId,
      contacts: [{ userId: findUserId.userId, name: name, email: email, phone: phone }],
    });
  } else {
    contact.contacts.push(newContact);
    return await contact.save();
  }
};

const getMyContactIntoDB = async (req: Request) => {
  const { userId } = req.user;
  return await Contact.findOne({ userId });
};

export const ContactSerivece = {
  createContactIntoDB,
  getMyContactIntoDB,
};
