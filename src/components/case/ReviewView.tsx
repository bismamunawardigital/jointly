"use client";

import { EvidenceGrid } from "./EvidenceGrid";
import { PaymentWorkflow } from "./PaymentWorkflow";
import { SigningMap } from "./SigningMap";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, ChevronRight, Repeat, ShieldCheck } from "lucide-react";
import { EvidenceKey, isAgentRead } from "@/data/seed";
import { approvalValid, buildStages, diffStage, fmt, policyChecks } from "@/lib/rules";
import { allApproved, hasEvent, useStore, letterLabel } from "@/lib/store";
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
    <span className={cn("inline-flex items-center gap-1.5 text-xs", full ? "text-ok-ink" : "text-warn-ink")} title={`${label}: ${n} of ${of}`}>
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
    <div className="rounded-lg border border-line bg-surface p-5 text-[13px] leading-relaxed text-ink" style={{ fontFamily: "Georgia, serif" }}>
      <p className="font-semibold">Subject: Amendment to signing mandate</p>
      <p className="mt-2">The single-signing limit of Khalifa Saeed Al Falasi is revised to AED 25,000 with effect from 01-Mar-2023. All other terms of the 2019 mandate remain unchanged.</p>
    </div>
  );
}

function ScanCheck({ canAct, onConfirm }: { canAct: boolean; onConfirm: (v: number) => void }) {
  const { state, dispatch } = useStore();
  const clean = state.copy === "received";
  const waiting = state.copy === "requested";
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<number | null>(null);
  const n = Number(value.replace(/[^0-9.]/g, ""));
  const match = checked === 25000;
  const check = (x: number | null) => {
    setChecked(x);
    window.dispatchEvent(new CustomEvent("jointly:scan", { detail: x }));
  };
  return (
    <div className="mt-4 rounded-lg border border-warn/40 bg-surface p-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-warn-ink">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {clean ? "The branch sent a clean copy of the 2023 letter." : "A 2023 letter may change Khalifa's limit. The scan is unclear."}
      </p>
      <div className="mt-3 flex flex-wrap items-start gap-5">
        <figure className="w-[520px] max-w-full">
          {clean ? <CleanLetter /> : <ScanLens src="/scans/svs-amd-2023.png" alt="Scan of the 2023 amendment letter. The last digits of the amount are smudged." />}
          <figcaption className="mt-1 text-xs text-muted">{clean ? "Clean copy from the branch" : "2023 amendment letter · scan from SVS · click to zoom"}</figcaption>
        </figure>
        <div className="min-w-[220px] flex-1 space-y-3 text-sm">
          {waiting ? (
            <div className="rounded-lg border border-line bg-panel p-3">
              <p className="font-medium">Waiting for a clean copy · requested 10:07</p>
              <p className="mt-1 text-xs text-sub">You asked the branch for a clean copy at 10:07, and the case is waiting for it.</p>
            </div>
          ) : (
            <>
              {canAct && checked === null && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!value.trim() || n === 25000) onConfirm(25000);
                    else if (n > 0) check(n);
                  }}
                >
                  <label htmlFor="scan-value" className="text-xs text-muted">
                    {clean ? "The clean copy says Khalifa's limit is" : "The agent read"}
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted">AED</span>
                    <input id="scan-value" inputMode="numeric" autoComplete="off" placeholder={clean ? "" : "25,000"} value={value} onChange={(e) => setValue(e.target.value)} className="tnum h-9 w-32 rounded-lg border border-line bg-surface px-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <p className="mt-1 text-xs text-sub">{clean ? "Type what you read on the clean copy, and press Enter." : "Check it against the scan. Press Enter if it matches, or type what you read."}</p>
                  <Button type="submit" className="mt-2" disabled={clean && !(n > 0)}>
                    {!value.trim() && !clean ? "Confirm AED 25,000" : "Check"}
                  </Button>
                </form>
              )}
              {(checked !== null || !canAct) && (
                <div>
                  <p className="text-xs text-muted">The agent read</p>
                  <p className="tnum mt-0.5 font-medium">
                    AED 25,000 {!clean && <span className="text-xs font-normal text-warn-ink">not certain</span>}
                  </p>
                </div>
              )}
              {canAct && checked !== null && (
                <div className={cn("rounded-lg border p-3", match ? "border-ok/40 bg-ok-soft" : "border-warn/40 bg-surface")}>
                  {match ? (
                    <p className="flex items-center gap-1.5 font-medium text-ok-ink">
                      <Check className="h-4 w-4" /> You and the agent both read 25,000
                    </p>
                  ) : (
                    <p className="text-warn-ink">
                      You read <span className="tnum font-medium">AED {fmt(checked)}</span>, but the agent read AED 25,000 and wasn&apos;t sure.
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {match ? (
                      <Button data-confirm-scan onClick={() => onConfirm(checked)}>
                        Confirm and update the plan
                      </Button>
                    ) : (
                      <>
                        <Button data-ask-copy onClick={() => dispatch({ type: "askCopy", value: checked })}>
                          Ask the branch for a clean copy
                        </Button>
                        <Button data-use-mine onClick={() => dispatch({ type: "useMine", value: checked })}>
                          Use my value (AED {fmt(checked)})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setValue("");
                        check(null);
                      }}
                    >
                      Change my reading
                    </Button>
                  </div>
                </div>
              )}
              {!canAct && <p className="text-xs text-sub">Plan v1 keeps AED 10,000 until Sara confirms.</p>}
            </>
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

const rashidLive = (s: { log: { id: string }[] }) => s.log.some((e) => e.id === "release-rashid");

export function ReviewView() {
  const { state, dispatch, version, held, setTab } = useStore();
  const failing = policyChecks(version, held).filter((c) => !c.pass);
  const tour = { ...useTourTarget(0), ...useTourTarget(1) };
  const [expand, setExpand] = useState(false);
  useEffect(() => setExpand(!!sessionStorage.getItem("jointly-details")), []);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    const on = () => setReturning(true);
    window.addEventListener("jointly:return", on);
    return () => window.removeEventListener("jointly:return", on);
  }, []);
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
    executing: "You've signed off, and the agent is setting it up now.",
    revising: "The agent is updating the plan with your value.",
    executed: "Everything is set up, and you decide who goes live.",
    releasing: "Everything is set up, and you decide who goes live.",
    partially_live: "Mohammed and Khalifa are live, and Rashid is waiting for his new ID.",
    renewing: "Mohammed and Khalifa are live, and Rashid is waiting for his new ID.",
    rashid_ready: "Rashid's new ID has cleared, so you can release him now.",
    releasing_rashid: "Rashid's new ID has cleared, so you can release him now.",
    live: "Creekside is live, with all 3 partners online 1 hour 54 minutes after the form arrived.",
  };
  const signedOff = ["executing", "executed", "partially_live", "rashid_ready", "live"].includes(state.phase);
  const chip = (i: number) => status[i] !== "approved" ? statusLabel[status[i]] : signedOff ? "Approved" : state.approvals[stages[i].id]?.by === "Rules" ? "Passed by rule" : "Confirmed by you";
  const headline = byPhase[state.phase] ?? (!open || allApproved(state) ? "Everything checks out, so you can sign off when you're ready." : judgement ? "One value on the letter needs your check." : "Everything checks out, so you can sign off when you're ready.");
  const needsLetter = reviewing && !approvalValid(state.approvals[3], stages[2]) && state.confirmed === undefined;
  const toggle = () => {
    const v = !expand;
    setExpand(v);
    sessionStorage.setItem("jointly-details", v ? "1" : "");
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">{headline}</h2>
      {false && (
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
      {!expand && needsLetter && <ScanCheck key={state.copy ?? "none"} canAct={!failing.length} onConfirm={(v) => dispatch({ type: "confirm", value: v })} />}
      {!expand && reviewing && allApproved(state) && (
        <Card className="p-4 text-sm">
          <p className="font-medium">When you sign off, Mohammed and Khalifa go live today, and Rashid&apos;s user is created but stays switched off until his ID is renewed.</p>
          <p className="mt-1 text-sub">The agent makes 5 changes in Digital Banking Admin and then reads them back, and no payments are made. You can still change anything before you sign off.</p>
        </Card>
      )}
      <p className="flex items-center gap-3 whitespace-nowrap text-sm text-sub">
        The agent matched 17 records with the bank&apos;s systems, Rashid is {rashidLive(state) ? "live" : "on hold"}, and {stages.filter((x) => state.approvals[x.id]?.by === "Rules").length} of the 4 stages have passed by rule.
        <button type="button" onClick={toggle} className="font-medium text-accent-ink hover:underline">{expand ? "Hide details" : "Show details"}</button>
      </p>
      {expand && (<>
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
          <Button disabled={failing.length > 0} onClick={() => dispatch({ type: "signoff" })}>
            Sign off plan v{version} · 4 stages <kbd className="ml-1 rounded border border-current/30 px-1 text-xs">S</kbd>
          </Button>
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
              <span className="block text-xs text-muted">{chip(i)}</span>
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
            <p className="text-sm text-sub">Agent is setting this up in Digital Banking Admin. You&apos;ll be asked to release access.</p>
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
                    {approval!.by === "Rules" ? "Verified by rule" : state.returned && s.id < 3 ? "Approval kept" : s.id === 3 ? letterLabel(state) : signedOff ? "Approved" : "Confirmed by you"} · {approval!.by === "Rules" ? "exact copy" : approval!.by} {approval!.at}
                  </Pill>
                ) : s.id === 3 && state.copy === "requested" ? (
                  <Pill tone="neutral">Waiting for a clean copy · requested 10:07</Pill>
                ) : changes.length ? (
                  <Pill tone="accent">Changed, review the diff</Pill>
                ) : wasReturned && version === 1 ? (
                  <Pill tone="warn">Returned</Pill>
                ) : canAct ? (
                  <Pill tone="warn">Waiting for you</Pill>
                ) : (
                  <Pill tone="neutral">{reviewing ? "Approve the stage above first" : "Waiting"}</Pill>
                )}
                {stale && <p className="text-xs text-muted">Earlier approval no longer matches</p>}
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

            {s.id === 3 && !valid && state.confirmed === undefined && (
              <ScanCheck key={state.copy ?? "none"} canAct={canAct && !returning} onConfirm={(v) => dispatch({ type: "confirm", value: v })} />
            )}
            {s.id === 3 && state.confirmed !== undefined && (
              <>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ok-ink">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} /> 2023 letter: AED {fmt(state.confirmed)} · {letterLabel(state)}
                </p>
                {state.copy === "received" && !state.mine && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-line bg-panel/60 px-3 py-2.5">
                    <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Make this fix stick?</p>
                      <p className="mt-0.5 text-xs text-sub">This case only moved once the branch sent a clean copy. The agent proposes asking the branch for a clean copy whenever a scan is unclear, before it builds the plan, and a supervisor has to approve that change.</p>
                    </div>
                    {state.log.some((e) => e.id === "lesson") ? (
                      <Pill tone="neutral">Sent to supervisor</Pill>
                    ) : (
                      <Button size="sm" onClick={() => dispatch({ type: "lesson" })}>
                        Send to supervisor
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}

            {wasReturned && (
              <p className="mt-3 text-xs text-sub">
                <span className="font-medium text-ink">Sara&apos;s note:</span> {state.returned!.note}
              </p>
            )}

                        {canAct && !returning && (
              <div className="mt-3 flex gap-2">
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
