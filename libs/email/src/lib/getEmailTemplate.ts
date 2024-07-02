import { IBaseEmailData, IRenderedEmail, IUserDataInfo } from './email.service';

export function getEmailTemplate<T>(
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

  return (email: string, emailData: T & IUserDataInfo): IRenderedEmail => ({
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