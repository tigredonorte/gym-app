import { getEmailTemplate } from '@gym-app/shared/api';

interface ILoginEmailData {
  securitySettingsLink: string,
}
export const getEmailLoginTemplate = getEmailTemplate<ILoginEmailData>(
  'auth/api/login.email',
  'New login on your account',
  { title: 'New Login Alert' },
  process.env['ENABLE_LOGIN_EMAIL'] === 'true'
);
