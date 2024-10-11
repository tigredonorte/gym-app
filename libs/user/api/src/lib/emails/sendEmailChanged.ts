import { getEmailTemplate } from '@gym-app/shared/api';

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