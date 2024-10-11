import { getEmailTemplate } from '@gym-app/shared/api';
import { IUserDataInfo } from '../request-info-middleware';

interface ISendPasswordChanged {
  recoverLink: string
}

export const sendPasswordChanged = getEmailTemplate<ISendPasswordChanged & IUserDataInfo>(
  'user/api/change-password-success',
  'Password changed successfully',
  {
    title: 'Password changed',
  },
);