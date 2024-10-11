import { getEmailTemplate } from '@gym-app/shared/api';

interface IRecoverPasswordEmailData {
  recoverCode: string;
  recoverLink: string;
}
export const getRecoverPasswordEmail = getEmailTemplate<IRecoverPasswordEmailData>(
  'auth/api/recover.email',
  'Attempt to recover your password',
  { title: 'Password Recovery' }
);