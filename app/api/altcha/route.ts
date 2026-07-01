import { NextResponse } from 'next/server';

import { createAltchaChallenge } from '@/lib/altcha';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const challenge = await createAltchaChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate challenge: ${error} ` },
      { status: 500 },
    );
  }
}
