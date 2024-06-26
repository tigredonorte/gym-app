import { IRenderedEmail } from '@gym-app/email';

interface IBaseEmailData {
  title: string;
}

interface IUserDataInfo {
  browser: string;
  location: string;
  os: string;
  device: string;
}

interface IRecoverPasswordEmailData extends IUserDataInfo {
  recoverCode: string;
  recoverLink: string;
}
export const getRecoverPasswordEmail = getEmailTemplate<IRecoverPasswordEmailData>(
  'recover.email',
  'Attempt to recover your password',
  { title: 'Password Recovery'}
);

interface ILoginEmailData extends IUserDataInfo {
  securitySettingsLink: string,
}
export const getEmailLoginTemplate = getEmailTemplate<ILoginEmailData>(
  'login.email',
  'New login on your account',
  { title: 'New Login Alert' },
  process.env['ENABLE_LOGIN_EMAIL'] === 'true'
);

function getEmailTemplate<EmailData = ILoginEmailData | IRecoverPasswordEmailData>(
  ejsFile: string,
  subject: string,
  emailDefaultData: IBaseEmailData,
  featureFlag = true
) {
  const path = `${__dirname}/assets/${ejsFile}.ejs`;
  if (!featureFlag) {
    console.warn(`Feature flag for ${ejsFile} is disabled`);
    return () => null;
  }

  return (email: string, emailData: EmailData): IRenderedEmail => ({
    to: email,
    subject,
    emailData: {
      ...emailDefaultData,
      ...emailData,
      now: new Date().toISOString()
    },
    path,
  });
}