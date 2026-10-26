"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileText, Info } from "lucide-react";
import { EvidenceKey, PersonId, evidence, personById } from "@/data/seed";
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

export function SourceChip({ k, className }: { k: EvidenceKey; className?: string }) {
  const { openEvidence } = useStore();
  return (
    <button
      type="button"
      onClick={() => openEvidence(k)}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md border border-line bg-white px-1.5 py-0.5 font-mono text-[11px] text-sub transition-colors duration-150 ease-out hover:border-accent/40 hover:text-accent-ink active:scale-[0.97]",
        className,
      )}
      title={`${evidence[k].title} · ${evidence[k].system}`}
    >
      <FileText className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{sourceLabel(k)}</span>
    </button>
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
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-warn/50 bg-white px-1.5 py-0.5 text-[11px] font-medium text-warn-ink">
      <Info className="h-3 w-3" aria-hidden />
      Assumption: {children}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
const btn: Record<BtnVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-ink disabled:bg-accent/40",
  secondary: "border border-line bg-white text-ink hover:bg-panel disabled:text-muted",
  ghost: "text-sub hover:bg-panel hover:text-ink disabled:text-muted",
  danger: "border border-bad/30 bg-white text-bad-ink hover:bg-bad-soft disabled:opacity-50",
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
    <div {...rest} className={cn("rounded-xl border border-line bg-white", className)}>
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
