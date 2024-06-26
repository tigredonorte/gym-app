import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { renderFile } from 'ejs';
import * as _ from 'lodash';
import { EmailLoggerService } from './emailLogger.service';

export interface ISendMail {
  from?: string;
  to: string;
  html: string;
  subject: string;
}

export interface IRenderedEmail {
  path: string;
  to: string;
  subject: string;
  emailData: Record<string, unknown>;
}

@Injectable()
export class EmailService {
  public constructor(private emailLoggerService: EmailLoggerService) {
    this.setApiKey();
  }

  private setApiKey(): void {
    const apiKey = process.env['SENDGRID_API_KEY'];

    if (!apiKey) {
      throw Error('SENDGRID_API_KEY is not set');
    }

    sgMail.setApiKey(apiKey);
  }

  public async sendEmail({
    to,
    from = process.env['SENDGRID_FROM_EMAIL'],
    subject,
    html,
  }: ISendMail): Promise<[sgMail.ClientResponse, object] | unknown> {
    if (!from) {
      throw Error('SENDGRID_FROM_EMAIL is not set');
    }

    if (!to) {
      throw Error('Recipient email is required');
    }

    if (!subject) {
      throw Error('Email subject is required');
    }

    if (!html) {
      throw Error('Email html is required');
    }

    try {
      const response = await sgMail.send({
        to,
        from,
        subject,
        html,
      });
      return response;
    } catch (error) {
      const logError = _.get(error, 'response.body') || error;
      console.error('Email sending error:', logError);
      return logError;
    }
  }

  public async sendRenderedEmail(data: IRenderedEmail | null) {
    if (!data) {
      return;
    }

    const html = await this.renderEmail(data);
    const from = process.env['SENDGRID_FROM_EMAIL'];

    const newEmail = data;

    const response = await this.sendEmail({ ...newEmail, html, from });

    await this.logEmailSent({ ...newEmail, html, from, response });
  }

  private renderEmail({ path, emailData }: IRenderedEmail): Promise<string> {
    return new Promise((resolve, reject) => {
      renderFile(path, emailData, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private async logEmailSent(data: ISendMail & { response: unknown }) {
    try {
      const { subject, ...details } = data;
      const emailLog = {
        template: subject,
        date: new Date().toISOString(),
        details,
      };

      await this.emailLoggerService.saveEmailLog(emailLog);
    } catch (error) {
      Logger.error('Error while saving email log', error);
    }
  }
}
