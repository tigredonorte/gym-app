import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = context.switchToHttp().getRequest<Request & { userData?: any; user?: any }>();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const route = request.route ? request.route.path : request.url;

    const userData = request.userData;
    const location = userData.location ? `${userData.location?.city}, ${userData.location?.region}, ${userData.location?.country}`: '';
    const browser = `${userData.deviceInfo?.browser?.name} ${userData.deviceInfo?.browser?.major }`;
    const os = `${userData.deviceInfo?.os?.name} ${userData.deviceInfo?.os?.version}`;
    const device = `${userData.deviceInfo?.device?.vendor} ${userData.deviceInfo?.device?.model}`;

    const isAuthenticated = !!request.user;
    const authStatus = isAuthenticated ? 'authenticated' : 'unauthenticated';

    const requestSize = request.headers['content-length'] ? parseInt(request.headers['content-length'], 10) : 0;
    if (requestSize) {
      this.metricsService.recordRequestSize(method, route, requestSize);
    }

    const endTimer = this.metricsService.startRequestTimer(method, route);
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode.toString();

          this.metricsService.incrementRequestCounter(method, route, response.statusCode.toString());
          endTimer(statusCode);

          const responseSize = response.getHeader('Content-Length') ? parseInt(response.getHeader('Content-Length') as string, 10) : 0;
          if (responseSize) {
            this.metricsService.recordResponseSize(method, route, responseSize);
          }

          const duration = (Date.now() - start) / 1000;
          this.metricsService.recordRequestDuration(method, route, response.statusCode.toString(), duration, {
            location,
            browser,
            os,
            device,
            authStatus,
          });
        },
        error: () => {
          this.metricsService.incrementErrorCounter(method, route, response.statusCode.toString());
        }
      }),
    );
  }
}
