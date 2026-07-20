import { v4 } from './uuid';

export function generateSessionId(): string {
  return v4();
}
