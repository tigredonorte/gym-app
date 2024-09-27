import { getEmailTemplate } from '@gym-app/email';

interface IRecoverPasswordEmailData {
  recoverCode: string;
  recoverLink: string;
}
export const getRecoverPasswordEmail = getEmailTemplate<IRecoverPasswordEmailData>(
  'auth/api/recover.email',
  'Attempt to recover your password',
  { title: 'Password Recovery' }
);