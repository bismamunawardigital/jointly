"use client";

import { Check } from "lucide-react";
import { business } from "@/data/seed";
import { duration, lastTime, statusOf, stepStates } from "@/lib/derive";
import { Tab, hasEvent, useStore } from "@/lib/store";
import { Pill, cn } from "@/components/ui";
import { NeedsYou } from "./NeedsYou";
import { RunView } from "./RunView";
import { EvidenceView } from "./EvidenceView";
import { PlanView } from "./PlanView";
import { SimulatorView } from "./SimulatorView";
import { ReviewView } from "./ReviewView";
import { ReleaseView } from "./ReleaseView";
import { AuditView } from "./AuditView";

const tabs: { id: Tab; label: string }[] = [
  { id: "run", label: "Agent run" },
  { id: "evidence", label: "Evidence & identity" },
  { id: "plan", label: "Access plan" },
  { id: "simulator", label: "Simulator" },
  { id: "review", label: "Checker review" },
  { id: "release", label: "Release" },
  { id: "audit", label: "Audit log" },
];

export function CaseWorkspace() {
  const { state, tab, setTab, hydrated } = useStore();
  const st = statusOf[state.phase];
  const now = lastTime(state);
  const firstLive = hasEvent(state, "rel-bilal-login");
  const rail = stepStates(state);
  const reviewDot = state.phase === "in_review" || state.phase === "re_review";
  const releaseDot = state.phase === "executed" || state.phase === "partially_live";
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
            </div>
            <div className="text-right text-xs text-muted">
              <p>
                Form received <span className="tnum text-sub">{business.submittedAt}</span>
              </p>
              {now && (
                <p className="mt-0.5">
                  {firstLive ? "Form to first login " : "Elapsed "}
                  <span className="tnum font-medium text-ink">{duration(business.submittedAt, firstLive ? "Mon 13:22" : now)}</span>
                </p>
              )}
            </div>
          </div>
          <ol className="mt-5 flex items-center gap-1" aria-label="Case steps">
            {rail.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-center gap-1">
                <div className={cn("flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-xs", s.state === "active" ? "bg-accent-soft text-accent-ink" : s.state === "done" ? "text-sub" : "text-muted")}>
                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px]", s.state === "done" ? "border-ok bg-ok text-white" : s.state === "active" ? "border-accent text-accent" : "border-line")}>
                    {s.state === "done" ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="truncate">{s.label}</span>
                  {s.flag && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" title="Has an exception" />}
                </div>
                {i < rail.length - 1 && <span className={cn("h-px w-3 shrink-0", s.state === "done" ? "bg-ok/40" : "bg-line")} />}
              </li>
            ))}
          </ol>
          <nav className="-mb-px mt-4 flex gap-5" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn("relative flex items-center gap-1.5 border-b-2 pb-2.5 text-sm transition-colors duration-150", tab === t.id ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink")}
              >
                {t.label}
                {((t.id === "review" && reviewDot) || (t.id === "release" && releaseDot)) && <span className="h-1.5 w-1.5 rounded-full bg-warn" />}
              </button>
            ))}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6 pb-40">
          <div key={tab} className="animate-enter">
            {tab === "run" && <RunView />}
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
