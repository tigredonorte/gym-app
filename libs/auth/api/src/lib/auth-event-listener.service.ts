import { EmailService } from '@gym-app/email';
import { EventService } from '@gym-app/events';
import { IRequestInfo, UserEventPayload } from '@gym-app/user/api';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthEventTypes } from './auth.events';
import { getEmailLoginTemplate } from './emails/loginAlertEmail';

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
  sessionId: string;
  isFirstTimeOnDevice: boolean;
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
    await this.sendEmailWhenUserLoggedIn(data);
  }

  private async sendEmailWhenUserLoggedIn(data: LoginEventPayload) {
    if (!data.isFirstTimeOnDevice) {
      return console.info('Session already exists', { userId: data.user.id, sessionId: data.sessionId });
    }
    const emailData = getUserAccessData(data.userData);
    await this.emailService.sendRenderedEmail(getEmailLoginTemplate(data.user.email, {
      ...emailData,
      securitySettingsLink: `${process.env['FRONTEND_URL']}/user/security`,
    }));
  }
}
