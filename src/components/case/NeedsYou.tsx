"use client";

import { Hand, Loader2, Pause, Play } from "lucide-react";
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
  const done = state.log.filter((e) => e.kind === "agent").length;
  if (working && next && state.handedOver) {
    body = (
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium"><Hand className="h-4 w-4 text-warn" /> With Omar K., Ops maker</p>
        <p className="mt-1 text-xs text-muted">Sent to the Business onboarding makers queue</p>
        <dl className="mt-3 grid grid-cols-[52px_1fr] gap-y-1 text-xs">
          <dt className="text-muted">Done</dt>
          <dd className="text-sub">{done} agent steps, all saved</dd>
          <dt className="text-muted">Left</dt>
          <dd className="text-sub">{state.queue.length} steps, starting <span className="font-mono">{next.call}</span></dd>
          <dt className="text-muted">Half-done</dt>
          <dd className="text-sub">Nothing</dd>
        </dl>
        <Button className="mt-4 w-full" onClick={() => dispatch({ type: "resume" })}>
          <Play className="h-3.5 w-3.5" /> Take it back, resume agent
        </Button>
      </div>
    );
  } else if (working && next && state.paused) {
    body = (
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium"><Pause className="h-4 w-4 text-warn" /> Agent paused</p>
        <p className="mt-1 text-sm text-sub">Stopped between steps. Nothing is half-written.</p>
        <p className="mt-2 text-xs text-muted">{done} done · {state.queue.length} left · next <span className="font-mono">{next.call}</span></p>
        <div className="mt-4 space-y-2">
          <Button variant="primary" className="w-full" onClick={() => dispatch({ type: "resume" })}>
            <Play className="h-3.5 w-3.5" /> Resume
          </Button>
          <Button className="w-full" onClick={() => dispatch({ type: "handover" })}>
            <Hand className="h-3.5 w-3.5" /> Hand to a maker
          </Button>
        </div>
      </div>
    );
  } else if (working && next) {
    body = (
      <div>
        <div className="flex items-start gap-2.5">
          <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-accent" />
          <div>
            <p className="text-sm font-medium">{next.actor} is working</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">{next.call}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-sub">Nothing needed from you.</p>
        <Button size="sm" variant="ghost" className="mt-3" onClick={() => dispatch({ type: "pause" })}>
          <Pause className="h-3.5 w-3.5" /> Pause agent
        </Button>
      </div>
    );
  } else if (state.phase === "new") {
    body = (
      <>
        <p className="text-sm text-sub">Access request in at 09:12. The agent is starting.</p>
      </>
    );
  } else if (state.phase === "in_review") {
    body = (
      <>
        <p className="text-sm font-medium">Review plan v1</p>
        <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-xs text-warn-ink">Stage 3: check a value on a blurry 2023 letter.</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => setTab("review")}>
          Open checker review
        </Button>
      </>
    );
  } else if (state.phase === "re_review") {
    body = (
      <>
        <p className="text-sm font-medium">Review the changes in plan v2</p>
        <p className="mt-1 text-sm text-sub">Stages 3 and 4 changed. 1 and 2 keep your approval.</p>
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
        <Button variant="primary" className="mt-4 w-full" onClick={() => setTab("release")}>
          Open release decision
        </Button>
      </>
    );
  } else if (state.phase === "partially_live") {
    body = (
      <>
        <p className="text-sm font-medium">Live, 2 of 3</p>
        <p className="mt-1 text-sm text-sub">Rashid joins when his EID clears EFR.</p>
        <div className="mt-4 rounded-lg border border-dashed border-line p-3">
          <p className="text-xs text-muted">Demo control</p>
          <Button className="mt-2 w-full" onClick={() => dispatch({ type: "renew" })}>
            Skip ahead: Rashid renews his EID
          </Button>
        </div>
      </>
    );
  } else if (state.phase === "rashid_ready") {
    body = (
      <>
        <p className="text-sm font-medium">Rashid&apos;s EID is renewed. Release Rashid?</p>
        <p className="mt-1 text-sm text-sub">Adding him keeps every approval combination valid.</p>
        <Button variant="primary" className="mt-4 w-full" onClick={() => setTab("release")}>
          Open release decision
        </Button>
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
    </aside>
  );
}
