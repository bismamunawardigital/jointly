"use client";

import { useState } from "react";

import { AlertTriangle, Ban, Check, Inbox, Info, Loader2, UserRound } from "lucide-react";
import { Group, eventById, steps } from "@/lib/script";
import { stepStates } from "@/lib/derive";
import { buildRules, policyChecks } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { AssumptionChip, Empty, Sources, cn } from "@/components/ui";

const groupTitle: Record<Group, string> = {
  run: "First run",
  revise: "Revision after Sara's return",
  execute: "Execution",
  release: "Release",
  renew: "Rashid added later",
};

const icon = {
  ok: <Check className="h-3 w-3 text-ok" strokeWidth={3} />,
  warn: <AlertTriangle className="h-3 w-3 text-warn" />,
  block: <Ban className="h-3 w-3 text-bad" />,
  info: <Info className="h-3 w-3 text-muted" />,
};

export function RunView() {
  const { state, held, version } = useStore();
  const [all, setAll] = useState(false);
  if (!state.log.length && !state.queue.length)
    return <Empty icon={Inbox} title="Request received" body="The agent is starting. Each step shows what it called, what it found and where it found it." />;

  const plan = stepStates(state);
  const planList = (
    <ol key="plan" className="mb-5 ml-[96px] flex max-w-3xl flex-wrap gap-x-4 gap-y-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-xs" aria-label="Agent plan">
      {plan.map((p) => (
        <li key={p.id} className={cn("flex items-center gap-1.5", p.state === "done" ? "text-sub" : p.state === "active" ? "font-medium text-accent-ink" : "text-muted")}>
          <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded-full border", p.state === "done" ? "border-ok bg-ok text-onaccent" : p.state === "active" ? "border-accent" : "border-line")}>
            {p.state === "done" && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
          </span>
          {steps.find((x) => x.id === p.id)?.label}
        </li>
      ))}
    </ol>
  );
  let lastGroup: Group | null = null;
  const rows: React.ReactNode[] = [planList];
  if (hasEvent(state, "submit"))
    rows.push(
      <li key="summary" className="relative z-10 mb-6 ml-[96px] rounded-lg border border-line bg-surface px-3 py-2.5">
        <p className="text-xs text-muted">3 things worth knowing</p>
        <ul className="mt-1.5 flex flex-wrap gap-2 text-xs">
          <li className="rounded-md bg-bad-soft px-2 py-1 text-bad-ink">Rashid held: EID expired</li>
          <li className="rounded-md bg-warn-soft px-2 py-1 text-warn-ink">Finacle and SVS disagree: SVS used</li>
          <li className="rounded-md bg-ok-soft px-2 py-1 text-ok-ink">Mohammed&apos;s login reused</li>
        </ul>
        <p className="mt-3 text-xs text-muted">What I didn&apos;t do</p>
        <ul className="mt-1.5 flex flex-wrap gap-2 text-xs text-sub">
          {!hasEvent(state, "rev-amendment") && <li className="rounded-md border border-warn/40 px-2 py-1">Read SVS letters (searched Mandates only)</li>}
          <li className="rounded-md border border-line px-2 py-1">Set up USD (mandate is AED only)</li>
          <li className="rounded-md border border-line px-2 py-1">Give Rashid a login (EFR first)</li>
          <li className="rounded-md border border-line px-2 py-1">Approve anything myself</li>
        </ul>
      </li>,
    );
  for (const entry of state.log) {
    if (entry.kind === "human") {
      rows.push(
        <li key={entry.id} className="relative flex gap-4 pb-5 animate-enter">
          <span className="tnum w-[72px] shrink-0 pt-0.5 text-xs text-muted">{entry.time}</span>
          <span className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink bg-surface">
            <UserRound className="h-3 w-3" />
          </span>
          <div className="min-w-0 flex-1 rounded-lg border border-line bg-panel/60 px-3 py-2">
            <p className="text-xs text-muted">{entry.by}</p>
            <p className="text-sm font-medium">{entry.text}</p>
          </div>
        </li>,
      );
      continue;
    }
    const e = eventById(entry.id);
    if (e.group !== lastGroup) {
      lastGroup = e.group;
      rows.push(
        <li key={`g-${e.group}`} className="relative flex gap-4 pb-4 pt-2">
          <span className="w-[72px] shrink-0" />
          <span className="relative z-10 w-5 shrink-0" />
          <p className="text-xs font-medium text-muted">{groupTitle[e.group]}</p>
        </li>,
      );
    }
    let title = e.title;
    let detail = e.detail?.replace("{plan}", `plan v${version}`);
    if (e.dynamic) {
      const checks = policyChecks(e.dynamic === "policy-v1" ? 1 : 2, held);
      const passed = checks.filter((c) => c.pass).length;
      title = `${e.title}: ${passed} of ${checks.length} checks`;
      const limit = buildRules(e.dynamic === "policy-v1" ? 1 : 2)[1].maxAmount!.toLocaleString("en-US");
      detail = `Boundary tests at AED ${limit} and one dirham above, EFR hold on Rashid, USD not covered, every signatory has a user and role.`;
    }
    rows.push(
      <li key={e.id} className="relative flex gap-4 pb-5 animate-enter">
        <span className="tnum w-[72px] shrink-0 pt-0.5 text-xs text-muted">{e.time}</span>
        <span className={cn("relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-surface", e.status === "block" ? "border-bad/40" : e.status === "warn" ? "border-warn/40" : "border-line")}>
          {icon[e.status]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className={cn("font-medium", e.actor === "Rules engine" ? "text-ok-ink" : "text-accent-ink")}>{e.actor}</span>
            <span className="font-mono text-[11px] text-muted">
              {e.call} → {e.system}
            </span>
          </div>
          <p className={cn("mt-0.5 text-sm font-medium", e.status === "block" && "text-bad-ink")}>{title}</p>
          {detail && (all || e.status === "warn" || e.status === "block") && <p className="mt-0.5 max-w-2xl text-sm text-sub">{detail}</p>}
          {(e.evidence || e.assumption) && (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <Sources keys={e.evidence} />
              {e.assumption && <AssumptionChip>{e.assumption}</AssumptionChip>}
            </div>
          )}
        </div>
      </li>,
    );
  }
  if (state.queue.length) {
    const n = eventById(state.queue[0]);
    rows.push(
      <li key="working" className="relative flex gap-4 pb-5">
        <span className="w-[72px] shrink-0" />
        <span className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface">
          <Loader2 className="h-3 w-3 animate-spin text-accent" />
        </span>
        <p className="text-sm text-muted">
          {n.actor} calling <span className="font-mono text-xs">{n.call}</span>
        </p>
      </li>,
    );
  }
  return (
    <>
    <div className="mb-3 flex max-w-3xl justify-end">
      <button onClick={() => setAll((a) => !a)} className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
        {all ? "Show exceptions only" : "Show every detail"}
      </button>
    </div>
    <ol className="relative max-w-3xl before:absolute before:bottom-6 before:left-[97.5px] before:top-2 before:w-px before:bg-line" aria-live="polite">
      {rows}
    </ol>
    </>
  );
}
