"use client";

import { Hand, Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { policyChecks, releaseEligibility } from "@/lib/rules";
import { eventById } from "@/lib/script";
import { headlineOf } from "@/lib/derive";
import { Tab, rulesFor, useStore, allApproved, versionOf } from "@/lib/store";
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

export function legacyBeat(lastId?: string) {
  if (lastId === "ex-workflow-fail") return "Digital Banking Admin timed out at step 5 of 5. Nothing was half-written. Retrying.";
  if (lastId === "ex-workflow" || lastId === "ex-readback") return "Retry worked. Read back from Admin: 0 differences from the approved plan.";
  return null;
}

export function LegacyBeat() {
  const { state } = useStore();
  const beat = legacyBeat(state.log[state.log.length - 1]?.id);
  if (!beat || !state.queue.length) return null;
  return (
    <p role="status" className="flex items-center gap-2 rounded-card border border-line bg-surface px-4 py-3 text-sm">
      <span className="rounded-full bg-panel px-2 py-0.5 text-[11px] text-sub">Legacy system</span>
      {beat}
    </p>
  );
}

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
  const [scanVal, setScanVal] = useState<number | null>(null);
  useEffect(() => {
    const on = (e: Event) => setScanVal((e as CustomEvent<number | null>).detail);
    window.addEventListener("jointly:scan", on);
    return () => window.removeEventListener("jointly:scan", on);
  }, []);
  useEffect(() => {
    if (state.phase !== "in_review") setScanVal(null);
  }, [state.phase]);
  const go = (t: Tab, anchor: string, focus?: string) => {
    setTab(t);
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (!el) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1500);
      const f = (focus && document.querySelector<HTMLElement>(focus)) || el.querySelector<HTMLElement>("input, button:not([disabled])");
      f?.focus({ preventScroll: true });
    }, 80);
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
    const beat = legacyBeat(state.log[state.log.length - 1]?.id);
    title = beat ?? `Agent is ${doing(next.step)}`;
    sub = beat ? "Legacy system · Digital Banking Admin" : "Nothing needed from you.";
    actions = (
      <Button variant="ghost" onClick={() => dispatch({ type: "pause" })}>
        <Pause className="h-3.5 w-3.5" /> Pause <Key k="P" />
      </Button>
    );
  } else if (state.phase === "new") {
    sub = "Access request in at 09:12. The agent is starting.";
  } else if ((state.phase === "in_review" || state.phase === "re_review") && state.copy === "requested") {
    title = "Waiting for a clean copy from the branch";
    sub = "You disagreed with the agent's reading, so the case waits and the agent's value isn't used.";
    actions = (
      <Button variant="primary" onClick={() => { dispatch({ type: "cleanCopy" }); setTimeout(() => go("review", "stage-3", "#scan-value"), 50); }}>Skip ahead: the branch sends a clean copy</Button>
    );
  } else if (state.phase === "in_review" && !allApproved(state)) {
    sub = "Stages 1 and 2 passed by rule. Check the one value on the blurry 2023 letter.";
    const differs = scanVal !== null && scanVal !== 25000;
    if (differs) {
      title = `You read AED ${scanVal.toLocaleString("en-US")}, but the agent read AED 25,000 and wasn't sure.`;
      sub = "The agent won't use its value, so ask the branch for a clean copy or use yours.";
    }
    actions = (
      <>
        {handBtn}
        {differs ? (
          <Button variant="primary" onClick={() => dispatch({ type: "askCopy", value: scanVal })}>Ask the branch for a clean copy</Button>
        ) : (
          <Button variant="primary" onClick={() => go("review", "stage-3", "#scan-value")}>Confirm AED 25,000 <Key k="Enter" /></Button>
        )}
      </>
    );
  } else if (state.phase === "re_review" || state.phase === "in_review") {
    sub = failing ? `${failing} check failed. Sign-off is blocked.` : state.mine ? "You used your own value, so the plan keeps AED 10,000. Stages 1, 2 and 4 passed by rule." : "Your letter value is in. Stages 1, 2 and 4 passed by rule.";
    actions = (
      <>
        {handBtn}
        <Button variant="primary" disabled={failing > 0} onClick={() => dispatch({ type: "signoff" })}>
          Sign off plan v{versionOf(state)} · 4 stages <Key k="S" />
        </Button>
      </>
    );
  } else if (state.phase === "executed" || state.phase === "rashid_ready") {
    sub = state.phase === "executed" ? elig.summary : "Adding him keeps every approval combination valid.";
    actions = (
      <Button
        variant="primary"
        onClick={() => {
          const sel = state.phase === "rashid_ready" ? "[data-release-rashid]" : "[data-release-main]";
          go("release", "sec-release", sel);
          setTimeout(() => document.querySelector<HTMLElement>(sel)?.click(), 120);
        }}
      >
        {state.phase === "rashid_ready" ? "Release Rashid" : "Release Mohammed and Khalifa"}
      </Button>
    );
  } else if (state.phase === "partially_live") {
    sub = "Rashid joins when his EID clears EFR.";
    actions = <Button variant="ghost" onClick={() => dispatch({ type: "renew" })}>Demo: Rashid renews his EID</Button>;
  } else if (state.phase === "live") {
    sub = "Nothing left to do. Every step is in History.";
    actions = <Button onClick={() => setTab("decisions")}>See the decision record</Button>;
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
