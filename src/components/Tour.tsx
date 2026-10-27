"use client";

import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
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
    title: "Match on IDs, not names",
    body: "The agent matches people on EID and RCIF, never on names, and spots Rashid's expired EID.",
    tab: "evidence",
    readyWhen: after("in_review"),
    notReady: "The agent is still gathering evidence. Show me opens the live run.",
  },
  {
    title: "Approval is tied to the content",
    body: "Sara checks a blurry letter herself. Only stages 3 and 4 change, so her first approvals stay.",
    tab: "review",
    readyWhen: after("in_review"),
    notReady: "This opens once the agent sends the plan for review.",
  },
  {
    title: "Release what's safe, hold the rest",
    body: "Rashid is held. The rules prove the other two can still sign, so Sara releases them now.",
    tab: "release",
    readyWhen: after("executed"),
    notReady: "This opens after Sara approves all 4 stages and the agent sets them up.",
  },
  {
    title: "Keep secrets away from the agent",
    body: "The agent never sees a password. Each person sets their own login.",
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
  const { state, dispatch, hydrated } = useStore();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (!hydrated || checked) return;
    setChecked(true);
    if (localStorage.getItem("jointly-tour-seen") && state.tourOn && state.tourStep === 0) dispatch({ type: "tour", on: false });
  }, [hydrated, checked, state.tourOn, state.tourStep, dispatch]);
  if (!hydrated || !state.tourOn || !checked) return null;
  return <TourCard />;
}

function TourCard() {
  const { state, dispatch, setTab, hydrated } = useStore();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !state.tourOn) return;
      localStorage.setItem("jointly-tour-seen", "1");
      dispatch({ type: "tour", on: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.tourOn, dispatch]);
  if (!hydrated || !state.tourOn) return null;
  const end = () => {
    localStorage.setItem("jointly-tour-seen", "1");
    dispatch({ type: "tour", on: false });
  };
  const i = state.tourStep;
  const m = moments[i];
  const ready = m.readyWhen.includes(state.phase);
  const show = () => {
    setTab(ready ? m.tab : "run");
    if (!path.startsWith("/demo/case")) router.push("/demo/case/");
  };
  return (
    <div className="fixed bottom-6 left-1/2 z-50 hidden w-[420px] -translate-x-1/2 animate-enter rounded-card border border-line bg-surface p-5 shadow-lg lg:block" role="dialog" aria-label="Guided tour">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-brand">Moment {i + 1} of 4</p>
        <button onClick={end} className="rounded p-0.5 text-muted hover:bg-panel hover:text-ink" aria-label="Skip tour">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="mt-1 font-display text-xl leading-tight">{m.title}</h3>
      <p className="mt-1.5 text-sm text-sub">{m.body}</p>
      {!ready && <p className="mt-2 text-xs text-muted">{m.notReady}</p>}
      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={show}>
          Show me
        </Button>
        <Button size="sm" variant="ghost" onClick={i === 3 ? end : () => dispatch({ type: "tour", step: i + 1 })}>
          {i === 3 ? "Done" : "Next"}
        </Button>
        <Button size="sm" variant="ghost" className="ml-auto" onClick={end}>
          Skip
        </Button>
      </div>
    </div>
  );
}
