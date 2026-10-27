"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, X } from "lucide-react";
import { useState } from "react";
import { Phase, Tab, useStore } from "@/lib/store";
import { Button } from "./ui";

interface Moment {
  title: string;
  body: string;
  tab: Tab;
  readyWhen: Phase[];
  notReady: string;
}

const order: Phase[] = ["new", "running", "in_review", "revising", "re_review", "executing", "executed", "releasing", "partially_live", "renewing", "live"];
const after = (p: Phase) => order.slice(order.indexOf(p));

export const moments: Moment[] = [
  {
    title: "Pattern: match on IDs, not names",
    body: "Three systems spell Mohammed three ways. The agent matches people on EID and RCIF only, and catches Rashid's expired EID before any setup starts.",
    tab: "evidence",
    readyWhen: after("in_review"),
    notReady: "The agent is still gathering evidence. Show me opens the live run.",
  },
  {
    title: "Pattern: approval is tied to the content",
    body: "Stage 3 shows a blurry 2023 letter next to what the agent read. Sara types the value from the image, and only stages 3 and 4 come back as a diff. Her first two approvals stay.",
    tab: "review",
    readyWhen: after("in_review"),
    notReady: "This opens once the agent sends the plan for review.",
  },
  {
    title: "Pattern: release what's safe, hold the rest",
    body: "Rashid is held for EFR. The rules engine proves Mohammed and Khalifa can still form \u201cany two\u201d, so Sara can release them now. Rashid joins later, for future payments only.",
    tab: "release",
    readyWhen: after("executed"),
    notReady: "This opens after Sara approves all 4 stages and the agent sets them up.",
  },
  {
    title: "Pattern: keep secrets away from the agent",
    body: "The agent never sees a password. In the proposed After, each person verifies their own EID and sets their own login. That also removes the courier, which alone takes days.",
    tab: "release",
    readyWhen: after("releasing"),
    notReady: "This opens after Sara releases Mohammed and Khalifa.",
  },
];

export function useTourTarget(n: number) {
  const { state } = useStore();
  return state.tourOn && state.tourStep === n ? { "data-tour-active": "true" } : {};
}

export function Tour() {
  const { state, dispatch, setTab, hydrated } = useStore();
  const router = useRouter();
  const path = usePathname();
  const [min, setMin] = useState(false);
  if (!hydrated || !state.tourOn) return null;
  const i = state.tourStep;
  const m = moments[i];
  const ready = m.readyWhen.includes(state.phase);
  const show = () => {
    setTab(ready ? m.tab : "run");
    if (!path.startsWith("/demo/case")) router.push("/demo/case/");
  };
  if (min)
    return (
      <button onClick={() => setMin(false)} className="fixed bottom-4 right-4 z-40 hidden animate-enter items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-accent-ink shadow-md hover:bg-panel lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Moment {i + 1} of 4
      </button>
    );
  return (
    <div className="fixed bottom-4 right-3 z-40 hidden w-[296px] animate-enter rounded-xl border border-line bg-surface p-4 shadow-lg lg:block" role="dialog" aria-label="Guided tour">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-accent-ink">Moment {i + 1} of 4</p>
        <div className="flex gap-0.5">
          <button onClick={() => setMin(true)} className="rounded p-0.5 text-muted hover:bg-panel hover:text-ink" aria-label="Minimise tour">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => dispatch({ type: "tour", on: false })} className="rounded p-0.5 text-muted hover:bg-panel hover:text-ink" aria-label="Turn off tour">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <h3 className="mt-1 text-sm font-semibold">{m.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-sub">{m.body}</p>
      {!ready && <p className="mt-2 rounded-md bg-panel px-2.5 py-1.5 text-xs text-sub">{m.notReady}</p>}
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={show}>
          Show me
        </Button>
        <div className="ml-auto flex gap-1">
          <Button size="sm" variant="ghost" aria-label="Previous moment" disabled={i === 0} onClick={() => dispatch({ type: "tour", step: i - 1 })}>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" aria-label="Next moment" disabled={i === 3} onClick={() => dispatch({ type: "tour", step: i + 1 })}>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
