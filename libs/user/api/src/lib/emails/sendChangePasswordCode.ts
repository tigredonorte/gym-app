import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '@gym-app/user/types';

interface ISendChangePasswordCode {
  changePasswordLink: string
}

export const sendChangePasswordCode = getEmailTemplate<ISendChangePasswordCode & IUserDataInfo>(
  'user/api/change-password-attempt',
  'Attempt to change your password',
  {
    title: 'Change your password',
  },
);