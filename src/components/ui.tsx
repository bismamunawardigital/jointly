"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Check, Eye, FileText, Info } from "lucide-react";
import { EvidenceKey, PersonId, evidence, isAgentRead, personById } from "@/data/seed";
import { useStore } from "@/lib/store";

export const cn = (...a: ClassValue[]) => twMerge(clsx(a));

export type Tone = "ok" | "warn" | "bad" | "neutral" | "accent";

const tones: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok-ink",
  warn: "bg-warn-soft text-warn-ink",
  bad: "bg-bad-soft text-bad-ink",
  neutral: "bg-panel text-sub",
  accent: "bg-accent-soft text-accent-ink",
};
const dots: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  neutral: "bg-muted",
  accent: "bg-accent",
};

export function Pill({ tone = "neutral", children, className, dot = true }: { tone?: Tone; children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}

const systemShort: Record<string, string> = {
  "Document store": "Form",
  "EFR service": "EFR",
  Finacle: "Finacle",
  SVS: "SVS",
  "Digital Banking Admin": "Admin",
};

export function sourceLabel(k: EvidenceKey) {
  const e = evidence[k];
  const sys = systemShort[e.system] ?? e.system;
  const clause = e.title.match(/clause (\d)/)?.[1];
  if (clause) return `${sys} ${e.ref.replace("SVS-", "")} cl.${clause}`;
  return `${sys} ${e.ref.replace("SVS-", "")}`;
}

export function quoteOf(k: EvidenceKey) {
  const e = evidence[k];
  if (!e.highlight || !e.body.includes(e.highlight)) return { pre: "", hit: e.body, post: "" };
  const [a, b] = e.body.split(e.highlight);
  const pw = a.trim().split(" ").filter(Boolean);
  const qw = b.trim().split(" ").filter(Boolean);
  return {
    pre: (pw.length > 6 ? "… " : "") + pw.slice(-6).join(" "),
    hit: e.highlight,
    post: qw.slice(0, 6).join(" ") + (qw.length > 6 ? " …" : ""),
  };
}

export function Quote({ k, className }: { k: EvidenceKey; className?: string }) {
  const q = quoteOf(k);
  return (
    <span className={cn("text-[13px] leading-relaxed text-sub", className)}>
      &ldquo;{q.pre && `${q.pre} `}
      <mark className="rounded bg-accent-soft px-0.5 font-medium text-accent-ink">{q.hit}</mark>
      {q.post && (/^[.,;:]/.test(q.post) ? q.post : ` ${q.post}`)}&rdquo;
    </span>
  );
}

export function BasisTag({ keys }: { keys: EvidenceKey[] }) {
  const read = keys.some(isAgentRead);
  return read ? (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-warn-soft px-1.5 py-0.5 text-[11px] font-medium text-warn-ink" title="The agent read this from a document. Check it against the quote.">
      <Eye className="h-3 w-3" aria-hidden /> Agent read this
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-ok-soft px-1.5 py-0.5 text-[11px] font-medium text-ok-ink" title="Copied from a system record. No interpretation.">
      <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> Exact match
    </span>
  );
}

export function Proof({ k }: { k: EvidenceKey }) {
  return (
    <div className="rounded-lg border border-line bg-panel/60 px-3 py-2">
      <Quote k={k} className="block" />
      <SourceChip k={k} className="mt-1.5" />
    </div>
  );
}

export function SourceChip({ k, className }: { k: EvidenceKey; className?: string }) {
  const { openEvidence } = useStore();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const e = evidence[k];
  const show = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos({ x: Math.min(r.left, window.innerWidth - 300), y: r.bottom + 6 });
  };
  return (
    <span className={cn("inline-flex max-w-full", className)}>
      <button
        type="button"
        onClick={() => openEvidence(k)}
        onMouseEnter={(ev) => show(ev.currentTarget)}
        onMouseLeave={() => setPos(null)}
        onFocus={(ev) => show(ev.currentTarget)}
        onBlur={() => setPos(null)}
        aria-label={`${e.title}, ${e.system}. Open source`}
        className="inline-flex max-w-full items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-sub transition-colors duration-150 ease-out hover:border-accent/40 hover:text-accent-ink active:scale-[0.97]"
      >
        <FileText className="h-3 w-3 shrink-0" aria-hidden />
        <span className="truncate">{sourceLabel(k)}</span>
      </button>
      {pos &&
        createPortal(
          <span role="tooltip" className="pointer-events-none fixed z-[60] block w-72 animate-enter rounded-lg border border-line bg-surface p-3 text-left shadow-lg" style={{ left: pos.x, top: pos.y }}>
            <span className="flex items-start justify-between gap-2">
              <span className="text-[11px] text-muted">
                {e.system} · {e.title}
              </span>
              <BasisTag keys={[k]} />
            </span>
            <Quote k={k} className="mt-2 block" />
          </span>,
          document.body,
        )}
    </span>
  );
}

export function Sources({ keys }: { keys?: EvidenceKey[] }) {
  if (!keys?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {keys.map((k) => (
        <SourceChip key={k} k={k} />
      ))}
    </div>
  );
}

export function AssumptionChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-warn/50 bg-surface px-1.5 py-0.5 text-[11px] font-medium text-warn-ink">
      <Info className="h-3 w-3" aria-hidden />
      Assumption: {children}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
const btn: Record<BtnVariant, string> = {
  primary: "bg-accent text-onaccent hover:bg-accent-hover disabled:bg-accent/40",
  secondary: "border border-line bg-surface text-ink hover:bg-panel disabled:text-muted",
  ghost: "text-sub hover:bg-panel hover:text-ink disabled:text-muted",
  danger: "border border-bad/30 bg-surface text-bad-ink hover:bg-bad-soft disabled:opacity-50",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100",
        size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
        btn[variant],
        className,
      )}
    />
  );
}

export function Avatar({ id, size = 28, held = false }: { id: PersonId; size?: number; held?: boolean }) {
  const p = personById(id);
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-ink", held && "opacity-50 grayscale")}
      style={{ width: size, height: size, background: p.tint }}
      title={p.name}
    >
      {p.initials}
    </span>
  );
}

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cn("rounded-xl border border-line bg-surface", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-ink">{children}</h2>
      {aside}
    </div>
  );
}

export function Empty({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-14 text-center">
      <Icon className="mb-3 h-5 w-5 text-muted" />
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
    </div>
  );
}
