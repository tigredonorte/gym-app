import { EmailService, logger } from '@gym-app/shared/api';
import { renderChangeEmailAttempt } from '@gym-app/user/emails';
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

  @Process('changeEmailCode')
  async changeEmailCode(job: Job<{
    user: IUser,
    userData: IUserDataInfo,
    oldEmail: string,
    changeEmailCode: string,
  }>) {
    logger.info(`Processing job on queue ${this.queueName}:`, job.data);
    const { userData, user, oldEmail, changeEmailCode } = job.data;
    const { id } = user;

    const html = await renderChangeEmailAttempt({
      ...userData,
      title: 'Change your email',
      changeEmailLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/change-email/${id}/${changeEmailCode}`,
      changePasswordLink: `${process.env['FRONTEND_URL']}/profile/change-password/${id}`
    });

    const result = await this.emailService.sendEmail({
      to: oldEmail,
      subject: 'Attempt to change your email',
      html,
    });

    return result;
  }

  @Process('revertChangeEmailCode')
  async revertChangeEmailCode(job: Job<{
    email: string,
  }>) {
    logger.info(`Processing job on queue ${this.queueName}:`, job.data);

    // await this.emailService.sendRenderedEmail(sendChangeEmailReverted(oldEmail, {}));
    // const { email } = job.data;

    // const html = await renderRevertChangeEmailCode()

    // const result = await this.emailService.sendEmail({
    //   to: oldEmail,
    //   subject: 'Change email reverted successfully',
    //   html,
    // });

    // return result;
  }
}
