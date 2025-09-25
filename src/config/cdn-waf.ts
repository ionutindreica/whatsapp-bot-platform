import { config } from '../lib/config';

// CDN and WAF configuration
export const cdnWafConfig = {
  // Cloudflare configuration
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    domain: process.env.CLOUDFLARE_DOMAIN,
    
    // WAF rules
    wafRules: [
      {
        name: 'Block SQL Injection',
        expression: 'http.request.uri.query contains "union" or http.request.uri.query contains "select" or http.request.uri.query contains "insert"',
        action: 'block',
        enabled: true,
      },
      {
        name: 'Block XSS Attacks',
        expression: 'http.request.uri.query contains "<script" or http.request.uri.query contains "javascript:"',
        action: 'block',
        enabled: true,
      },
      {
        name: 'Rate Limiting',
        expression: 'rate(10m) > 100',
        action: 'challenge',
        enabled: true,
      },
      {
        name: 'Block Bad User Agents',
        expression: 'http.user_agent contains "bot" and http.user_agent not contains "Googlebot"',
        action: 'challenge',
        enabled: true,
      },
    ],
    
    // Page rules
    pageRules: [
      {
        url: 'api/*',
        settings: {
          cache_level: 'bypass',
          security_level: 'high',
          browser_cache_ttl: 0,
          edge_cache_ttl: 0,
        },
      },
      {
        url: 'static/*',
        settings: {
          cache_level: 'cache_everything',
          browser_cache_ttl: 31536000, // 1 year
          edge_cache_ttl: 86400, // 1 day
        },
      },
      {
        url: 'images/*',
        settings: {
          cache_level: 'cache_everything',
          browser_cache_ttl: 2592000, // 30 days
          edge_cache_ttl: 86400, // 1 day
        },
      },
    ],
    
    // Security settings
    security: {
      ssl: 'strict',
      minTlsVersion: '1.2',
      hsts: true,
      hstsMaxAge: 31536000,
      opportunisticEncryption: true,
      tls1_3: true,
      automaticHttpsRewrites: true,
      alwaysUseHttps: true,
    },
    
    // Performance settings
    performance: {
      brotli: true,
      gzip: true,
      minify: {
        css: true,
        html: true,
        js: true,
      },
      rocketLoader: true,
      mirage: true,
      polish: 'lossy',
      imageResizing: true,
    },
  },

  // AWS CloudFront configuration
  cloudfront: {
    distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    domain: process.env.CLOUDFRONT_DOMAIN,
    
    // Cache behaviors
    cacheBehaviors: [
      {
        pathPattern: '/api/*',
        targetOriginId: 'api-origin',
        viewerProtocolPolicy: 'https-only',
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad', // CachingDisabled
        originRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf', // CORS-S3Origin
        responseHeadersPolicyId: '5cc3b908-e619-4b99-88e5-2cf7f45965bd', // SecurityHeadersPolicy
      },
      {
        pathPattern: '/static/*',
        targetOriginId: 'static-origin',
        viewerProtocolPolicy: 'redirect-to-https',
        cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // CachingOptimized
        compress: true,
      },
      {
        pathPattern: '/images/*',
        targetOriginId: 'images-origin',
        viewerProtocolPolicy: 'redirect-to-https',
        cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // CachingOptimized
        compress: true,
      },
    ],
    
    // WAF configuration
    waf: {
      webAclId: process.env.WAF_WEB_ACL_ID,
      rules: [
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: 'none',
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'CommonRuleSetMetric',
          },
        },
        {
          name: 'AWSManagedRulesKnownBadInputsRuleSet',
          priority: 2,
          overrideAction: 'none',
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'KnownBadInputsRuleSetMetric',
          },
        },
        {
          name: 'AWSManagedRulesSQLiRuleSet',
          priority: 3,
          overrideAction: 'none',
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'SQLiRuleSetMetric',
          },
        },
      ],
    },
  },
};

