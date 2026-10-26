"use client";

import { Bot, Loader2, Play, ShieldCheck, UserRound } from "lucide-react";
import { checker } from "@/data/seed";
import { releaseEligibility } from "@/lib/rules";
import { eventById } from "@/lib/script";
import { rulesFor, useStore } from "@/lib/store";
import { Button, Pill } from "@/components/ui";

export function NeedsYou() {
  const { state, dispatch, setTab, version, held } = useStore();
  const working = state.queue.length > 0;
  const next = working ? eventById(state.queue[0]) : null;
  const elig = releaseEligibility(rulesFor(version), held);

  let body: React.ReactNode;
  if (working && next) {
    body = (
      <div className="flex items-start gap-2.5">
        <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-accent" />
        <div>
          <p className="text-sm font-medium">{next.actor} is working</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{next.call}</p>
          <p className="mt-2 text-sm text-sub">Nothing needed from you right now.</p>
        </div>
      </div>
    );
  } else if (state.phase === "new") {
    body = (
      <>
        <p className="text-sm text-sub">3 signed forms arrived for Creekside General Trading. The agent will gather evidence from Finacle, SVS and KYC, then draft an access plan for you to check.</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => dispatch({ type: "start", group: "run" })}>
          <Play className="h-3.5 w-3.5" /> Start agent run
        </Button>
      </>
    );
  } else if (state.phase === "in_review") {
    body = (
      <>
        <p className="text-sm font-medium">Review plan v1</p>
        <p className="mt-1 text-sm text-sub">4 stages, all with sources. Approve each one, or return a stage with a note.</p>
        <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-xs text-warn-ink">Tip for the demo: you remember Khalifa&apos;s limit changed in 2023. Return stage 3.</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => setTab("review")}>
          Open checker review
        </Button>
      </>
    );
  } else if (state.phase === "re_review") {
    body = (
      <>
        <p className="text-sm font-medium">Review the changes in plan v2</p>
        <p className="mt-1 text-sm text-sub">Only stages 3 and 4 changed. Your approvals on stages 1 and 2 still stand.</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => setTab("review")}>
          Review 2 changed stages
        </Button>
      </>
    );
  } else if (state.phase === "executed") {
    body = (
      <>
        <p className="text-sm font-medium">Release decision</p>
        <p className="mt-1 text-sm text-sub">{elig.summary}</p>
        <Button variant="primary" className="mt-4 w-full" disabled={!elig.eligible} onClick={() => dispatch({ type: "release" })}>
          Release Mohammed and Khalifa
        </Button>
        <Button variant="ghost" className="mt-1 w-full" onClick={() => setTab("release")}>
          See why it&apos;s safe
        </Button>
      </>
    );
  } else if (state.phase === "partially_live") {
    body = (
      <>
        <p className="text-sm font-medium">Live, 2 of 3</p>
        <p className="mt-1 text-sm text-sub">Rashid is waiting on his EID renewal. The agent rechecks KYC and adds him when it clears.</p>
        <div className="mt-4 rounded-lg border border-dashed border-line p-3">
          <p className="text-xs text-muted">Demo control</p>
          <Button className="mt-2 w-full" onClick={() => dispatch({ type: "renew" })}>
            Skip ahead: Rashid renews his EID
          </Button>
        </div>
      </>
    );
  } else if (state.phase === "live") {
    body = (
      <>
        <p className="text-sm font-medium">All 3 signatories are live</p>
        <p className="mt-1 text-sm text-sub">Nothing left to do. Every step is in the audit log.</p>
        <Button className="mt-4 w-full" onClick={() => setTab("audit")}>
          Open audit log
        </Button>
      </>
    );
  }

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-line bg-panel/40">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Needs you</h2>
          {!working && !["new", "live", "partially_live"].includes(state.phase) && <Pill tone="warn">Action</Pill>}
        </div>
        <div className="mt-3">{body}</div>
      </div>
      <div className="min-h-0 overflow-y-auto px-5 py-4 pb-64">
        <h3 className="text-xs font-medium text-muted">Who does what</h3>
        <ul className="mt-3 space-y-3 text-sm">
          <li className="flex gap-2.5">
            <Bot className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Maker: Access Agent</p>
              <p className="text-xs text-muted">System user. Gathers, drafts, executes. Can&apos;t approve.</p>
            </div>
          </li>
          <li className="flex gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
            <div>
              <p className="font-medium">Rules engine</p>
              <p className="text-xs text-muted">Deterministic checks. No AI.</p>
            </div>
          </li>
          <li className="flex gap-2.5">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
            <div>
              <p className="font-medium">
                Checker: {checker.name}
              </p>
              <p className="text-xs text-muted">{checker.role}. Approves every stage and the release.</p>
            </div>
          </li>
        </ul>
        <div className="mt-5 rounded-lg border border-line bg-white p-3">
          <p className="text-xs font-medium text-ink">The agent never</p>
          <ul className="mt-1.5 space-y-1 text-xs text-sub">
            <li>Waives KYC</li>
            <li>Matches people by name</li>
            <li>Approves its own work</li>
            <li>Sees or sends a password</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
