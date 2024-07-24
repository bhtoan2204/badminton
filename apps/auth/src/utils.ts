import * as crypto from 'crypto';

export function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash;
}

export function comparePassword(
  password: string,
  hashedPassword: string,
  salt: string,
): boolean {
  const hash = hashPassword(password, salt);
  return hash === hashedPassword;
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}
