import { NextRequest, NextResponse } from 'next/server';

import { verifyPayment } from '@/lib/actions/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackId, success } = body;

    if (!trackId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const result = await verifyPayment(
      trackId.toString(),
      success?.toString() || '1',
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Payment verified successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
