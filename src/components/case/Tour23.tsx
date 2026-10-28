"use client";

import Link from "next/link";
import { Check, CreditCard, MessageSquare, ScanFace, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";

export { PORTFOLIO_URL } from "@/content/portfolio";
import { PORTFOLIO_URL } from "@/content/portfolio";

function Doc({ blur, n = 1 }: { blur?: boolean; n?: number }) {
  return (
    <span className="flex -space-x-3">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={cn("flex h-10 w-8 flex-col gap-1 rounded-sm border border-line bg-surface p-1 shadow-sm", blur && "blur-[1px]")}>
          <span className="h-0.5 w-4 rounded bg-line-strong" />
          <span className="h-0.5 w-5 rounded bg-line" />
          <span className="h-0.5 w-3 rounded bg-line" />
          <span className="h-0.5 w-5 rounded bg-line" />
        </span>
      ))}
    </span>
  );
}
function Sig() {
  return (
    <svg viewBox="0 0 64 28" className="h-10 w-16 rounded-sm border border-line bg-surface p-1 text-ink" aria-hidden>
      <path d="M4 20c6-14 10-14 9-3s6-12 10-6 3 9 8 2 6-6 8 0 5-5 9-4 6 3 8 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function Field({ v }: { v: string }) {
  return <span className="rounded-sm border border-line bg-surface px-1.5 py-1 font-mono text-[10px] text-ink">{v}</span>;
}
function Dedup() {
  return (
    <span className="flex flex-col gap-1">
      <span className="flex items-center gap-1"><Field v="RCIF 100587" /><Check className="h-3 w-3 text-ok" strokeWidth={3} aria-hidden /></span>
      <span className="flex items-center gap-1 opacity-60"><span className="line-through decoration-muted"><Field v="RCIF 087316" /></span><span className="text-[10px] text-muted">to Data Quality</span></span>
    </span>
  );
}
function Ids() {
  return (
    <span className="flex gap-1">
      {["MA", "KF", "RS"].map((x) => (
        <span key={x} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sources/emirates-id-sm.png" alt="" className={cn("h-7 w-auto rounded-[3px]", x === "RS" ? "ring-2 ring-warn" : "ring-1 ring-line")} />
          <span className={cn("absolute -bottom-1 -right-1 rounded-full px-1 text-[8px] font-semibold leading-3", x === "RS" ? "bg-warn-soft text-warn-ink" : "bg-surface text-ink ring-1 ring-line")}>{x}</span>
        </span>
      ))}
    </span>
  );
}

const sources: { t: string; at: number; v: React.ReactNode; flag?: "Expired" | "Unclear" }[] = [
  { t: "3 signed forms", at: 1, v: <Doc n={3} /> },
  { t: "Trade licence", at: 2, v: <Doc /> },
  { t: "Finacle, 3 people", at: 3, v: <Field v="RCIF 100234 · 100587 · 100912" /> },
  { t: "Mode of operation", at: 4, v: <Field v="JOINTLY - ANY TWO" /> },
  { t: "Memorandum of Association", at: 5, v: <Doc /> },
  { t: "SVS signing mandate", at: 7, v: <Doc /> },
  { t: "DEDUP, every branch", at: 8, v: <Dedup /> },
  { t: "Signatures on file", at: 9, v: <Sig /> },
  { t: "3 Emirates ID checks", at: 10, v: <Ids />, flag: "Expired" },
  { t: "2023 letter", at: 12, v: <Doc blur />, flag: "Unclear" },
];

export function SourceCards({ read }: { read: number }) {
  return (
    <div aria-label="Sources the agent is reading" className="grid max-w-3xl grid-cols-3 gap-3 pt-2">
      {sources.filter((s) => read >= s.at).map((s) => (
        <div key={s.t} className={cn("flex animate-enter flex-col gap-3 rounded-xl border bg-surface p-3", s.flag ? "border-warn/50" : "border-line")}>
          <div className="flex h-10 items-center">{s.v}</div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-ink">{s.t}</span>
            {s.flag ? (
              <span className="rounded-full bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn-ink">{s.flag}</span>
            ) : (
              <Check className="h-4 w-4 shrink-0 text-ok" aria-label="Checked" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SourceSummary() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sub">
      <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-ok" /> 8 sources checked</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warn" /> Rashid&apos;s ID expired</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warn" /> 1 number on the 2023 letter</span>
    </p>
  );
}

export const timeSkip = (label: string) => window.dispatchEvent(new CustomEvent("jointly:skip", { detail: label }));

export function TimeSkip() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setLabel((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setLabel(null), 3000);
    };
    window.addEventListener("jointly:skip", on);
    return () => { window.removeEventListener("jointly:skip", on); clearTimeout(t); };
  }, []);
  if (!label) return null;
  return (
    <div role="status" className="pointer-events-none fixed left-1/2 top-6 z-[70] -translate-x-1/2 animate-enter rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-lg">
      {label}
    </div>
  );
}

const screens = [
  "Khalifa receives an SMS with a secure link.",
  "He scans his Emirates ID and his face to prove it's him.",
  "He sets his own password, which the bank never sees.",
  "He's in, and Creekside's account is ready for him.",
];

export function CustomerPhone({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => (i < screens.length - 1 ? setI(i + 1) : onClose()), i < screens.length - 1 ? 2000 : 3000);
    return () => clearTimeout(t);
  }, [i, onClose]);
  return (
    <div role="dialog" aria-label="What the customer sees" className="phone-in fixed bottom-20 right-8 z-[55] w-[280px]">
      <div className="rounded-[36px] border-[6px] border-ink bg-surface p-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-line" />
        <div className="flex h-[250px] flex-col justify-center gap-3 text-sm">
          {i === 0 && (
            <div className="rounded-2xl bg-panel p-3">
              <MessageSquare className="mb-2 h-4 w-4 text-sub" />
              Your bank: set up online banking for Creekside General Trading. Secure link: bank.ae/s/7714
            </div>
          )}
          {i === 1 && (
            <div className="grid place-items-center gap-3 text-center">
              <ScanFace className="h-16 w-16 text-accent-ink" />
              <span>Emirates ID ending 7714</span>
              <Check className="h-5 w-5 text-ok" />
            </div>
          )}
          {i === 2 && (
            <div className="space-y-3">
              <KeyRound className="h-5 w-5 text-sub" />
              <div className="h-10 rounded-xl border border-line px-3 leading-10 tracking-widest">••••••••••</div>
              <p className="text-xs text-sub">Only you know this password.</p>
            </div>
          )}
          {i === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-sub">Creekside General Trading LLC</p>
              <div className="rounded-2xl bg-panel p-3">
                <CreditCard className="mb-2 h-4 w-4 text-sub" />
                <p className="text-xs text-sub">Current account</p>
                <p className="font-medium">AE07 •••• 0123</p>
              </div>
              <div className="rounded-xl bg-accent py-2 text-center text-sm font-medium text-onaccent">Approve a payment</div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-3 text-sm shadow-lg">
        <p className="text-ink">{screens[i]}</p>
        <button type="button" onClick={onClose} className="shrink-0 text-sub underline underline-offset-2 hover:text-ink">Skip</button>
      </div>
    </div>
  );
}

const rows = [
  ["Who decides", "The agent prepares the work, and rules and people make the decisions."],
  ["Evidence", "Every value shows where it came from and which rule checked it."],
  ["Failure", "A blurry scan, an expired ID and a system timeout each have a safe path."],
  ["Audit", "Every step ends up in a record an auditor can read."],
];

export function Finale({ onDisagree }: { onDisagree: () => void }) {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <h2 className="font-display text-3xl leading-tight text-ink">Creekside is live.</h2>
      <p className="mt-3 text-lg text-sub">
        All 3 partners have online banking 1 hour 54 minutes after their forms arrived. A person made 2 decisions, and the agent made none.
      </p>
      <h3 className="mt-10 text-sm font-semibold text-sub">What this shows</h3>
      <dl className="mt-3 divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-4 text-base">
            <dt className="font-medium text-ink">{k}</dt>
            <dd className="text-sub">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href="/" className="inline-flex h-9 items-center rounded-xl bg-accent px-3.5 text-sm font-medium text-onaccent shadow-sm hover:bg-accent-hover">
          Back to the case study
        </Link>
        <Button onClick={onDisagree}>Try disagreeing with the agent</Button>
        {PORTFOLIO_URL && (
          <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="ml-2 text-sm text-sub underline underline-offset-2 hover:text-ink">
            Bisma&apos;s portfolio
          </a>
        )}
      </div>
    </div>
  );
}

export function AutoplayControls({ paused, onToggle, onStop }: { paused: boolean; onToggle: () => void; onStop: () => void }) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", paused ? "bg-muted" : "animate-pulse bg-accent")} />
      <Button size="sm" variant="ghost" onClick={onToggle}>{paused ? "Play" : "Pause"}</Button>
      <Button size="sm" onClick={onStop}>Let me try</Button>
    </span>
  );
}

