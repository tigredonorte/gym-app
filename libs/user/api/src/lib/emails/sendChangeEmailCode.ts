import { getEmailTemplate } from '@gym-app/email';
import { IUserDataInfo } from '../request-info-middleware';

interface ISendChangeEmailCode {
  changeEmailLink: string
  changePasswordLink: string
}

export const sendChangeEmailCode = getEmailTemplate<ISendChangeEmailCode & IUserDataInfo>(
  'user/api/src/assets/change-email-attempt',
  'Attempt to change your email',
  {
    title: 'Change your email',
  },
);