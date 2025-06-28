import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_request_duration_seconds') public readonly responseTimeHistogram: Histogram<string>,
    @InjectMetric('http_requests_total') public readonly requestCounter: Counter<string>,
    @InjectMetric('http_errors_total') public readonly errorCounter: Counter<string>,
    @InjectMetric('user_logins_total') public readonly loginCounter: Counter<string>,
    @InjectMetric('user_logouts_total') public readonly logoutCounter: Counter<string>,
    @InjectMetric('http_request_size_bytes') public readonly requestSizeHistogram: Histogram<string>,
    @InjectMetric('http_response_size_bytes') public readonly responseSizeHistogram: Histogram<string>,
    @InjectMetric('authentication_attempts_total') public readonly authenticationCounter: Counter<string>,
  ) {}

  incrementRequestCounter(method: string, route: string, statusCode: string): void {
    this.requestCounter.labels(method, route, statusCode).inc();
  }

  incrementErrorCounter(method: string, route: string, statusCode: string): void {
    this.errorCounter.labels(method, route, statusCode).inc();
  }

  recordRequestDuration(
    method: string,
    route: string,
    statusCode: string,
    duration: number,
    labels: { location: string; browser: string; os: string; device: string; authStatus: string },
  ): void {
    this.responseTimeHistogram
      .labels(method, route, statusCode, labels.location, labels.browser, labels.os, labels.device, labels.authStatus)
      .observe(duration);
  }

  startRequestTimer(method: string, route: string): (statusCode: string) => void {
    const end = this.responseTimeHistogram.startTimer();
    return (statusCode: string) => {
      end({ method, route, status_code: statusCode });
    };
  }

  incrementLoginCounter(): void {
    this.loginCounter.inc();
  }

  incrementLogoutCounter(): void {
    this.logoutCounter.inc();
  }

  recordRequestSize(method: string, route: string, size: number): void {
    this.requestSizeHistogram.labels(method, route).observe(size);
  }

  recordResponseSize(method: string, route: string, size: number): void {
    this.responseSizeHistogram.labels(method, route).observe(size);
  }

  incrementAuthenticationCounter(isAuthenticated: boolean): void {
    const status = isAuthenticated ? 'authenticated' : 'unauthenticated';
    this.authenticationCounter.labels(status).inc();
  }
}
