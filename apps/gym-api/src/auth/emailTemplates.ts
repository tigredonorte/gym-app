import { IRenderedEmail } from "@gym-app/email";

interface IBaseEmailData {
  title: string;
}

interface IRecoverPasswordEmailData {
  recoverCode: string;
  recoverLink: string;
}
export const getRecoverPasswordEmail = getEmailTemplate<IRecoverPasswordEmailData>(
  'recover.email',
  'Attempt to recover your password',
  { title: 'Password Recovery'}
);
 
function getEmailTemplate<EmailData extends IRenderedEmail['emailData']>(
  ejsFile: string, subject: string, emailDefaultData: IBaseEmailData, featureFlag = true
) {
  if (!featureFlag) {
    console.warn(`Feature flag for ${ejsFile} is disabled`);
    return;
  }

  const path = `${__dirname}/assets/${ejsFile}.ejs`;
  return (email: string, emailData: EmailData): IRenderedEmail => ({
    to: email,
    subject,
    emailData: {
      ...emailDefaultData,
      ...emailData,
      now: new Date().toISOString()
    },
    path,
  })
}