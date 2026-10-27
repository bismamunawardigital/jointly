"use client";

import { EvidenceGrid } from "./EvidenceGrid";
import { ReturnThread } from "./ReturnThread";
import { PaymentWorkflow } from "./PaymentWorkflow";
import { SigningMap } from "./SigningMap";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Repeat, ShieldCheck, Undo2 } from "lucide-react";
import { EvidenceKey, isAgentRead } from "@/data/seed";
import { approvalValid, buildStages, diffStage, fmt, policyChecks } from "@/lib/rules";
import { allApproved, hasEvent, useStore } from "@/lib/store";
import { useTourTarget } from "@/components/Tour";
import { Avatar, BasisTag, Button, Card, Empty, Pill, Proof, Tween, cn } from "@/components/ui";


function wordDiff(a: string, b: string) {
  const x = a.split(" "), y = b.split(" ");
  let p = 0;
  while (p < x.length && p < y.length && x[p] === y[p]) p++;
  let q = 0;
  while (q < x.length - p && q < y.length - p && x[x.length - 1 - q] === y[y.length - 1 - q]) q++;
  return { pre: x.slice(0, p).join(" "), del: x.slice(p, x.length - q).join(" "), ins: y.slice(p, y.length - q).join(" "), post: x.slice(x.length - q).join(" ") };
}

function TweenFrom({ from, to }: { from: number; to: number }) {
  const [v, setV] = useState(from);
  useEffect(() => setV(to), [to]);
  return <Tween value={v} prefix="AED " />;
}

function Changed({ before, after }: { before: string; after: string }) {
  if (before === after) return <>{after}</>;
  const d = wordDiff(before, after);
  const num = (x: string) => /^AED [\d,]+$/.test(x) ? Number(x.slice(4).replace(/,/g, "")) : NaN;
  const nb = num(d.del), na = num(d.ins);
  if (!isNaN(nb) && !isNaN(na)) {
    return (
      <>
        {d.pre && `${d.pre} `}
        <del className="rounded bg-bad-soft px-0.5 text-bad-ink">{d.del}</del>{" "}
        <ins className="rounded bg-ok-soft px-0.5 font-medium text-ok-ink no-underline">
          <TweenFrom from={nb} to={na} />
        </ins>
        {d.post && ` ${d.post}`}
      </>
    );
  }
  return (
    <>
      {d.pre && `${d.pre} `}
      {d.del && <del className="rounded bg-bad-soft px-0.5 text-bad-ink">{d.del}</del>}
      {d.del && d.ins && " "}
      {d.ins && <ins className="rounded bg-ok-soft px-0.5 font-medium text-ok-ink no-underline">{d.ins}</ins>}
      {d.post && ` ${d.post}`}
    </>
  );
}

function coverage(stageId: number, version: 1 | 2) {
  if (stageId === 1) return { label: "Finacle records", n: 3, of: 3 };
  if (stageId === 2) return { label: "SVS signatories", n: 3, of: 3 };
  return { label: "SVS documents confirmed", n: version === 1 ? 1 : 2, of: 2 };
}

function Coverage({ n, of, label }: { n: number; of: number; label: string }) {
  const full = n === of;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px]", full ? "text-ok-ink" : "text-warn-ink")} title={`${label}: ${n} of ${of}`}>
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: of }, (_, i) => (
          <span key={i} className={cn("h-1.5 w-3 rounded-full", i < n ? (full ? "bg-ok" : "bg-warn") : "bg-line-strong")} />
        ))}
      </span>
      {label} {n}/{of}
    </span>
  );
}

function ClaimRow({ label, value, sources }: { label: React.ReactNode; value: React.ReactNode; sources: EvidenceKey[] }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4 px-3 py-3">
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-sm">{value}</p>
        <div className="mt-1.5">
          <BasisTag keys={sources} />
        </div>
      </div>
      <div className="space-y-1.5">
        {sources.map((k) => (
          <Proof key={k} k={k} />
        ))}
      </div>
    </li>
  );
}

