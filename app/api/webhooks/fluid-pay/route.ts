import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/webhooks/fluid-pay
 * Fluid Pay inbound webhook — receives payment completion events.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, invoiceId, status, amount } = body;

    console.log('[Fluid Pay Webhook] Payment:', transactionId, status);

    if (status === 'success' && invoiceId) {
      // Update invoice status to paid
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
      });

      if (invoice) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'paid', paidDate: new Date() },
        });

        // Record payment
        await prisma.paymentRecord.create({
          data: {
            invoiceId,
            transactionId,
            amount,
            method: 'credit',
            status: 'success',
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Fluid Pay Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
