import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactSerivece } from './contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await ContactSerivece.createContactIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New Contact Created Successfully',
    data: result,
  });
});

const getMyContact = catchAsync(async (req, res) => {
  const result = await ContactSerivece.getMyContactIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get my contact successfully',
    data: result,
  });
});

export const ContactController = {
  createContact,
  getMyContact,
};
