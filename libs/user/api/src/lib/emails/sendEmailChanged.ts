import { getEmailTemplate } from '@gym-app/email';

interface IChangedEmail {
  revertChangeEmailLink: string
}

export const sendEmailChanged = getEmailTemplate<IChangedEmail>(
  'user/api/email-changed',
  'Email changed successfully',
  {
    title: 'Email changed successfully',
  },
);