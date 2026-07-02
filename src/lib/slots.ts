export type DayHours = { day: string; open: string; close: string; closed: boolean };

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function slotToMinutes(slot: string): number | null {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

function minutesToSlot(total: number): string {
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** 30-minute slot grid for a weekday ("Mon".."Sun"); [] when closed/unknown. */
export function generateSlots(hours: DayHours[], day: string): string[] {
  const entry = hours.find((h) => h.day === day);
  if (!entry || entry.closed) return [];
  const open = slotToMinutes(entry.open);
  const close = slotToMinutes(entry.close);
  if (open === null || close === null || close <= open) return [];
  const slots: string[] = [];
  for (let t = open; t + 30 <= close; t += 30) slots.push(minutesToSlot(t));
  return slots;
}
