/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmailService, getEmailTemplate } from '@gym-app/shared/api';
import { IUser, IUserDataInfo } from '@gym-app/user/types';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

@Injectable()
@Processor()
export class UserEmailWorker {
  private queueName: string;

  constructor(
    private readonly configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.queueName = this.configService.get<string>('QUEUE_NAME') || 'default';
  }

  @Process('sendChangeEmailCode') // Job name
  async handleSendChangeEmailCode(job: Job<{
    user: IUser,
    userData: IUserDataInfo,
    oldEmail: string,
    changeEmailCode: string,
  }>) {
    console.log(`Processing job on queue ${this.queueName}:`, job.data);
    const { userData, user, oldEmail, changeEmailCode } = job.data;
    const { id } = user;
    return await this.sendEmail({
      ejsFile: 'user/api/change-email-attempt',
      subject: 'Attempt to change your email',
      featureFlag: true,
      title: 'Change your email',
      email: oldEmail,
      emailData: {
        ...userData,
        changeEmailLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/change-email/${id}/${changeEmailCode}`,
        changePasswordLink: `${process.env['FRONTEND_URL']}/profile/change-password/${id}`,
      },
    });
  }
  @Process('sendDeviceLoginAlert')
  async handleSendDeviceLoginAlert(job: Job<{ user: IUser }>) {
    const { user } = job.data;
    return await this.sendEmail({
      ejsFile: 'auth/api/login.email',
      subject: 'New login on your account',
      featureFlag: process.env['ENABLE_LOGIN_EMAIL'] === 'true',
      title: 'New Login Alert',
      email: user.email,
      emailData: {
        securitySettingsLink: `${process.env['FRONTEND_URL']}/user/security`,
      },
    });
  }

  @Process('sendPasswordChanged')
  async handleSendPasswordChanged(job: Job<any>) {
    const { email, userData } = job.data;
    return await this.sendEmail({
      ejsFile: 'user/api/change-password-success',
      subject: 'Password successfully changed',
      featureFlag: true,
      title: 'Password changed',
      email,
      emailData: {
        recoverLink: `${process.env['FRONTEND_URL']}/auth/forgot-password?email=${email}`,
        ...userData,
      },
    });
  }

  private async sendEmail(data: {
    ejsFile: string,
    subject: string,
    featureFlag: boolean,
    title: string,
    email: string,
    emailData: { [key: string]: any }
  }) {
    const { ejsFile, subject, featureFlag, title, email, emailData } = data;
    const getEmailDataFn = getEmailTemplate(ejsFile, subject, { title }, featureFlag);
    if (!getEmailDataFn) {
      throw new Error('Error getting email template');
    }

    await this.emailService.sendRenderedEmail(getEmailDataFn(email, {
      title,
      ...emailData,
    }));
    return true;
  }
}
