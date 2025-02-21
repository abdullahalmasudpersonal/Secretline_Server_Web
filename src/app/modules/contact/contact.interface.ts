export type TContactUser = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  about?: string;
};
export type TContact = {
  userId: string;
  contacts: TContactUser[];
};
