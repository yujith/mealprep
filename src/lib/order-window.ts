/**
 * Order window utility
 * Determines whether orders are currently being accepted based on:
 *  1. Manual override (is_accepting_orders — always wins)
 *  2. Auto weekly schedule: Mon reopen_time → Thu cutoff_time (Sri Lanka time UTC+5:30)
 *
 * Day convention: 0 = Sunday, 1 = Monday … 4 = Thursday, 6 = Saturday
 */

export interface OrderWindowSettings {
  is_accepting_orders: boolean;
  auto_cutoff_enabled: boolean;
  cutoff_day: number;
  cutoff_time: string; // "HH:MM:SS"
  reopen_day: number;
  reopen_time: string; // "HH:MM:SS"
}

export interface OrderWindowResult {
  open: boolean;
  reason: string;
  nextOpenLabel: string;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parse "HH:MM:SS" into { h, m, s } */
function parseTime(t: string): { h: number; m: number; s: number } {
  const [h, m, s] = t.split(":").map(Number);
  return { h: h ?? 0, m: m ?? 0, s: s ?? 0 };
}

/** Convert a Date to Sri Lanka time (UTC+5:30) expressed as { day, h, m } */
function toSriLankaTime(date: Date): { day: number; h: number; m: number } {
  const slOffset = 5.5 * 60 * 60 * 1000; // 5h 30m in ms
  const sl = new Date(date.getTime() + slOffset);
  return { day: sl.getUTCDay(), h: sl.getUTCHours(), m: sl.getUTCMinutes() };
}

/** Total minutes-of-week for a given day + time */
function minutesOfWeek(day: number, h: number, m: number): number {
  return day * 24 * 60 + h * 60 + m;
}

export function isOrderingOpen(settings: OrderWindowSettings): OrderWindowResult {
  // If auto-schedule is disabled, fall back entirely to the manual flag
  if (!settings.auto_cutoff_enabled) {
    return {
      open: settings.is_accepting_orders,
      reason: settings.is_accepting_orders
        ? "Orders are open (manual mode)"
        : "Orders are paused by admin",
      nextOpenLabel: settings.is_accepting_orders ? "" : "Check back soon",
    };
  }

  const now = new Date();
  const sl = toSriLankaTime(now);

  const cutoffT = parseTime(settings.cutoff_time);
  const reopenT = parseTime(settings.reopen_time);

  const nowMow = minutesOfWeek(sl.day, sl.h, sl.m);
  const reopenMow = minutesOfWeek(settings.reopen_day, reopenT.h, reopenT.m);
  const cutoffMow = minutesOfWeek(settings.cutoff_day, cutoffT.h, cutoffT.m);

  let autoOpen: boolean;

  if (reopenMow <= cutoffMow) {
    // Normal case: open window is within the same week (e.g. Mon 6am → Thu 11:59pm)
    autoOpen = nowMow >= reopenMow && nowMow <= cutoffMow;
  } else {
    // Wraps over the weekend (e.g. Thu 6pm → Mon 9am)
    autoOpen = nowMow >= reopenMow || nowMow <= cutoffMow;
  }

  // Admin manual flag can CLOSE orders even within the open window
  const open = autoOpen && settings.is_accepting_orders;

  const cutoffDayName = DAY_NAMES[settings.cutoff_day];
  const reopenDayName = DAY_NAMES[settings.reopen_day];

  let reason: string;
  let nextOpenLabel: string;

  if (!settings.is_accepting_orders) {
    reason = "Orders are paused by admin";
    nextOpenLabel = "Check back soon";
  } else if (!autoOpen) {
    reason = "Orders are closed for this week — we're prepping!";
    nextOpenLabel = `Next batch opens ${reopenDayName} at ${reopenT.h.toString().padStart(2, "0")}:${reopenT.m.toString().padStart(2, "0")}`;
  } else {
    reason = `Orders open until ${cutoffDayName} night`;
    nextOpenLabel = `Closing ${cutoffDayName} at ${cutoffT.h.toString().padStart(2, "0")}:${cutoffT.m.toString().padStart(2, "0")}`;
  }

  return { open, reason, nextOpenLabel };
}
