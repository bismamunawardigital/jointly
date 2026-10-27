import { PersonId } from "@/data/seed";
import { Tone } from "@/components/ui";
import { StepId, eventById, steps } from "./script";
import { Phase, State, hasEvent } from "./store";

export const statusOf: Record<Phase, { label: string; tone: Tone }> = {
  new: { label: "New", tone: "neutral" },
  running: { label: "Agent working", tone: "accent" },
  in_review: { label: "Needs you", tone: "warn" },
  revising: { label: "Agent revising", tone: "accent" },
  re_review: { label: "Needs you", tone: "warn" },
  executing: { label: "Agent executing", tone: "accent" },
  executed: { label: "Needs you", tone: "warn" },
  releasing: { label: "Releasing", tone: "accent" },
  partially_live: { label: "Partially live", tone: "ok" },
  renewing: { label: "Agent working", tone: "accent" },
  rashid_ready: { label: "Needs you", tone: "warn" },
  releasing_rashid: { label: "Releasing", tone: "accent" },
  live: { label: "Live", tone: "ok" },
};

const phaseStep: Partial<Record<Phase, StepId>> = {
  in_review: "review",
  re_review: "review",
  executing: "execute",
  executed: "release",
  releasing: "release",
  partially_live: "release",
  renewing: "release",
  rashid_ready: "release",
  releasing_rashid: "release",
};

export type StepState = "todo" | "active" | "done";

export function stepStates(s: State): { id: StepId; label: string; state: StepState; flag: boolean }[] {
  let current: StepId | undefined = phaseStep[s.phase];
  if (s.queue.length && (s.phase === "running" || s.phase === "revising")) current = eventById(s.queue[0]).step;
  const idx = s.phase === "live" ? steps.length : s.phase === "new" ? -1 : steps.findIndex((x) => x.id === current);
  return steps.map((st, i) => {
    const flag = s.log.some((e) => e.kind === "agent" && eventById(e.id).step === st.id && ["warn", "block"].includes(eventById(e.id).status));
    return { ...st, flag, state: i < idx ? "done" : i === idx ? "active" : "todo" };
  });
}

const dayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2 };
export function toMinutes(t: string) {
  const [d, hm] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return dayIndex[d] * 1440 + h * 60 + m;
}
export function duration(from: string, to: string) {
  const mins = toMinutes(to) - toMinutes(from);
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return [d && `${d}d`, (h || d) && `${h}h`, `${m}m`].filter(Boolean).join(" ");
}

export function lastTime(s: State) {
  const times = s.log.map((e) => (e.kind === "agent" ? eventById(e.id).time : e.time));
  return times.sort((a, b) => toMinutes(a) - toMinutes(b)).at(-1);
}

export interface Track {
  label: string;
  done: boolean;
  time?: string;
  note?: string;
}

export function progressFor(s: State, id: PersonId): Track[] {
  const t = (e: string) => (hasEvent(s, e) ? eventById(e).time : undefined);
  if (id === "mohammed")
    return [
      { label: "Configured", done: hasEvent(s, "ex-link"), time: t("ex-link"), note: "Existing login linked" },
      { label: "Access", done: hasEvent(s, "rel-mohammed"), time: t("rel-mohammed"), note: "Reused, no new credentials" },
      { label: "First login", done: hasEvent(s, "rel-mohammed-login"), time: t("rel-mohammed-login") },
    ];
  if (id === "khalifa")
    return [
      { label: "Configured", done: hasEvent(s, "ex-users"), time: t("ex-users") },
      { label: "Credentials claimed", done: hasEvent(s, "rel-khalifa-verified"), time: t("rel-khalifa-verified"), note: hasEvent(s, "rel-khalifa-link") ? "Link sent " + eventById("rel-khalifa-link").time : undefined },
      { label: "First login", done: hasEvent(s, "rel-khalifa-login"), time: t("rel-khalifa-login") },
    ];
  return [
    hasEvent(s, "ren-enable")
      ? { label: "Switched on", done: true, time: t("ren-enable") }
      : { label: "Created (switched off)", done: hasEvent(s, "ex-users"), time: t("ex-users") },
    { label: "Credentials claimed", done: hasEvent(s, "ren-login"), time: t("ren-login"), note: hasEvent(s, "ren-link") ? "Link sent " + eventById("ren-link").time : undefined },
    { label: "First login", done: hasEvent(s, "ren-login"), time: t("ren-login") },
  ];
}
