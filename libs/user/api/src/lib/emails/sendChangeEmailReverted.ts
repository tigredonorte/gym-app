import { getEmailTemplate } from '@gym-app/shared/api';

export const sendChangeEmailReverted = getEmailTemplate(
  'user/api/change-email-reverted',
  'Change email reverted successfully',
  {
    title: 'Change email reverted successfully',
  },
);