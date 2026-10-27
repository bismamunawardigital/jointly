"use client";

import { Ban, Bot, Scale, UserCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { business } from "@/data/seed";
import { duration, headlineOf, lastTime, statusOf } from "@/lib/derive";
import { Tab, hasEvent, useStore } from "@/lib/store";
import { Pill, cn } from "@/components/ui";
import { eventById } from "@/lib/script";
import { NeedsYou } from "./NeedsYou";
import { ProgressView } from "./ProgressView";
import { SigningMap } from "./SigningMap";
import { EvidenceView } from "./EvidenceView";
import { PlanView } from "./PlanView";
import { SimulatorView } from "./SimulatorView";
import { ReviewView } from "./ReviewView";
import { ReleaseView } from "./ReleaseView";
import { AuditView } from "./AuditView";
import { DecisionView } from "./DecisionView";
import { CommandPalette } from "@/components/CommandPalette";

type Group = { id: "review" | "setup" | "history"; label: string; sections: { id: Tab; label: string }[] };
const groups: Group[] = [
  { id: "review", label: "Review", sections: [{ id: "review", label: "Checker review" }, { id: "release", label: "Release" }] },
  { id: "setup", label: "Setup", sections: [{ id: "map", label: "Signing map" }, { id: "evidence", label: "Identity" }, { id: "plan", label: "Users and roles" }, { id: "simulator", label: "Simulator" }] },
  { id: "history", label: "History", sections: [{ id: "run", label: "Progress" }, { id: "audit", label: "Timeline" }, { id: "decisions", label: "Decision record" }] },
];
const groupOf = (t: Tab) => groups.find((g) => g.sections.some((x) => x.id === t)) ?? groups[2];
const how = [
  { icon: Bot, title: "The agent does it alone", line: "Reads, matches and drafts. Every step is logged with its source." },
  { icon: Scale, title: "Rules decide", line: "Who can sign and up to what amount. Code, not a model." },
  { icon: UserCheck, title: "Sara approves", line: "Anything that changes who can move money." },
  { icon: Ban, title: "Never allowed", line: "Waiving EFR, approving its own work, seeing a password." },
];
const paletteTabs = groups.map((g) => ({ id: g.sections[0].id, label: g.label }));

export function CaseWorkspace() {
  const { state, dispatch, tab, setTab, hydrated } = useStore();
  const readyAt: Partial<Record<Tab, string>> = { map: "plan-build", evidence: "id-digital", plan: "plan-build", simulator: "plan-build", review: "submit", release: "ex-readback" };
  const notStarted = !!readyAt[tab] && !hasEvent(state, readyAt[tab]!);
  const st = state.paused && state.queue.length ? { label: state.handedOver ? "With a maker" : "Paused", tone: "warn" as const } : statusOf[state.phase];
  const now = lastTime(state);
  const firstLogin = hasEvent(state, "rel-mohammed-login");
  const bankDone = hasEvent(state, "ex-readback");
  const reviewDot = state.phase === "in_review" || state.phase === "re_review";
  const releaseDot = state.phase === "executed" || state.phase === "partially_live" || state.phase === "rashid_ready";
  const [mac, setMac] = useState(false);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);
  useEffect(() => {
    if (!hydrated) return;
    const want = new URLSearchParams(window.location.search).get("tab");
    if (want && groups.some((g) => g.sections.some((x) => x.id === want))) setTab(want as Tab);
  }, [hydrated, setTab]);
  useEffect(() => {
    if (hydrated && state.phase === "new" && !state.queue.length) dispatch({ type: "start", group: "run" });
  }, [hydrated, state.phase, state.queue.length, dispatch]);
  const [howOpen, setHowOpen] = useState(false);
  const prevPhase = useRef(state.phase);
  useEffect(() => {
    const was = prevPhase.current;
    prevPhase.current = state.phase;
    if (!hydrated || was === state.phase) return;
    const go: Partial<Record<string, Tab>> = { in_review: "review", re_review: "review", executed: "release", rashid_ready: "release" };
    const t = go[state.phase];
    if (t) setTab(t);
  }, [state.phase, hydrated, setTab]);
  const group = groupOf(tab);
  if (!hydrated) return null;
  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line px-8 pb-0 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <p className="text-xs font-medium text-muted">{business.name}</p>
                <Pill tone={st.tone}>{st.label}</Pill>
              </div>
              <h1 className="mt-1 font-display text-[28px] leading-tight text-ink">{headlineOf[state.phase]}</h1>
              <p className="mt-1 text-sm text-sub">
                Joint signatories (3) · <bdi dir="ltr" className="font-mono text-xs">{business.iban}</bdi> · {business.accountType}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {business.address} · Trade licence {business.licence}
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              <p>
                Form received <span className="tnum text-sub">{business.submittedAt}</span>
              </p>
              {now && (
                <p className="mt-0.5">
                  {firstLogin ? "Form to first login " : "Elapsed "}
                  <span className="tnum font-medium text-ink">{duration(business.submittedAt, firstLogin ? eventById("rel-mohammed-login").time : now)}</span>
                </p>
              )}
              {bankDone && (
                <p className="mt-0.5">
                  Bank-side work <span className="tnum font-medium text-ink">{duration(business.submittedAt, eventById("ex-readback").time)}</span>
                </p>
              )}
            </div>
          </div>
          <button type="button" onClick={() => window.dispatchEvent(new Event("jointly:palette"))} className="mt-2 text-[11px] text-muted hover:text-ink">
            <kbd className="rounded border border-line px-1">{mac ? "⌘K" : "Ctrl K"}</kbd> to jump anywhere
          </button>
          <button type="button" onClick={() => setHowOpen(true)} className="ml-4 mt-2 text-[11px] text-muted underline-offset-2 hover:text-ink hover:underline">
            How this agent works
          </button>
          <nav aria-label="Case steps" className="-mb-px mt-5 flex gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
            {groups.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={group.id === g.id}
                onClick={() => setTab(g.sections[0].id)}
                className={cn("relative flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-sm transition-colors duration-150", group.id === g.id ? "border-brand font-medium text-ink" : "border-transparent text-muted hover:text-ink")}
              >
                {g.label}
                {g.id === "review" && (reviewDot || releaseDot) && <span className="h-1.5 w-1.5 rounded-full bg-warn" />}
              </button>
            ))}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6 pb-40">
          <div role="tablist" aria-label={`${group.label} sections`} className="mb-6 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
            {group.sections.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={tab === x.id}
                onClick={() => setTab(x.id)}
                className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150", tab === x.id ? "bg-ink text-canvas" : "text-sub hover:text-ink")}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div key={tab} className="animate-enter">
            {notStarted && (
              <div className="mb-6 rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3">
                <p className="text-sm text-sub">
                  <span className="font-medium text-ink">This part of the case hasn&apos;t happened yet.</span> It fills in as the case moves.
                </p>
              </div>
            )}
            {tab === "run" && <ProgressView />}
            {tab === "map" && <SigningMap />}
            {tab === "evidence" && <EvidenceView />}
            {tab === "plan" && <PlanView />}
            {tab === "simulator" && <SimulatorView />}
            {tab === "review" && (
              <>
                <div className="mb-6 max-w-4xl"><SigningMap compact /></div>
                <ReviewView />
              </>
            )}
            {tab === "release" && <ReleaseView />}
            {tab === "decisions" && <DecisionView />}
            {tab === "audit" && <AuditView />}
          </div>
        </div>
      </div>
      <NeedsYou />
      <CommandPalette tabs={paletteTabs} />
      {howOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="How this agent works">
          <button aria-label="Close" className="absolute inset-0 bg-ink/30" onClick={() => setHowOpen(false)} />
          <div className="relative h-full w-[440px] animate-enter overflow-y-auto border-l border-line bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">How this agent works</h2>
              <button aria-label="Close" onClick={() => setHowOpen(false)} className="rounded p-1 text-muted hover:bg-panel hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-5">
              {how.map(({ icon: I, title, line }) => (
                <li key={title} className="flex gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink">
                    <I className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-sub">{line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
