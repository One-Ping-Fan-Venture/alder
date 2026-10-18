const TZ = 'America/New_York';

export function formatEastern(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...options }).format(date);
}

export function easternDateLabel(daysFromToday: number) {
  const shifted = new Date(Date.now() + daysFromToday * 24 * 60 * 60 * 1000);
  return formatEastern(shifted, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function easternTodayLabel() {
  return formatEastern(new Date(), { month: 'short', day: 'numeric' });
}

export function easternISODate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function easternClockLabel() {
  return formatEastern(new Date(), { hour: 'numeric', minute: '2-digit' });
}
