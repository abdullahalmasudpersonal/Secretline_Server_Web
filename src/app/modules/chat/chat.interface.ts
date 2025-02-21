// export interface TChatUserId {
//   userId: string;
// }
export interface TChat {
  userIds: string[]; // IDs of users in the chat
  lastMessage?: string;
  updatedAt: Date;
}
