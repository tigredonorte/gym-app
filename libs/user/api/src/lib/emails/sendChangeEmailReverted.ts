import { getEmailTemplate } from '@gym-app/email';

export const sendChangeEmailReverted = getEmailTemplate(
  'user/api/change-email-reverted',
  'Change email reverted successfully',
  {
    title: 'Change email reverted successfully',
  },
);