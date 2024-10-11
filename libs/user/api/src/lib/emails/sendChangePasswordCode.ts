import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '../request-info-middleware';

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