// Edge computing configuration
export const edgeConfig = {
  // Cloudflare Workers
  cloudflareWorkers: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    
    workers: [
      {
        name: 'api-proxy',
        script: `
          addEventListener('fetch', event => {
            event.respondWith(handleRequest(event.request))
          })
          
          async function handleRequest(request) {
            const url = new URL(request.url)
            
            // Add security headers
            const response = await fetch(request)
            const newResponse = new Response(response.body, response)
            
            newResponse.headers.set('X-Content-Type-Options', 'nosniff')
            newResponse.headers.set('X-Frame-Options', 'DENY')
            newResponse.headers.set('X-XSS-Protection', '1; mode=block')
            newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
            
            return newResponse
          }
        `,
        route: 'api.yourdomain.com/*',
        environment: 'production',
      },
      {
        name: 'rate-limiter',
        script: `
          addEventListener('fetch', event => {
            event.respondWith(handleRequest(event.request))
          })
          
          async function handleRequest(request) {
            const clientIP = request.headers.get('CF-Connecting-IP')
            const key = \`rate_limit:\${clientIP}\`
            
            // Check rate limit using KV storage
            const count = await RATE_LIMIT_KV.get(key)
            const currentCount = count ? parseInt(count) : 0
            
            if (currentCount > 100) {
              return new Response('Rate limit exceeded', { status: 429 })
            }
            
            // Increment counter
            await RATE_LIMIT_KV.put(key, (currentCount + 1).toString(), { expirationTtl: 3600 })
            
            return fetch(request)
          }
        `,
        kvNamespaces: ['RATE_LIMIT_KV'],
        route: '*',
        environment: 'production',
      },
    ],
  },

  // AWS Lambda@Edge
  lambdaEdge: {
    functions: [
      {
        name: 'security-headers',
        runtime: 'nodejs18.x',
        handler: 'index.handler',
        code: `
          exports.handler = (event, context, callback) => {
            const response = event.Records[0].cf.response;
            const headers = response.headers;
            
            headers['x-content-type-options'] = [{ value: 'nosniff' }];
            headers['x-frame-options'] = [{ value: 'DENY' }];
            headers['x-xss-protection'] = [{ value: '1; mode=block' }];
            headers['referrer-policy'] = [{ value: 'strict-origin-when-cross-origin' }];
            
            callback(null, response);
          };
        `,
        eventType: 'origin-response',
      },
      {
        name: 'auth-rewrite',
        runtime: 'nodejs18.x',
        handler: 'index.handler',
        code: `
          exports.handler = (event, context, callback) => {
            const request = event.Records[0].cf.request;
            const uri = request.uri;
            
            // Rewrite API routes
            if (uri.startsWith('/api/')) {
              request.uri = uri.replace('/api/', '/api/v1/');
            }
            
            callback(null, request);
          };
        `,
        eventType: 'origin-request',
      },
    ],
  },
};

// Security headers configuration
export const securityHeaders = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://api.pusher.com", "wss://ws.pusher.com"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },

  // Additional security headers
  additional: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  },
};

// Performance optimization
export const performanceConfig = {
  // Image optimization
  images: {
    formats: ['webp', 'avif'],
    quality: 80,
    sizes: [320, 640, 768, 1024, 1280, 1536],
    placeholder: 'blur',
  },

  // Compression
  compression: {
    gzip: true,
    brotli: true,
    minSize: 1024,
    exclude: ['image/', 'video/', 'audio/'],
  },

  // Caching
  caching: {
    static: {
      ttl: 31536000, // 1 year
      immutable: true,
    },
    api: {
      ttl: 0, // No cache
      vary: ['Authorization', 'Accept'],
    },
    pages: {
      ttl: 3600, // 1 hour
      vary: ['Accept-Language'],
    },
  },
};

// Get current CDN/WAF configuration
export function getCdnWafConfig() {
  const provider = process.env.CDN_PROVIDER || 'cloudflare';
  
  switch (provider) {
    case 'cloudflare':
      return cdnWafConfig.cloudflare;
    case 'cloudfront':
      return cdnWafConfig.cloudfront;
    default:
      return cdnWafConfig.cloudflare;
  }
}

// CDN health check
export async function checkCdnHealth() {
  const config = getCdnWafConfig();
  
  try {
    const start = Date.now();
    
    if (config.zoneId) {
      // Cloudflare API check
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${config.zoneId}`, {
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`CDN API error: ${response.status}`);
      }
    }
    
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: duration,
      provider: process.env.CDN_PROVIDER || 'cloudflare',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      provider: process.env.CDN_PROVIDER || 'cloudflare',
      timestamp: new Date().toISOString(),
    };
  }
}

export default cdnWafConfig;
