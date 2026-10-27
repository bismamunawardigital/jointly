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
    title: "The agent did the legwork",
    body: "Sara only checks what it had to read. Here, that's 1 amber value from a blurry letter.",
    tab: "review",
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
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const deep = /[?&](moment|view|tab)=/.test(window.location.search);
    if (deep) {
      localStorage.setItem("jointly-tour-seen", "1");
      dispatch({ type: "tour", on: false });
    }
  }, [dispatch]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !state.tourOn) return;
      localStorage.setItem("jointly-tour-seen", "1");
      dispatch({ type: "tour", on: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.tourOn, dispatch]);
  useEffect(() => {
    const place = () => {
      setBlocked(!!document.querySelector('[aria-modal="true"]'));
      const t = document.querySelector<HTMLElement>('[data-tour-active="true"]');
      if (!t) return setBox(null);
      const r = t.getBoundingClientRect();
      const W = 400, H = 220, M = 16;
      const left = Math.min(Math.max(M, r.left), window.innerWidth - W - M);
      const top = r.bottom + H + M < window.innerHeight ? r.bottom + M : r.top - H - M > 0 ? r.top - H - M : window.innerHeight - H - M;
      setBox({ top, left });
    };
    place();
    const id = window.setInterval(place, 400);
    return () => window.clearInterval(id);
  }, [state.tourStep, path]);
  if (!hydrated || !state.tourOn || blocked || !path.startsWith("/demo/case")) return null;
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
    <>
      {!box && <div className="fixed inset-0 z-40 bg-ink/30" aria-hidden />}
      <div
        className={box ? "fixed z-50 w-[400px] rounded-card border border-line bg-surface p-5 shadow-lg" : "fixed bottom-24 left-1/2 z-50 w-[400px] -translate-x-1/2 rounded-card border border-line bg-surface p-5 shadow-lg"}
        style={box ?? undefined}
        role="dialog"
        aria-label="Guided tour"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-brand">Moment {i + 1} of 4</p>
          <button type="button" onClick={(e) => { e.stopPropagation(); end(); }} className="rounded p-1 text-muted hover:bg-panel hover:text-ink" aria-label="Close tour">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-1 font-display text-xl leading-tight">{m.title}</h3>
        <p className="mt-1.5 text-sm text-sub">{m.body}</p>
        {!ready && <p className="mt-2 text-xs text-muted">{m.notReady}</p>}
        <div className="mt-4 flex items-center gap-2">
          {i > 0 && (
            <Button size="sm" onClick={show}>
              Show me
            </Button>
          )}
          <Button size="sm" variant={i === 0 ? "primary" : "ghost"} onClick={i === 3 ? end : () => dispatch({ type: "tour", step: i + 1 })}>
            {i === 3 ? "Done" : "Next"}
          </Button>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={end}>
            Skip
          </Button>
        </div>
      </div>
    </>
  );
}
