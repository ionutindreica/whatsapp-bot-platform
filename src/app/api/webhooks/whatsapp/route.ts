import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/services/integrations/whatsapp';
import { queueManager } from '@/services/jobs/queue';
import { auditLog } from '@/lib/audit';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (!mode || !token || !challenge) {
    logger.warn('WhatsApp webhook verification failed - missing parameters');
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const result = await whatsappService.validateWebhook(mode, token, challenge);
  
  if (result) {
    logger.info('WhatsApp webhook verified successfully');
    return new NextResponse(result);
  }

  logger.warn('WhatsApp webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    logger.info('WhatsApp webhook received', {
      entryCount: body.entry?.length || 0,
      object: body.object,
    });

    // Process webhook events
    const messages = await whatsappService.processWebhookEvent(body);

    // Queue background jobs for each message
    for (const message of messages) {
      await queueManager.addAnalyticsJob({
        type: 'message_received',
        workspaceId: message.workspaceId, // This would be determined from your logic
        data: {
          platform: 'whatsapp',
          messageId: message.id,
          from: message.from,
          timestamp: message.timestamp,
          type: message.type,
        },
      });

      // Audit log the webhook event
      await auditLog({
        action: 'WEBHOOK_RECEIVED',
        resource: 'whatsapp',
        metadata: {
          messageId: message.id,
          from: message.from,
          type: message.type,
          platform: 'whatsapp',
        },
        ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    logger.error('WhatsApp webhook processing failed', {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
