import type { Donation } from "~/stores/user";
import type { Achievement } from "~/stores/avatar";

export type TimelineItem =
  | { type: "donation"; date: Date; data: Donation }
  | { type: "achievement"; date: Date; data: Achievement };
