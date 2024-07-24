import { getEmailTemplate } from '@gym-app/email';
import { IUserDataInfo } from '../request-info-middleware';

interface ISendChangePasswordCode {
  changePasswordLink: string
}

export const sendChangePasswordCode = getEmailTemplate<ISendChangePasswordCode & IUserDataInfo>(
  'user/api/src/assets/change-password-attempt',
  'Attempt to change your password',
  {
    title: 'Change your password',
  },
);