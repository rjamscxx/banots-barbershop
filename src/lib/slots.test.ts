import { describe, expect, it } from "vitest";
import { generateSlots, slotToMinutes, type DayHours } from "./slots";

const HOURS: DayHours[] = [
  { day: "Mon", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Sun", open: "9:00 AM", close: "7:00 PM", closed: true },
];

describe("slotToMinutes", () => {
  it("parses AM/PM times", () => {
    expect(slotToMinutes("9:00 AM")).toBe(540);
    expect(slotToMinutes("12:00 PM")).toBe(720);
    expect(slotToMinutes("12:30 AM")).toBe(30);
    expect(slotToMinutes("6:30 PM")).toBe(1110);
  });
  it("returns null for garbage", () => {
    expect(slotToMinutes("Closed")).toBe(null);
    expect(slotToMinutes("")).toBe(null);
  });
});

describe("generateSlots", () => {
  it("makes 30-min slots from open to 30 min before close", () => {
    const slots = generateSlots(HOURS, "Mon");
    expect(slots[0]).toBe("9:00 AM");
    expect(slots[slots.length - 1]).toBe("6:30 PM");
    expect(slots).toHaveLength(20); // 9:00..18:30 inclusive
    expect(slots).toContain("12:00 PM");
  });
  it("returns [] for closed days", () => {
    expect(generateSlots(HOURS, "Sun")).toEqual([]);
  });
  it("returns [] for unknown days", () => {
    expect(generateSlots(HOURS, "Fri")).toEqual([]);
  });
});
