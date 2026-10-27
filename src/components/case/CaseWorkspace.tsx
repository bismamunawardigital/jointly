"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";
import { business } from "@/data/seed";
import { duration, lastTime, statusOf } from "@/lib/derive";
import { Tab, hasEvent, useStore } from "@/lib/store";
import { Pill, cn } from "@/components/ui";
import { eventById } from "@/lib/script";
import { NeedsYou } from "./NeedsYou";
import { RunView } from "./RunView";
import { EvidenceView } from "./EvidenceView";
import { PlanView } from "./PlanView";
import { SimulatorView } from "./SimulatorView";
import { ReviewView } from "./ReviewView";
import { ReleaseView } from "./ReleaseView";
import { AuditView } from "./AuditView";
import { AutonomyView } from "./AutonomyView";

const tabs: { id: Tab; label: string }[] = [
  { id: "run", label: "Agent run" },
  { id: "evidence", label: "Evidence & identity" },
  { id: "plan", label: "Access plan" },
  { id: "simulator", label: "Simulator" },
  { id: "review", label: "Checker review" },
  { id: "release", label: "Release" },
  { id: "audit", label: "Audit log" },
  { id: "autonomy", label: "Autonomy map" },
];

export function CaseWorkspace() {
  const { state, dispatch, tab, setTab, hydrated } = useStore();
  const readyAt: Partial<Record<Tab, string>> = { evidence: "id-digital", plan: "plan-build", simulator: "plan-build", review: "submit", release: "ex-readback" };
  const notStarted = !!readyAt[tab] && !hasEvent(state, readyAt[tab]!);
  const st = state.paused && state.queue.length ? { label: state.handedOver ? "With a maker" : "Paused", tone: "warn" as const } : statusOf[state.phase];
  const now = lastTime(state);
  const firstLogin = hasEvent(state, "rel-mohammed-login");
  const bankDone = hasEvent(state, "ex-readback");
  const doneAt: Partial<Record<Tab, boolean>> = {
    run: hasEvent(state, "submit"),
    evidence: hasEvent(state, "mandate-conflict"),
    plan: hasEvent(state, "plan-build"),
    simulator: hasEvent(state, "policy-check"),
    review: hasEvent(state, "ex-link"),
    release: state.phase === "live",
  };
  const reviewDot = state.phase === "in_review" || state.phase === "re_review";
  const releaseDot = state.phase === "executed" || state.phase === "partially_live";
  useEffect(() => {
    if (!hydrated) return;
    const want = new URLSearchParams(window.location.search).get("tab");
    if (want && tabs.some((t) => t.id === want)) setTab(want as Tab);
  }, [hydrated, setTab]);
  useEffect(() => {
    if (hydrated && state.phase === "new" && !state.queue.length) dispatch({ type: "start", group: "run" });
  }, [hydrated, state.phase, state.queue.length, dispatch]);
  if (!hydrated) return null;
  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line px-8 pb-0 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">{business.name}</h1>
                <Pill tone={st.tone}>{st.label}</Pill>
              </div>
              <p className="mt-1 text-sm text-sub">
                Joint signatories (3) · <span className="font-mono text-xs">{business.iban}</span> · {business.accountType}
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
          <nav aria-label="Case steps" className="-mb-px mt-5 flex gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn("relative flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-sm transition-colors duration-150", tab === t.id ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink")}
              >
                {doneAt[t.id] ? (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ok text-onaccent" aria-label="done">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                ) : null}
                {t.label}
                {((t.id === "review" && reviewDot) || (t.id === "release" && releaseDot)) && <span className="h-1.5 w-1.5 rounded-full bg-warn" />}
              </button>
            ))}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6 pb-40">
          <div key={tab} className="animate-enter">
            {notStarted && (
              <div className="mb-6 rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3">
                <p className="text-sm text-sub">
                  <span className="font-medium text-ink">This part of the case hasn&apos;t happened yet.</span> It fills in as the case moves, and the guided tour tells you when to come back.
                </p>
              </div>
            )}
            {tab === "run" && <RunView />}
            {tab === "autonomy" && <AutonomyView />}
            {tab === "evidence" && <EvidenceView />}
            {tab === "plan" && <PlanView />}
            {tab === "simulator" && <SimulatorView />}
            {tab === "review" && <ReviewView />}
            {tab === "release" && <ReleaseView />}
            {tab === "audit" && <AuditView />}
          </div>
        </div>
      </div>
      <NeedsYou />
    </div>
  );
}
