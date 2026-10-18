export const SESSION_KEY = 'alder_session';
export const DEMO_USERNAME = 'demo';
export const DEMO_PASSWORD = 'N0rthstar#Billing2026!';

export function credentialsMatch(username: string, password: string) {
  return username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function readSession() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_KEY) === '1';
}

export function writeSession() {
  localStorage.setItem(SESSION_KEY, '1');
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