function ScanLens({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };
  const L = 180;
  return (
    <button
      type="button"
      aria-label={zoom ? "Zoom out of the scan" : "Zoom into the scan, 2x"}
      aria-pressed={zoom}
      onClick={(e) => {
        move(e as unknown as React.PointerEvent<HTMLButtonElement>);
        setZoom((z) => !z);
      }}
      onPointerMove={move}
      className={cn("relative block w-full overflow-hidden rounded-md border border-line", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full" draggable={false} />
      {zoom && (
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full border-2 border-surface shadow-lg"
          style={{
            width: L,
            height: L,
            left: pos.x - L / 2,
            top: pos.y - L / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${pos.w * 2}px ${pos.h * 2}px`,
            backgroundPosition: `${-(pos.x * 2 - L / 2)}px ${-(pos.y * 2 - L / 2)}px`,
          }}
        />
      )}
    </button>
  );
}

function CleanLetter() {
  return (
    <div className="rounded-lg border border-line bg-white p-5 font-serif text-[15px] leading-relaxed text-[#1b1b1b]">
      <p className="font-semibold">Subject: Amendment to signing mandate</p>
      <p className="mt-2">The single-signing limit of Khalifa Saeed Al Falasi is revised to AED 25,000 with effect from 01-Mar-2023. All other terms of the 2019 mandate remain unchanged.</p>
    </div>
  );
}

function ScanCheck({ canAct, onConfirm, onReturn }: { canAct: boolean; onConfirm: (v: number) => void; onReturn: (v: number) => void }) {
  const { state } = useStore();
  const clean = state.copy === "received";
  const waiting = state.copy === "requested";
  const [value, setValue] = useState("");
  const n = Number(value.replace(/[^0-9.]/g, ""));
  const submit = () => {
    const v = value.trim() ? n : clean ? 0 : 25000;
    if (!(v > 0)) return;
    if (v === 25000) onConfirm(v);
    else onReturn(v);
  };
  useEffect(() => {
    const on = (e: Event) => {
      if (!canAct || waiting || (clean && !value.trim())) return;
      (e as CustomEvent<{ handled: boolean }>).detail.handled = true;
      submit();
    };
    window.addEventListener("jointly:accept-scan", on);
    return () => window.removeEventListener("jointly:accept-scan", on);
  });
  return (
    <div className="mt-4 rounded-lg border border-warn/40 bg-surface p-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-warn-ink">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {clean ? "The branch sent a clean copy of the 2023 letter. Check it again." : "A 2023 letter may change Khalifa's limit. The scan is unclear."}
      </p>
      <div className="mt-3 flex flex-wrap items-start gap-5">
        <figure className="w-[520px] max-w-full">
          {clean ? <CleanLetter /> : <ScanLens src="/scans/svs-amd-2023.png" alt="Scan of the 2023 amendment letter. The last digits of the amount are smudged." />}
          <figcaption className="mt-1 text-[11px] text-muted">{clean ? "2023 amendment letter · clean copy from the branch" : "2023 amendment letter · scan from SVS · click to zoom"}</figcaption>
        </figure>
        <div className="min-w-[220px] flex-1 space-y-3 text-sm">
          {waiting && (
            <p className="text-warn-ink">You read <span className="tnum font-medium">AED {fmt(state.disagreed ?? 0)}</span>, so the agent asked the branch for a clean copy. The case waits, and the agent&apos;s reading isn&apos;t used.</p>
          )}
          {!waiting && canAct && (
            <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <label htmlFor="scan-value" className="text-xs text-muted">
                {clean ? "The clean copy says Khalifa's limit is" : "The agent read"}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted">AED</span>
                <input id="scan-value" inputMode="numeric" autoComplete="off" placeholder={clean ? "" : "25,000"} value={value} onChange={(e) => setValue(e.target.value)} className="tnum h-9 w-32 rounded-lg border border-line bg-surface px-2.5 text-sm outline-none placeholder:text-muted focus:border-accent" />
              </div>
            </form>
          )}
          {!canAct && !waiting && (
            <div>
              <p className="text-xs text-muted">The agent read</p>
              <p className="tnum mt-0.5 font-medium">AED 25,000 <span className="text-xs font-normal text-warn-ink">not certain</span></p>
              <p className="mt-2 text-xs text-sub">Plan v1 keeps AED 10,000 until Sara confirms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Status = "approved" | "needs" | "changed" | "waiting";
const ring: Record<Status, string> = { approved: "border-ok bg-ok text-onaccent", needs: "border-warn", changed: "border-accent", waiting: "border-line" };
const statusLabel: Record<Status, string> = { approved: "Approved", needs: "Needs you", changed: "Changed", waiting: "Waiting" };

export function FailBanner({ n }: { n: number }) {
  return (
    <div role="alert" className="flex items-center gap-2 rounded-card border border-bad bg-bad-soft px-4 py-3 text-sm text-bad-ink">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {n} check{n === 1 ? "" : "s"} failed. Approval is blocked until {n === 1 ? "it passes" : "they pass"}.
      <a href="?tab=map" className="ml-auto font-medium underline underline-offset-2">See the failing test</a>
    </div>
  );
}

export function ReviewView() {
  const { state, dispatch, version, held, setTab } = useStore();
  const failing = policyChecks(version, held).filter((c) => !c.pass);
  const tour = { ...useTourTarget(0), ...useTourTarget(1) };
  const [expand, setExpand] = useState(false);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      if (!typing && !e.ctrlKey && !e.metaKey && ["j", "k"].includes(e.key.toLowerCase())) {
        const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-stage-card]"));
        const at = cards.findIndex((c) => c.contains(document.activeElement));
        const to = cards[Math.max(0, Math.min(cards.length - 1, at + (e.key.toLowerCase() === "j" ? 1 : -1)))];
        to?.focus();
        to?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!typing && e.key === "Enter" && el.dataset.stageCard !== undefined) {
        el.querySelector<HTMLElement>("input, button:not([disabled])")?.focus();
        return;
      }
      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey && !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) && !failing.length) {
        dispatch({ type: "signoff" });
        return;
      }
      if (e.key.toLowerCase() !== "a" || e.ctrlKey || e.metaKey || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (state.phase !== "in_review" && state.phase !== "re_review") return;
      const list = buildStages(version);
      const next = list.find((st, n) => !approvalValid(state.approvals[st.id], st) && list.slice(0, n).every((p) => approvalValid(state.approvals[p.id], p)));
      if (!next || (next.id === 3 && version === 1) || failing.length) return;
      dispatch({ type: "approve", stageId: next.id });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, version, dispatch, failing.length]);
  if (!hasEvent(state, "submit")) return <Empty icon={ShieldCheck} title="Nothing to review yet" body="The agent sends you all 4 stages at once, so you review in one sitting." />;
  const stages = buildStages(version);
  const v1 = buildStages(1);
  const reviewing = state.phase === "in_review" || state.phase === "re_review";
  const status: Status[] = stages.map((s, i) => {
    const ok = approvalValid(state.approvals[s.id], s);
    const prevOk = stages.slice(0, i).every((p) => approvalValid(state.approvals[p.id], p));
    const changed = version === 2 && diffStage(v1[i], s).length > 0;
    return ok ? "approved" : changed ? "changed" : reviewing && prevOk ? "needs" : "waiting";
  });
  const open = status.filter((x) => x !== "approved").length;
  const judgement = version === 1 && !approvalValid(state.approvals[3], stages[2]);
  const byPhase: Partial<Record<string, string>> = {
    executing: "Signed off. The agent is setting it up.",
    executed: "Set up and checked. Granting access is your call.",
    partially_live: "2 of 3 signatories are live. Rashid is waiting for his EID.",
    rashid_ready: "2 of 3 signatories are live. Rashid's EID is renewed.",
    live: "Creekside is live. All 3 signatories, 1h 54m from form to first login.",
  };
  const signedOff = ["executing", "executed", "partially_live", "rashid_ready", "live"].includes(state.phase);
  const chip = (i: number) => status[i] !== "approved" ? statusLabel[status[i]] : signedOff ? "Approved" : state.approvals[stages[i].id]?.by === "Rules" ? "Passed by rule" : "Confirmed by you";
  const headline = byPhase[state.phase] ?? (!open ? "All 4 stages pass. Sign off when ready." : judgement ? "1 thing needs your judgement" : `Nothing needs your judgement: ${open} stage${open === 1 ? "" : "s"} ready to approve`);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">{headline}</h2>
      {state.phase === "live" && !expand && (
        <Card className="flex flex-wrap items-center gap-5 p-5">
          <span className="flex">
            {(["mohammed", "khalifa", "rashid"] as const).map((id, n) => (
              <span key={id} className={n ? "-ml-2" : ""}><Avatar id={id} size={36} /></span>
            ))}
          </span>
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium">Mohammed, Khalifa and Rashid are live. <span className="tnum">1h 54m</span> from form to first login.</p>
            <p className="mt-0.5 text-sub">Sara made 2 decisions: confirmed the 2023 letter value, then signed off plan v2.</p>
          </div>
          <Button onClick={() => setTab("decisions")}>Open the decision record</Button>
          <Button variant="ghost" onClick={() => setExpand(true)}>Show evidence and stages</Button>
        </Card>
      )}
      {(state.phase !== "live" || expand) && (<>
      {failing.length > 0 && <FailBanner n={failing.length} />}
      <div {...tour}>
        <EvidenceGrid />
      </div>
      {reviewing && allApproved(state) && (
        <Card className="flex flex-wrap items-center gap-4 border-line-strong p-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {stages.filter((s) => state.approvals[s.id]?.by === "Rules").length} stages verified by rule, {stages.filter((s) => state.approvals[s.id] && state.approvals[s.id]!.by !== "Rules").length} by you. {failing.length ? `${failing.length} failing check${failing.length === 1 ? "" : "s"}.` : "All checks pass."}
            </p>
            <p className="mt-0.5 text-xs text-sub">2 decisions in this case: the letter value, then this sign-off.</p>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-4 gap-2">
        {stages.map((s, i) => (
          <a key={s.id} href={`#stage-${s.id}`} className="flex items-center gap-2.5 rounded-card border border-line bg-surface px-3 py-2.5 hover:border-line-strong">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2", ring[status[i]])}>
              {status[i] === "approved" && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{s.short}</span>
              <span className="block text-[11px] text-muted">{chip(i)}</span>
            </span>
          </a>
        ))}
      </div>
      {!open && (state.phase === "executing" || state.phase === "executed") && (
        <Card className="flex animate-enter items-center gap-4 p-5">
          <span className="flex">
            <Avatar id="mohammed" size={36} />
            <span className="ring-link -ml-2" style={{ "--ring-from": "10px" } as React.CSSProperties}>
              <Avatar id="khalifa" size={36} />
            </span>
          </span>
          <div>
            <p className="font-display text-lg">Approved. Nice one.</p>
            <p className="text-sm text-sub">Agent is setting this up in Digital Banking Admin. You&apos;ll be asked to grant access.</p>
          </div>
        </Card>
      )}
      <div className="flex justify-end">
        <Pill tone="neutral">Plan v{version}</Pill>
      </div>
      {stages.map((s, i) => {
        const approval = state.approvals[s.id];
        const valid = approvalValid(approval, s);
        const stale = !!approval && !valid;
        const prevOk = stages.slice(0, i).every((p) => approvalValid(state.approvals[p.id], p));
        const changes = version === 2 ? diffStage(v1[i], s) : [];
        const wasReturned = state.returned?.stageId === s.id;
        const canAct = reviewing && !valid && prevOk && !failing.length;
        const canReturn = canAct && version === 1 && s.id === 3;
        const cov = coverage(s.id, version);
        const readItems = s.items.filter((it) => it.sources.some(isAgentRead));
        const exactItems = s.items.filter((it) => !it.sources.some(isAgentRead));
        return (
          <Card key={s.id} id={`stage-${s.id}`} data-stage-card="" tabIndex={-1} className={cn("p-5 outline-none focus-visible:ring-2 focus-visible:ring-brand", canAct && "border-line-strong", valid && "bg-panel/30")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">Stage {s.id} of 4</p>
                <h3 className="mt-0.5 text-base font-semibold">{s.title}</h3>
                <div className="mt-1.5">
                  <Coverage {...cov} />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {valid ? (
                  <Pill tone="ok">
                    {approval!.by === "Rules" ? "Verified by rule" : state.returned && s.id < 3 ? "Approval kept" : signedOff ? "Approved" : "Confirmed by you"} · {approval!.by === "Rules" ? "exact copy" : approval!.by} {approval!.at}
                  </Pill>
                ) : changes.length ? (
                  <Pill tone="accent">Changed, review the diff</Pill>
                ) : wasReturned && version === 1 ? (
                  <Pill tone="warn">Returned</Pill>
                ) : canAct ? (
                  <Pill tone="warn">Waiting for you</Pill>
                ) : (
                  <Pill tone="neutral">{reviewing ? "Approve the stage above first" : "Waiting"}</Pill>
                )}
                {stale && <p className="text-[11px] text-muted">Earlier approval no longer matches</p>}
              </div>
            </div>

            {s.id === 2 && !valid ? (
              <div className="mt-4">
                <SigningMap part="people" />
              </div>
            ) : s.id === 3 && !valid ? (
              <div className="mt-4">
                <SigningMap compact />
              </div>
            ) : s.id === 4 && !valid ? (
              <div className="mt-4">
                <PaymentWorkflow diff={version === 2} />
              </div>
            ) : changes.length > 0 && !valid ? (
              <ul className="mt-4 divide-y divide-accent/20 rounded-lg border border-accent/30 bg-accent-soft/30">
                {changes.map((c) => (
                  <ClaimRow key={c.key} label={<Changed before={c.beforeLabel} after={c.afterLabel} />} value={<Changed before={c.before} after={c.after} />} sources={c.sources} />
                ))}
                <li className="px-3 py-2 text-xs text-muted">{s.items.length - changes.length} other line{s.items.length - changes.length === 1 ? "" : "s"} unchanged</li>
              </ul>
            ) : (
              !valid && (
                <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                  {readItems.map((it) => (
                    <ClaimRow key={it.key} label={it.label} value={it.value} sources={it.sources} />
                  ))}
                  {exactItems.length > 0 && (
                    <li>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-sm">
                          <ChevronRight className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-90" />
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ok text-onaccent">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          <span className="font-medium">{exactItems.length} line{exactItems.length === 1 ? "" : "s"} copied exactly from Finacle and Digital Banking</span>
                          
                        </summary>
                        <ul className="divide-y divide-line border-t border-line">
                          {exactItems.map((it) => (
                            <ClaimRow key={it.key} label={it.label} value={it.value} sources={it.sources} />
                          ))}
                        </ul>
                      </details>
                    </li>
                  )}
                </ul>
              )
            )}

            {s.id === 3 && !valid && (
              version === 1 ? (
                <ScanCheck key={state.copy ?? "none"} canAct={canAct && !returning} onConfirm={(v) => dispatch({ type: "confirm", value: v })} onReturn={(v) => dispatch({ type: "disagree", value: v })} />
              ) : (
                <>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-ok-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> 2023 letter checked by you: AED 25,000
                  </p>
                  <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-line bg-panel/60 px-3 py-2.5">
                    <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Make this fix stick?</p>
                      <p className="mt-0.5 text-xs text-sub">The agent proposes: when a scan is unclear, ask the branch for a clean copy before building the plan. A supervisor has to approve it.</p>
                    </div>
                    {state.log.some((e) => e.id === "lesson") ? (
                      <Pill tone="neutral">Sent to supervisor</Pill>
                    ) : (
                      <Button size="sm" onClick={() => dispatch({ type: "lesson" })}>
                        Send to supervisor
                      </Button>
                    )}
                  </div>
                </>
              )
            )}

            {wasReturned && <ReturnThread />}

                        {canAct && !returning && (
              <div className="mt-3 flex gap-2">
                {!(s.id === 3 && version === 1) && (
                  <Button onClick={() => dispatch({ type: "approve", stageId: s.id })}>
                    <Check className="h-3.5 w-3.5" /> Approve stage {s.id} · {s.items.length} line{s.items.length === 1 ? "" : "s"}
                    <kbd className="ml-1 rounded border border-onaccent/40 px-1 text-[10px] font-normal opacity-80">A</kbd>
                  </Button>
                )}
                                {canReturn && (
                  <Button variant="ghost" onClick={() => setReturning(true)}>
                    <Undo2 className="h-3.5 w-3.5" /> Return to agent
                  </Button>
                )}
              </div>
            )}
            {canReturn && returning && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs text-muted" htmlFor="return-note">
                  Note for the agent
                </label>
                <textarea id="return-note" placeholder="Tell the agent what to check" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full rounded-lg border border-line p-2.5 text-sm outline-none focus:border-accent" />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    disabled={!note.trim()}
                    onClick={() => {
                      dispatch({ type: "return", note: note.trim() });
                      setReturning(false);
                    }}
                  >
                    Return stage 3
                  </Button>
                  <Button variant="ghost" onClick={() => setReturning(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
      </>)}
    </div>
  );
}
