import { IBaseEmailData, IRenderedEmail } from './email.service';

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

  return (email: string, emailData: T): IRenderedEmail => ({
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