import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/webhooks/ghl
 * GoHighLevel inbound webhook — receives invoice events from GHL workflows.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.GHL_WEBHOOK_SECRET;
  const incoming = req.headers.get('x-ghl-secret');

  if (secret && incoming !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('[GHL Webhook] Received event:', body.type);

    // Log webhook
    await prisma.gHLWebhookLog.create({
      data: {
        eventType: body.type || 'unknown',
        eventData: body,
        processed: false,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[GHL Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
