import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '@gym-app/user/types';

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