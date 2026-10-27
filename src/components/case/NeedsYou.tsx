"use client";

import { Hand, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { policyChecks, releaseEligibility } from "@/lib/rules";
import { eventById } from "@/lib/script";
import { headlineOf } from "@/lib/derive";
import { Tab, rulesFor, useStore, State } from "@/lib/store";
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
  const [toast, setToast] = useState<{ text: string; prev: State } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(t);
  }, [toast]);
  const releaseNow = (type: "release" | "releaseRashid", text: string) => {
    setToast({ text, prev: state });
    dispatch({ type });
  };
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
    <details className="relative">
      <summary className="flex h-9 cursor-pointer list-none items-center rounded-xl border border-line px-3 text-sm text-sub hover:text-ink [&::-webkit-details-marker]:hidden">More</summary>
      <div className="absolute bottom-full right-0 z-50 mb-2 w-60 rounded-xl border border-line bg-surface p-1 shadow-lg">
        <button
          type="button"
          onClick={(e) => {
            const d = e.currentTarget.closest("details");
            if (d) d.open = false;
            dispatch({ type: "handover" });
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-panel"
        >
          <Hand className="h-3.5 w-3.5" /> Hand to a colleague <Key k="H" />
        </button>
      </div>
    </details>
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
    if (state.copy === "requested") {
      title = "Waiting for a clean copy from the branch";
      sub = "Your reading differs, so the agent's value isn't used.";
      actions = (
        <>
          {handBtn}
          <Button variant="primary" onClick={() => dispatch({ type: "cleanCopy" })}>Skip ahead: the branch sends a clean copy</Button>
        </>
      );
    } else {
      const clean = state.copy === "received";
      actions = (
        <>
          {handBtn}
          <Button
            variant="primary"
            onClick={() => {
              const d = { handled: false };
              window.dispatchEvent(new CustomEvent("jointly:accept-scan", { detail: d }));
              if (!d.handled) go("review", "stage-3", "#scan-value");
            }}
          >
            {clean ? "Check the clean copy" : "Confirm AED 25,000"} {!clean && <Key k="Enter" />}
          </Button>
        </>
      );
    }
  } else if (state.phase === "re_review") {
    sub = failing ? `${failing} check failed. Sign-off is blocked.` : "Your letter value is in. Stages 1, 2 and 4 passed by rule.";
    actions = (
      <>
        {handBtn}
        <Button variant="primary" disabled={failing > 0} onClick={() => dispatch({ type: "signoff" })}>
          Sign off <Key k="S" />
        </Button>
      </>
    );
  } else if (state.phase === "executed") {
    sub = elig.summary;
    actions = (
      <Button variant="primary" disabled={!elig.eligible || failing > 0} onClick={() => releaseNow("release", "Mohammed and Khalifa are being released, and their messages go out in 10 seconds.")}>
        Release Mohammed and Khalifa
      </Button>
    );
  } else if (state.phase === "rashid_ready") {
    sub = "Adding him keeps every approval combination valid.";
    actions = (
      <Button variant="primary" onClick={() => releaseNow("releaseRashid", "Rashid is being released, and his message goes out in 10 seconds.")}>
        Release Rashid
      </Button>
    );
  } else if (state.phase === "partially_live") {
    sub = "Rashid joins when his EID clears EFR.";
    actions = <Button variant="primary" onClick={() => dispatch({ type: "renew" })}>Skip ahead 2 days: Rashid renews his ID</Button>;
  } else if (state.phase === "live") {
    sub = "Nothing left to do. Every step is in History.";
    actions = <Button variant="primary" onClick={() => setTab("audit")}>Open history</Button>;
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
      {toast && (
        <div role="status" className="fixed bottom-20 right-8 z-50 flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm shadow-lg">
          {toast.text}
          <Button size="sm" onClick={() => { dispatch({ type: "hydrate", state: toast.prev }); setToast(null); }}>Undo</Button>
        </div>
      )}
    </div>
  );
}
