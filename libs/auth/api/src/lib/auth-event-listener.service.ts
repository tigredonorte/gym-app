import { EmailService } from '@gym-app/shared/api';
import { EventService } from '@gym-app/events';
import { IRequestInfo, UserEventPayload, getUserAccessData } from '@gym-app/user/api';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthEventTypes } from './auth.events';
import { getEmailLoginTemplate } from './emails/loginAlertEmail';

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
