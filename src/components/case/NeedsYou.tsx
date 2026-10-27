"use client";

import { Hand, Pause, Play, Sparkles } from "lucide-react";
import { policyChecks, releaseEligibility } from "@/lib/rules";
import { eventById } from "@/lib/script";
import { headlineOf } from "@/lib/derive";
import { Tab, rulesFor, useStore } from "@/lib/store";
import { Button, cn } from "@/components/ui";

const doingMap: Record<string, string> = {
  intake: "reading the forms",
  identity: "confirming the people",
  mandate: "reading the mandate",
  plan: "building the plan",
  policy: "testing the plan",
  review: "sending the plan to you",
  execute: "setting it up in Digital Banking Admin",
  release: "switching people on",
};
const doing = (step: string) => doingMap[step] ?? "working";

export const maker = "Omar K., CF Maker";

function Key({ k }: { k: string }) {
  return <kbd className="ml-1 rounded border border-current/30 px-1 text-[11px] opacity-70">{k}</kbd>;
}

export function NeedsYou() {
  const { state, dispatch, setTab, version, held } = useStore();
  const working = state.queue.length > 0;
  const next = working ? eventById(state.queue[0]) : null;
  const elig = releaseEligibility(rulesFor(version), held);
  const failing = policyChecks(version, held).filter((c) => !c.pass).length;
  const done = state.log.filter((e) => e.kind === "agent").length;
  const go = (t: Tab, anchor?: string) => {
    setTab(t);
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const handBtn = (
    <Button variant="ghost" onClick={() => dispatch({ type: "handover" })}>
      <Hand className="h-3.5 w-3.5" /> Hand to a maker <Key k="H" />
    </Button>
  );

  let title = headlineOf[state.phase];
  let sub: React.ReactNode = null;
  let actions: React.ReactNode = null;
  let needs = !working && !["new", "live", "partially_live"].includes(state.phase);

  if (state.handedOver) {
    needs = false;
    title = `With ${maker}`;
    sub = working && next ? `${done} agent steps saved, ${state.queue.length} left. Nothing half-done.` : "Stages 1 and 2 verified by rule. The letter value is with him.";
    actions = (
      <>
        <Button variant="ghost" onClick={() => dispatch({ type: "sendBack" })}>Demo: Omar sends it back</Button>
        <Button onClick={() => dispatch({ type: "resume" })}>
          <Play className="h-3.5 w-3.5" /> Take it back <Key k="P" />
        </Button>
      </>
    );
  } else if (working && next && state.paused) {
    title = "Agent paused between steps";
    sub = `${done} done, ${state.queue.length} left. Next: ${doing(next.step)}. Nothing half-written.`;
    actions = (
      <>
        {handBtn}
        <Button variant="primary" onClick={() => dispatch({ type: "resume" })}>
          <Play className="h-3.5 w-3.5" /> Resume <Key k="P" />
        </Button>
      </>
    );
  } else if (working && next) {
    title = `Agent is ${doing(next.step)}`;
    sub = "Nothing needed from you.";
    actions = (
      <Button variant="ghost" onClick={() => dispatch({ type: "pause" })}>
        <Pause className="h-3.5 w-3.5" /> Pause <Key k="P" />
      </Button>
    );
  } else if (state.phase === "new") {
    sub = "Access request in at 09:12. The agent is starting.";
  } else if (state.phase === "in_review") {
    sub = "Stages 1 and 2 passed by rule. Stage 3: check a value on a blurry 2023 letter.";
    actions = (
      <>
        {handBtn}
        <Button variant="primary" onClick={() => go("review", "stage-3")}>Check the letter</Button>
      </>
    );
  } else if (state.phase === "re_review") {
    sub = failing ? `${failing} check failed. Sign-off is blocked.` : "Your letter value is in. Stages 1, 2 and 4 passed by rule.";
    actions = (
      <>
        {handBtn}
        <Button variant="primary" disabled={failing > 0} onClick={() => dispatch({ type: "signoff" })}>
          Sign off plan v2 · 4 stages <Key k="S" />
        </Button>
      </>
    );
  } else if (state.phase === "executed" || state.phase === "rashid_ready") {
    sub = state.phase === "executed" ? elig.summary : "Adding him keeps every approval combination valid.";
    actions = (
      <Button variant="primary" onClick={() => go("release", "sec-release")}>Go to release</Button>
    );
  } else if (state.phase === "partially_live") {
    sub = "Rashid joins when his EID clears EFR.";
    actions = <Button variant="ghost" onClick={() => dispatch({ type: "renew" })}>Demo: Rashid renews his EID</Button>;
  } else if (state.phase === "live") {
    sub = "Nothing left to do. Every step is in History.";
    actions = <Button onClick={() => setTab("audit")}>Open history</Button>;
  }

  return (
    <div role="region" aria-label="Decision bar" className={cn("flex h-16 shrink-0 items-center gap-4 border-t px-8", needs ? "border-warn/40 bg-warn-soft/40" : "border-line bg-surface")}>
      <span className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full", needs ? "bg-warn text-white" : "bg-panel text-sub")}>
        {working && !state.paused ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> : <Sparkles className="h-3.5 w-3.5" aria-hidden />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{needs && <span className="sr-only">Needs you: </span>}{title}</p>
        {sub && <p className="truncate text-xs text-sub">{sub}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </div>
  );
}
