import { createChallenge, verifySolution } from 'altcha-lib/v1';

const SECRET_KEY = process.env.AUTH_SECRET || 'varaq-super-secret-altcha-key';

export async function createAltchaChallenge() {
  return await createChallenge({
    hmacKey: SECRET_KEY,
  });
}

export async function verifyAltchaPayload(payload: string): Promise<boolean> {
  if (!payload) return false;

  try {
    const isValid = await verifySolution(payload, SECRET_KEY);
    return isValid;
  } catch (error) {
    console.error('Altcha Verification Error:', error);
    return false;
  }
}
