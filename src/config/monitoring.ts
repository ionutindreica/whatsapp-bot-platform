import { config } from '../lib/config';

// Monitoring configuration
export const monitoringConfig = {
  // Development - Basic logging
  development: {
    level: 'debug',
    enableMetrics: false,
    enableTracing: false,
    enableAlerts: false,
  },

  // Staging - Full monitoring
  staging: {
    level: 'info',
    enableMetrics: true,
    enableTracing: true,
    enableAlerts: true,
  },

  // Production - Enterprise monitoring
  production: {
    level: 'warn',
    enableMetrics: true,
    enableTracing: true,
    enableAlerts: true,
    enableProfiling: true,
  },
};

// Sentry configuration
export const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.npm_package_version || '1.0.0',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    // Add integrations as needed
  ],
  beforeSend(event) {
    // Filter sensitive data
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
};

// Prometheus configuration
export const prometheusConfig = {
  port: parseInt(process.env.METRICS_PORT || '9090'),
  path: '/metrics',
  collectDefaultMetrics: {
    timeout: 5000,
  },
  customMetrics: {
    // Application metrics
    httpRequestsTotal: 'counter',
    httpRequestDuration: 'histogram',
    activeConnections: 'gauge',
    queueJobsTotal: 'counter',
    queueJobsDuration: 'histogram',
    databaseConnections: 'gauge',
    redisConnections: 'gauge',
    
    // Business metrics
    usersTotal: 'gauge',
    workspacesTotal: 'gauge',
    botsTotal: 'gauge',
    messagesTotal: 'counter',
    apiCallsTotal: 'counter',
  },
};

// Grafana configuration
export const grafanaConfig = {
  url: process.env.GRAFANA_URL || 'http://localhost:3001',
  username: process.env.GRAFANA_USERNAME || 'admin',
  password: process.env.GRAFANA_PASSWORD || 'admin',
  dashboards: [
    {
      name: 'Application Overview',
      uid: 'app-overview',
      panels: [
        'HTTP Requests',
        'Response Times',
        'Error Rates',
        'Active Users',
        'Database Performance',
        'Redis Performance',
        'Queue Status',
      ],
    },
    {
      name: 'Business Metrics',
      uid: 'business-metrics',
      panels: [
        'User Growth',
        'Workspace Activity',
        'Bot Performance',
        'Message Volume',
        'API Usage',
        'Revenue Metrics',
      ],
    },
    {
      name: 'Infrastructure',
      uid: 'infrastructure',
      panels: [
        'CPU Usage',
        'Memory Usage',
        'Disk Usage',
        'Network I/O',
        'Database Connections',
        'Redis Memory',
      ],
    },
  ],
};

// Loki configuration for log aggregation
export const lokiConfig = {
  url: process.env.LOKI_URL || 'http://localhost:3100',
  labels: {
    job: 'whatsapp-bot-platform',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  },
  streams: [
    {
      stream: { level: 'error' },
      values: [],
    },
    {
      stream: { level: 'warn' },
      values: [],
    },
    {
      stream: { level: 'info' },
      values: [],
    },
  ],
};

// Alerting configuration
export const alertingConfig = {
  // Critical alerts
  critical: [
    {
      name: 'High Error Rate',
      condition: 'rate(http_requests_total{status=~"5.."}[5m]) > 0.1',
      severity: 'critical',
      notification: ['slack', 'email', 'pagerduty'],
    },
    {
      name: 'Database Down',
      condition: 'up{job="database"} == 0',
      severity: 'critical',
      notification: ['slack', 'email', 'pagerduty'],
    },
    {
      name: 'Redis Down',
      condition: 'up{job="redis"} == 0',
      severity: 'critical',
      notification: ['slack', 'email', 'pagerduty'],
    },
    {
      name: 'High Memory Usage',
      condition: 'memory_usage_percent > 90',
      severity: 'critical',
      notification: ['slack', 'email'],
    },
  ],

  // Warning alerts
  warning: [
    {
      name: 'High Response Time',
      condition: 'histogram_quantile(0.95, http_request_duration_seconds) > 2',
      severity: 'warning',
      notification: ['slack'],
    },
    {
      name: 'Queue Backlog',
      condition: 'queue_jobs_pending > 1000',
      severity: 'warning',
      notification: ['slack'],
    },
    {
      name: 'Low Disk Space',
      condition: 'disk_usage_percent > 80',
      severity: 'warning',
      notification: ['slack'],
    },
  ],
};

// Notification channels
export const notificationChannels = {
  slack: {
    webhook: process.env.SLACK_WEBHOOK_URL,
    channel: process.env.SLACK_ALERT_CHANNEL || '#alerts',
    username: 'Monitoring Bot',
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.ALERT_EMAIL_FROM || 'alerts@yourdomain.com',
    to: process.env.ALERT_EMAIL_TO?.split(',') || ['admin@yourdomain.com'],
  },
  pagerduty: {
    integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
    serviceKey: process.env.PAGERDUTY_SERVICE_KEY,
  },
};

// Health check configuration
export const healthCheckConfig = {
  endpoints: [
    {
      name: 'Database',
      url: '/api/health/database',
      interval: 30000, // 30 seconds
      timeout: 5000,
    },
    {
      name: 'Redis',
      url: '/api/health/redis',
      interval: 30000,
      timeout: 5000,
    },
    {
      name: 'Storage',
      url: '/api/health/storage',
      interval: 60000, // 1 minute
      timeout: 10000,
    },
    {
      name: 'External APIs',
      url: '/api/health/external',
      interval: 120000, // 2 minutes
      timeout: 15000,
    },
  ],
  alertThresholds: {
    consecutiveFailures: 3,
    responseTime: 5000, // 5 seconds
  },
};

// Performance monitoring
export const performanceConfig = {
  // Web Vitals
  webVitals: {
    enabled: true,
    metrics: ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'],
    thresholds: {
      CLS: 0.1,
      FID: 100,
      FCP: 1800,
      LCP: 2500,
      TTFB: 600,
    },
  },

  // API Performance
  apiPerformance: {
    enabled: true,
    slowQueryThreshold: 1000, // 1 second
    slowRequestThreshold: 2000, // 2 seconds
  },

  // Database Performance
  databasePerformance: {
    enabled: true,
    slowQueryThreshold: 1000,
    connectionPoolThreshold: 80, // 80% of max connections
  },
};

// Get current monitoring configuration
export function getMonitoringConfig() {
  const env = process.env.NODE_ENV || 'development';
  return monitoringConfig[env as keyof typeof monitoringConfig];
}

// Initialize monitoring
export function initializeMonitoring() {
  const config = getMonitoringConfig();

  // Initialize Sentry
  if (sentryConfig.dsn) {
    const Sentry = require('@sentry/nextjs');
    Sentry.init(sentryConfig);
  }

  // Initialize Prometheus metrics
  if (config.enableMetrics) {
    const client = require('prom-client');
    
    // Register default metrics
    client.collectDefaultMetrics(prometheusConfig.collectDefaultMetrics);

    // Register custom metrics
    Object.entries(prometheusConfig.customMetrics).forEach(([name, type]) => {
      switch (type) {
        case 'counter':
          new client.Counter({ name, help: `${name} total` });
          break;
        case 'gauge':
          new client.Gauge({ name, help: `${name} current value` });
          break;
        case 'histogram':
          new client.Histogram({ name, help: `${name} duration` });
          break;
      }
    });
  }

  return config;
}

export default monitoringConfig;
