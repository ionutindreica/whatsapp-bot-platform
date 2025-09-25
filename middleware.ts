import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from './lib/rate-limit';
import { auditLog } from './lib/audit';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Limit unique tokens per interval
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    try {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      await limiter.check(10, ip); // 10 requests per minute per IP
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // Authentication check for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC check for admin routes
    if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin')) {
      const userRole = token.role as string;
      const allowedRoles = ['ROOT_OWNER', 'SUPER_ADMIN'];
      
      if (!allowedRoles.includes(userRole)) {
        await auditLog({
          action: 'ACCESS_DENIED',
          resource: pathname,
          userId: token.sub,
          metadata: { userRole, requiredRoles: allowedRoles }
        });
        
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Workspace access check for workspace-specific routes
    if (pathname.includes('/[workspaceId]') || pathname.includes('/workspace/')) {
      const workspaceId = pathname.split('/')[3]; // Extract workspace ID from URL
      
      if (workspaceId && !token.workspaces?.includes(workspaceId)) {
        await auditLog({
          action: 'WORKSPACE_ACCESS_DENIED',
          resource: pathname,
          userId: token.sub,
          metadata: { workspaceId, userWorkspaces: token.workspaces }
        });
        
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // Audit logging for sensitive routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth')) {
    const token = await getToken({ req: request });
    
    if (token) {
      await auditLog({
        action: 'API_ACCESS',
        resource: pathname,
        userId: token.sub,
        metadata: { 
          method: request.method,
          userAgent: request.headers.get('user-agent'),
          ip: request.ip ?? request.headers.get('x-forwarded-for')
        }
      });
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.pusher.com wss://ws.pusher.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
