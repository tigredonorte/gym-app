export interface IUser {
  email: string;
  emailHistory?: {
    confirmed: boolean;
    createdAt: string;
    email: string;
    oldEmail: string;
    changeEmailCode?: string;
    revertChangeEmailCode?: string;
  }[];
}