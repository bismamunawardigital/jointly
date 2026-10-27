"use client";

import { Ban, Bot, Scale, UserCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { business } from "@/data/seed";
import { duration, lastTime, statusOf } from "@/lib/derive";
import { Tab, hasEvent, useStore, jumpState, initialState } from "@/lib/store";
import { Pill, cn } from "@/components/ui";
import { eventById } from "@/lib/script";
import { LegacyBeat, NeedsYou } from "./NeedsYou";
import { ReplayRun } from "./ReplayRun";
import { ProgressView } from "./ProgressView";
import { SigningMap } from "./SigningMap";
import { PaymentWorkflow } from "./PaymentWorkflow";
import { EvidenceView } from "./EvidenceView";
import { PlanView } from "./PlanView";
import { SimulatorView } from "./SimulatorView";
import { ReviewView } from "./ReviewView";
import { ReleaseView } from "./ReleaseView";
import { AuditView } from "./AuditView";
import { DecisionView } from "./DecisionView";
import { CommandPalette } from "@/components/CommandPalette";

type Group = { id: "review" | "setup" | "history"; label: string; sections: { id: Tab; label: string }[] };
const groups: Group[] = [
  { id: "review", label: "Review", sections: [{ id: "review", label: "Checker review" }, { id: "release", label: "Release" }, { id: "run", label: "Agent progress" }] },
  { id: "setup", label: "Setup", sections: [{ id: "map", label: "Signing map" }, { id: "evidence", label: "Identity" }, { id: "plan", label: "Users and roles" }, { id: "simulator", label: "Simulator" }] },
  { id: "history", label: "History", sections: [{ id: "audit", label: "Timeline" }, { id: "decisions", label: "Decision record" }] },
];
const groupOf = (t: Tab) => groups.find((g) => g.sections.some((x) => x.id === t)) ?? groups[2];
const how = [
  { icon: Bot, title: "The agent does it alone", line: "Reads, matches and drafts. Every step is logged with its source." },
  { icon: Scale, title: "Rules decide", line: "Who can sign and up to what amount. Code, not a model." },
  { icon: UserCheck, title: "Sara approves", line: "Anything that changes who can move money." },
  { icon: Ban, title: "Never allowed", line: "Waiving EFR, approving its own work, seeing a password." },
];
const paletteTabs = groups.flatMap((g) => g.sections.map((x) => ({ id: x.id, label: `${g.label} › ${x.label}` })));
const firstOf = (t: Tab) => groups.some((g) => g.sections[0].id === t);

function NotYet() {
  return <p className="rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">This part fills in as the case moves.</p>;
}

export function CaseWorkspace() {
  const { state, dispatch, tab, setTab, hydrated } = useStore();
  const [progressOpen, setProgressOpen] = useState(false);
  const agentWorking = state.queue.length > 0 && !state.paused;
  const reviewing = state.phase === "in_review" || state.phase === "re_review";
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.ctrlKey || e.metaKey || e.altKey || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "p") {
        if (state.paused || state.handedOver) dispatch({ type: "resume" });
        else if (state.queue.length) dispatch({ type: "pause" });
      } else if (k === "h" && !state.handedOver && (reviewing || state.queue.length)) {
        dispatch({ type: "handover" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.paused, state.handedOver, state.queue.length, reviewing, dispatch]);
  useEffect(() => {
    if (!hydrated) return;
    if (tab === "run") {
      setProgressOpen(true);
      return;
    }
    if (firstOf(tab)) return;
    const t = setTimeout(() => document.getElementById(`sec-${tab}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    return () => clearTimeout(t);
  }, [tab, hydrated]);
  const readyAt: Partial<Record<Tab, string>> = { map: "plan-build", evidence: "id-digital", plan: "plan-build", simulator: "plan-build", review: "submit", release: "ex-readback" };
  const notYet = (t: Tab) => !!readyAt[t] && !hasEvent(state, readyAt[t]!);
  const st = state.handedOver ? { label: "With a maker", tone: "warn" as const } : state.paused && state.queue.length ? { label: "Paused", tone: "warn" as const } : statusOf[state.phase];
  const now = lastTime(state);
  const firstLogin = hasEvent(state, "rel-mohammed-login");
  const reviewDot = state.phase === "in_review" || state.phase === "re_review";
  const releaseDot = state.phase === "executed" || state.phase === "partially_live" || state.phase === "rashid_ready";
  const [mac, setMac] = useState(false);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), []);
  const [jumped, setJumped] = useState(false);
  const skipPhase = useRef(false);
  useEffect(() => {
    if (!hydrated) return;
    const q = new URLSearchParams(window.location.search);
    const want = q.get("tab");
    const moment = q.get("moment");
    const view = q.get("view");
    const spot = (sel: string, focus?: string) =>
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: sel.startsWith("#sec-") ? "start" : "center" });
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 1500);
        if (focus) document.querySelector<HTMLElement>(focus)?.focus({ preventScroll: true });
      }, 300);
    if (moment || view) {
      setJumped(true);
      const next = moment === "4" ? jumpState("executed") : view === "record" ? jumpState("live") : initialState;
      skipPhase.current = next.phase !== prevPhase.current;
      dispatch({ type: "hydrate", state: next });
      if (moment === "4") {
        setTab("release");
        spot("#sec-release");
      } else if (view === "record") {
        setTab("decisions");
        spot("#sec-decisions");
      } else if (view === "map") {
        setTab("map");
        spot("#sec-map");
      } else {
        setTab("review");
        if (moment === "1") spot('tr[data-row="mohammed"]');
        if (moment === "2") spot('tr[data-row="rashid"] [data-c="2"]');
        if (moment === "3") spot("#stage-3", "#scan-value");
      }
      return;
    }
    if (want && groups.some((g) => g.sections.some((x) => x.id === want))) setTab(want as Tab);
  }, [hydrated, setTab, dispatch]);
  useEffect(() => {
    if (hydrated && state.phase === "new" && !state.queue.length) dispatch({ type: "start", group: "run" });
  }, [hydrated, state.phase, state.queue.length, dispatch]);
  const [howOpen, setHowOpen] = useState(false);
  const prevPhase = useRef(state.phase);
  useEffect(() => {
    const was = prevPhase.current;
    prevPhase.current = state.phase;
    if (!hydrated || was === state.phase) return;
    if (skipPhase.current) {
      skipPhase.current = false;
      return;
    }
    const go: Partial<Record<string, Tab>> = { in_review: "review", re_review: "review", executed: "release", rashid_ready: "release" };
    const t = go[state.phase];
    if (t) setTab(t);
  }, [state.phase, hydrated, setTab]);
  const group = groupOf(tab);
  if (!hydrated) return null;
  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line px-8 pb-0 pt-4">
          <div className="flex items-center gap-3 text-xs">
            <h1 className="truncate font-display text-lg leading-tight text-ink">{business.name}</h1>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("jointly:intro"))} className="hidden truncate rounded-full border border-line px-2.5 py-0.5 text-xs text-sub hover:text-ink 2xl:inline">Scenario: getting Creekside&apos;s 3 partners onto online banking</button>
            <Pill tone={st.tone}>{st.label}</Pill>
            <bdi dir="ltr" className="hidden tnum text-muted xl:inline">{business.iban}</bdi>
            <span className="ml-auto flex items-center gap-4 text-muted">
              {now && (
                <span title={firstLogin ? undefined : "Time since the customer's forms arrived. The agent started at 09:12."}>
                  {firstLogin ? "Form to first login " : "Elapsed "}
                  <span className="tnum font-medium text-ink">{duration(business.submittedAt, firstLogin ? eventById("rel-mohammed-login").time : now)}</span>
                </span>
              )}
              <button type="button" onClick={() => setProgressOpen(true)} className="hover:text-ink hover:underline">Agent progress</button>
              <button type="button" onClick={() => setHowOpen(true)} className="hover:text-ink hover:underline">How it works</button>
              <button type="button" onClick={() => window.dispatchEvent(new Event("jointly:palette"))} className="hover:text-ink">
                <kbd className="rounded border border-line px-1">{mac ? "⌘K" : "Ctrl K"}</kbd>
              </button>
            </span>
          </div>
          <nav aria-label="Case steps" className="-mb-px mt-3 flex gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist">
            {groups.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={group.id === g.id}
                onClick={() => setTab(g.sections[0].id)}
                className={cn("relative flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-sm transition-colors duration-150", group.id === g.id ? "border-brand font-medium text-ink" : "border-transparent text-muted hover:text-ink")}
              >
                {g.label}
                {g.id === "review" && (reviewDot || releaseDot) && <span className="h-1.5 w-1.5 rounded-full bg-warn" />}
              </button>
            ))}
          </nav>
        </header>
        {jumped && (
          <div role="status" className="flex items-center gap-3 border-b border-line bg-panel px-8 py-2 text-xs text-sub">
            You jumped ahead. Reset demo to start from the beginning.
            <button
              type="button"
              onClick={() => {
                setJumped(false);
                window.history.replaceState(null, "", window.location.pathname);
                dispatch({ type: "reset" });
                setTab("review");
              }}
              className="rounded-md border border-line bg-surface px-2.5 py-1 font-medium text-ink hover:bg-canvas"
            >
              Reset
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-12">
          <div key={group.id}>
            {group.id === "review" && (
              <div className="max-w-[1280px] space-y-10 pt-6">
                <LegacyBeat />
                {agentWorking && <ProgressView />}
                {hasEvent(state, "submit") ? <ReviewView /> : !agentWorking && <NotYet />}
                {hasEvent(state, "ex-readback") && (
                  <section id="sec-release" aria-label="Release" className="scroll-mt-6">
                    <ReleaseView />
                  </section>
                )}
              </div>
            )}
            {group.id === "setup" && (
              <>
                <nav aria-label="Setup sections" className="sticky top-0 z-10 -mx-8 mb-6 flex gap-4 border-b border-line bg-canvas/95 px-8 py-2.5 text-xs backdrop-blur">
                  {groups[1].sections.map((x) => (
                    <a key={x.id} href={`#sec-${x.id}`} className="text-sub hover:text-ink">{x.label}</a>
                  ))}
                </nav>
                <div className="max-w-4xl space-y-12">
              <section id="sec-map" aria-label="Signing map" className="scroll-mt-14">
                <h2 className="mb-3 text-sm font-semibold text-sub">Signing map</h2>
                {notYet("map") ? <NotYet /> : (
                    <div className="space-y-8">
                      <SigningMap />
                      <div>
                        <h3 className="mb-3 text-sm font-semibold">How a payment gets approved</h3>
                        <PaymentWorkflow />
                      </div>
                    </div>
                  )}
              </section>
              <section id="sec-evidence" aria-label="Identity" className="scroll-mt-14">
                <h2 className="mb-3 text-sm font-semibold text-sub">Identity</h2>
                {notYet("evidence") ? <NotYet /> : <EvidenceView />}
              </section>
              <section id="sec-plan" aria-label="Users and roles" className="scroll-mt-14">
                <h2 className="mb-3 text-sm font-semibold text-sub">Users and roles</h2>
                {notYet("plan") ? <NotYet /> : <PlanView />}
              </section>
              <section id="sec-simulator" aria-label="Simulator" className="scroll-mt-14">
                <h2 className="mb-3 text-sm font-semibold text-sub">Simulator</h2>
                {notYet("simulator") ? <NotYet /> : <SimulatorView />}
              </section>
                </div>
              </>
            )}
            {group.id === "history" && (
              <div className="max-w-4xl space-y-12 pt-6">
                <section id="sec-audit" aria-label="Timeline"><AuditView /></section>
                <section id="sec-decisions" aria-label="Decision record" className="scroll-mt-6"><DecisionView /></section>
              </div>
            )}
          </div>
        </div>
        <NeedsYou />
      </div>
      <CommandPalette tabs={paletteTabs} />
      {progressOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Agent progress">
          <button aria-label="Close" className="absolute inset-0 bg-ink/30" onClick={() => { setProgressOpen(false); if (tab === "run") setTab("review"); }} />
          <div className="relative h-full w-[560px] max-w-full animate-enter overflow-y-auto border-l border-line bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Agent progress</h2>
              <button aria-label="Close agent progress" onClick={() => { setProgressOpen(false); if (tab === "run") setTab("review"); }} className="rounded p-1 text-muted hover:bg-panel hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ReplayRun onDone={() => { setProgressOpen(false); setTab("review"); }} />
            <LegacyBeat />
            <ProgressView />
          </div>
        </div>
      )}
      {howOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="How this agent works">
          <button aria-label="Close" className="absolute inset-0 bg-ink/30" onClick={() => setHowOpen(false)} />
          <div className="relative h-full w-[440px] animate-enter overflow-y-auto border-l border-line bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">How this agent works</h2>
              <button aria-label="Close" onClick={() => setHowOpen(false)} className="rounded p-1 text-muted hover:bg-panel hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-5">
              {how.map(({ icon: I, title, line }) => (
                <li key={title} className="flex gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink">
                    <I className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-sub">{line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
