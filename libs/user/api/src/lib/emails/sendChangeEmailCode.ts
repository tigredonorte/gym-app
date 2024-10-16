import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '@gym-app/user/types';

interface ISendChangeEmailCode {
  changeEmailLink: string
  changePasswordLink: string
}

export const sendChangeEmailCode = getEmailTemplate<ISendChangeEmailCode & IUserDataInfo>(
  'user/api/change-email-attempt',
  'Attempt to change your email',
  {
    title: 'Change your email',
  },
);