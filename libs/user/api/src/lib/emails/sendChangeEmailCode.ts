import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '../request-info-middleware';

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