"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { EvidenceKey, PersonId, checker } from "@/data/seed";
import { Group, groupEvents } from "./script";
import { Approval, Version, approvalValid, buildRules, buildStages, heldIds, stageHash } from "./rules";

export type Phase =
  | "new"
  | "running"
  | "in_review"
  | "revising"
  | "re_review"
  | "executing"
  | "executed"
  | "releasing"
  | "partially_live"
  | "renewing"
  | "live";

export interface HumanEntry {
  id: string;
  kind: "human";
  time: string;
  by: string;
  text: string;
}
export interface AgentEntry {
  id: string;
  kind: "agent";
}
export type LogEntry = HumanEntry | AgentEntry;

export interface State {
  phase: Phase;
  log: LogEntry[];
  queue: string[];
  queueGroup?: Group;
  approvals: Partial<Record<1 | 2 | 3 | 4, Approval>>;
  returned?: { stageId: 3; note: string };
  cleanupTicket: "draft" | "sent";
  tourOn: boolean;
  tourStep: number;
}

export const initialState: State = {
  phase: "new",
  log: [],
  queue: [],
  approvals: {},
  cleanupTicket: "draft",
  tourOn: true,
  tourStep: 0,
};

type Action =
  | { type: "start"; group: Group }
  | { type: "reveal" }
  | { type: "approve"; stageId: 1 | 2 | 3 | 4 }
  | { type: "return"; note: string }
  | { type: "sendCleanup" }
  | { type: "release" }
  | { type: "renew" }
  | { type: "tour"; on?: boolean; step?: number }
  | { type: "reset" }
  | { type: "hydrate"; state: State };

const groupPhase: Record<Group, { running: Phase; done: Phase }> = {
  run: { running: "running", done: "in_review" },
  revise: { running: "revising", done: "re_review" },
  execute: { running: "executing", done: "executed" },
  release: { running: "releasing", done: "partially_live" },
  renew: { running: "renewing", done: "live" },
};

const tourStepFor: Partial<Record<Phase, number>> = { re_review: 1, executed: 2, partially_live: 3 };

const approvalTimes: Record<number, string> = { 1: "Mon 10:04", 2: "Mon 10:05", 3: "Mon 10:38", 4: "Mon 10:40" };

export const versionOf = (s: State): Version => (hasEvent(s, "rev-plan") ? 2 : 1);
export const hasEvent = (s: State, id: string) => s.log.some((e) => e.kind === "agent" && e.id === id);
export const rashidRenewed = (s: State) => hasEvent(s, "ren-kyc");

function human(id: string, time: string, text: string, by = checker.name): HumanEntry {
  return { id, kind: "human", time, by, text };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "hydrate":
      return a.state;
    case "reset":
      return { ...initialState, tourOn: s.tourOn };
    case "start": {
      if (s.queue.length) return s;
      return { ...s, phase: groupPhase[a.group].running, queue: groupEvents(a.group), queueGroup: a.group };
    }
    case "reveal": {
      if (!s.queue.length) return s;
      const [next, ...rest] = s.queue;
      const log = [...s.log, { id: next, kind: "agent" as const }];
      if (rest.length) return { ...s, log, queue: rest };
      const done = groupPhase[s.queueGroup!].done;
      const tourStep = Math.max(s.tourStep, tourStepFor[done] ?? 0);
      return { ...s, log, queue: [], queueGroup: undefined, phase: done, tourStep };
    }
    case "approve": {
      if (s.phase !== "in_review" && s.phase !== "re_review") return s;
      const stage = buildStages(versionOf(s)).find((x) => x.id === a.stageId)!;
      const approvals = {
        ...s.approvals,
        [a.stageId]: { stageId: a.stageId, by: checker.name, at: approvalTimes[a.stageId], hash: stageHash(stage) },
      };
      const log = [...s.log, human(`approve-${a.stageId}`, approvalTimes[a.stageId], `Approved stage ${a.stageId}: ${stage.title}`)];
      const next = { ...s, approvals, log };
      const stages = buildStages(versionOf(s));
      if (stages.every((st) => approvalValid(approvals[st.id], st))) {
        return { ...next, phase: "executing", queue: groupEvents("execute"), queueGroup: "execute" };
      }
      return next;
    }
    case "return": {
      const log = [...s.log, human("return-3", "Mon 10:07", `Returned stage 3: ${a.note}`)];
      return { ...s, log, returned: { stageId: 3, note: a.note }, phase: "revising", queue: groupEvents("revise"), queueGroup: "revise" };
    }
    case "sendCleanup":
      return { ...s, cleanupTicket: "sent", log: [...s.log, human("cleanup", "Mon 09:40", "Sent Finacle Mode of Operation cleanup ticket to Data Quality")] };
    case "release": {
      const log = [...s.log, human("release", "Mon 10:51", "Released Mohammed and Khalifa. Rashid stays held.")];
      return { ...s, log, phase: "releasing", queue: groupEvents("release"), queueGroup: "release" };
    }
    case "renew": {
      const log = [...s.log, human("renew", "Wed 09:39", "Demo control: Rashid renewed his EID", "Demo")];
      return { ...s, log, phase: "renewing", queue: groupEvents("renew"), queueGroup: "renew" };
    }
    case "tour":
      return { ...s, tourOn: a.on ?? s.tourOn, tourStep: a.step ?? s.tourStep };
  }
}

const KEY = "jointly-demo-v2";

interface Ctx {
  state: State;
  dispatch: (a: Action) => void;
  version: Version;
  held: PersonId[];
  evidenceOpen: EvidenceKey | null;
  openEvidence: (k: EvidenceKey | null) => void;
  hydrated: boolean;
  tab: Tab;
  setTab: (t: Tab) => void;
}

export type Tab = "run" | "autonomy" | "evidence" | "plan" | "simulator" | "review" | "release" | "audit";

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState<EvidenceKey | null>(null);
  const [tab, setTab] = useState<Tab>("run");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "hydrate", state: { ...initialState, ...JSON.parse(raw) } });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated || !state.queue.length) return;
    const t = setTimeout(() => dispatch({ type: "reveal" }), 650);
    return () => clearTimeout(t);
  }, [state.queue, hydrated]);

  const openEvidence = useCallback((k: EvidenceKey | null) => setEvidenceOpen(k), []);
  const version = versionOf(state);
  const renewed = rashidRenewed(state);
  const held = useMemo(() => heldIds(renewed), [renewed]);

  const value = useMemo(
    () => ({ state, dispatch, version, held, evidenceOpen, openEvidence, hydrated, tab, setTab }),
    [state, version, held, evidenceOpen, openEvidence, hydrated, tab],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}

export const rulesFor = (v: Version) => buildRules(v);
