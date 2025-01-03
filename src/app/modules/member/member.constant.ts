import { User } from '../user/user.model';

/////////////////////// buyer id generate /////////////////////////
const findLastMemberId = async () => {
  const lastMember = await User.findOne(
    {
      role: 'member',
    },
    {
      userId: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastMember?.userId ? lastMember.userId : undefined;
};

export const generateMemberId = async () => {
  const lastMemberId = await findLastMemberId();

  const lastIdNumber = lastMemberId ? parseInt(lastMemberId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  const MemberId = `M-${month}${year}${incrementId}`;
  return MemberId;
};
