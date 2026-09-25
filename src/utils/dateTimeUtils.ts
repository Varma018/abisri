/**
 * Utility functions for formatting and resolving exact inquiry dates and times.
 */

export interface InquiryDateTimeInfo {
  dateStr: string;      // e.g. "25 Sep 2026"
  timeStr: string;      // e.g. "10:15 AM"
  fullStr: string;      // e.g. "25 Sep 2026, 10:15 AM"
  relativeStr: string;  // e.g. "Just now", "12m ago", "2h ago", "Yesterday", "5d ago"
  iso: string;          // ISO string representation
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Checks if a string is a vague or placeholder relative string like "Today, Just now"
 */
function isVaguePlaceholder(str?: string): boolean {
  if (!str) return true;
  const s = str.trim().toLowerCase();
  return (
    s === 'today, just now' ||
    s === 'just now' ||
    s === 'today' ||
    s === 'yesterday' ||
    s === '2 days ago' ||
    s.includes('just now')
  );
}

/**
 * Attempts to parse any date input (ISO string, timestamp string, or Date)
 */
export function parseDateSafe(input?: string | number | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed || isVaguePlaceholder(trimmed)) return null;

    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

/**
 * Formats a Date object into human-readable exact date and 12-hour time
 */
export function formatExactDateTime(dateInput?: Date | string | number | null): string {
  const d = parseDateSafe(dateInput) || (dateInput instanceof Date && !isNaN(dateInput.getTime()) ? dateInput : new Date());

  const day = d.getDate().toString().padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Computes a dynamic relative time label (e.g. "Just now", "4m ago", "2h ago", "Yesterday", "4d ago")
 */
export function getRelativeTimeText(dateObj: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  // If in the future or under 60 seconds
  if (diffMs < 60000) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`;
  return `${Math.floor(diffDay / 365)}y ago`;
}

/**
 * Resolves full date, time, and relative details for an inquiry,
 * prioritizing real ISO timestamps (createdAt) over placeholder strings.
 */
export function getInquiryDateTime(timestamp?: string, createdAt?: string): InquiryDateTimeInfo {
  // 1. Try createdAt first (this is the true database / system creation timestamp)
  let dateObj = parseDateSafe(createdAt);

  // 2. If no valid createdAt, try parsing timestamp if it's not a placeholder
  if (!dateObj && timestamp && !isVaguePlaceholder(timestamp)) {
    dateObj = parseDateSafe(timestamp);
  }

  // 3. Fallback: if both are missing or were placeholders, use current date
  if (!dateObj) {
    dateObj = new Date();
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = MONTHS[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, '0');

  const dateStr = `${day} ${month} ${year}`;
  const timeStr = `${formattedHours}:${minutes} ${ampm}`;
  const fullStr = `${dateStr}, ${timeStr}`;
  const relativeStr = getRelativeTimeText(dateObj);

  return {
    dateStr,
    timeStr,
    fullStr,
    relativeStr,
    iso: dateObj.toISOString(),
  };
}
