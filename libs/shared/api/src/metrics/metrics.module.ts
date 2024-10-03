import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    MetricsService,
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'location', 'browser', 'os', 'device', 'authStatus'],
    }),
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeCounterProvider({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeCounterProvider({
      name: 'user_logins_total',
      help: 'Total number of user logins',
    }),
    makeCounterProvider({
      name: 'user_logouts_total',
      help: 'Total number of user logouts',
    }),
    makeHistogramProvider({
      name: 'http_request_size_bytes',
      help: 'Size of HTTP requests in bytes',
      labelNames: ['method', 'route'],
      buckets: [500, 1000, 5000, 10000, 50000, 100000],
    }),
    makeHistogramProvider({
      name: 'http_response_size_bytes',
      help: 'Size of HTTP responses in bytes',
      labelNames: ['method', 'route'],
      buckets: [500, 1000, 5000, 10000, 50000, 100000],
    }),
    makeCounterProvider({
      name: 'authentication_attempts_total',
      help: 'Total number of authentication attempts',
      labelNames: ['status'],
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
