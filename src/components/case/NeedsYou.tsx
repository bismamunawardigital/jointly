"use client";

import { Hand, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { policyChecks, releaseEligibility } from "@/lib/rules";
import { eventById } from "@/lib/script";
import { headlineOf } from "@/lib/derive";
import { Tab, rulesFor, useStore } from "@/lib/store";
import { Button, cn, AgentMark } from "@/components/ui";

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

export const maker = "Omar K., maker";

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
  const [scanOk, setScanOk] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setScanOk(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("jointly:scan", on);
    return () => window.removeEventListener("jointly:scan", on);
  }, []);
  useEffect(() => {
    if (state.phase !== "in_review") setScanOk(false);
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
  } else if (state.phase === "in_review") {
    sub = "Stages 1 and 2 passed by rule. Stage 3: check a value on a blurry 2023 letter.";
    if (scanOk) {
      title = "Your reading matches the agent's";
      sub = "Confirm it and the agent updates the plan to v2.";
    }
    actions = (
      <>
        {handBtn}
        {scanOk ? (
          <Button variant="primary" onClick={() => dispatch({ type: "confirm", value: 25000 })}>Confirm and update the plan</Button>
        ) : (
          <Button variant="primary" onClick={() => go("review", "stage-3", "#scan-value")}>Check the letter</Button>
        )}
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
      <Button variant="primary" onClick={() => go("release", "sec-release", state.phase === "rashid_ready" ? "[data-release-rashid]" : "[data-release-main]")}>Go to release</Button>
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
        {working && !state.paused ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> : <AgentMark size={14} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{needs && <span className="sr-only">Needs you: </span>}{title}</p>
        {sub && <p className="truncate text-xs text-sub">{sub}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </div>
  );
}
