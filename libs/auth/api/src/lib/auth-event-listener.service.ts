import { EmailService } from '@gym-app/email';
import { EventService } from '@gym-app/events';
import { UserEventPayload } from '@gym-app/user/api';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { getEmailLoginTemplate } from './emailTemplates';
import { IRequestInfo } from './request-info-middleware';
import { AuthEventTypes } from './auth.events';

export function getUserAccessData(userData: IRequestInfo['userData']) {
  const location = userData.location ? `${userData.location?.city}, ${userData.location?.region}, ${userData.location?.country}`: '';
  const browser = `${userData.deviceInfo?.browser?.name} ${userData.deviceInfo?.browser?.major }`;
  const os = `${userData.deviceInfo?.os?.name} ${userData.deviceInfo?.os?.version}`;
  const device = `${userData.deviceInfo?.device?.vendor} ${userData.deviceInfo?.device?.model}`;
  return { browser, location, os, device };
}

export interface LoginEventPayload {
  user: UserEventPayload;
  userData: IRequestInfo['userData'];
}

@Injectable()
export class AuthEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventService: EventService,
    private emailService: EmailService
  ) {}

  onApplicationBootstrap() {
    this.listenToLoginEvents();
  }

  private listenToLoginEvents() {
    this.eventService.watch('AuthListener', AuthEventTypes.login, (data) => this.loginEventListener(data as LoginEventPayload));
  }

  private async loginEventListener(data: LoginEventPayload) {
    const emailData = getUserAccessData(data.userData);
    await this.emailService.sendRenderedEmail(getEmailLoginTemplate(data.user.email, {
      ...emailData,
      securitySettingsLink: `${process.env['FRONTEND_URL']}/user/security`,
    }));
  }
}
