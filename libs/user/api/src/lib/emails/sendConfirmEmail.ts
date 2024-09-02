import { getEmailTemplate } from '@gym-app/email';
import { IUserDataInfo } from '../request-info-middleware';

interface ISendConfirmEmail {
  email: string
  code: string
}

export const sendConfirmEmail = getEmailTemplate<ISendConfirmEmail & IUserDataInfo>(
  'user/api/confirm-email',
  'Confirm your email',
  {
    title: 'Email Confirmation',
  },
);