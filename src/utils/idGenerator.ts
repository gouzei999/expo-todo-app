/**
 * Simple ID generator — avoids uuid dependency which may not work in Hermes.
 * Uses Math.random + timestamp for uniqueness.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomPart}`;
}
