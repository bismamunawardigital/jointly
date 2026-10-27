"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, Check, ChevronRight, FileText, ListChecks, Radio, ShieldCheck, UserCheck, Users } from "lucide-react";
import { StepId, eventById } from "@/lib/script";
import { policyChecks } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { EvidenceKey, PersonId, evidence } from "@/data/seed";
import { AgentMark, Avatar, Sources, cn } from "@/components/ui";

type Tone = "ok" | "warn" | "wait";
interface Line {
  tone: Tone;
  lead: string;
  text: string;
  who: "agent" | "rules" | "sara";
  people?: PersonId[];
  docs?: EvidenceKey[];
}
interface Checkpoint {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: StepId[];
  done: string;
}

const checkpoints: Checkpoint[] = [
  { id: "forms", label: "Forms read", icon: FileText, steps: ["intake"], done: "intake-forms" },
  { id: "people", label: "People confirmed", icon: Users, steps: ["identity"], done: "id-digital" },
  { id: "mandate", label: "Mandate understood", icon: BookOpen, steps: ["mandate"], done: "mandate-conflict" },
  { id: "plan", label: "Plan built & tested", icon: ListChecks, steps: ["plan", "policy"], done: "policy-check" },
  { id: "review", label: "Your review", icon: UserCheck, steps: ["review", "execute"], done: "ex-readback" },
  { id: "live", label: "Live", icon: Radio, steps: ["release"], done: "ren-login" },
];

export function ProgressView() {
  const { state, held, version } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [tech, setTech] = useState<Record<string, boolean>>({});
  const [refs, setRefs] = useState(false);
  const has = (id: string) => hasEvent(state, id);
  const rashidHeld = held.includes("rashid");
  const partLive = has("rel-khalifa-login");
  const checks = policyChecks(version, held);
  const passed = checks.filter((c) => c.pass).length;

  const lines: Record<string, Line[]> = {
    forms: has("intake-forms") ? [{ tone: "ok", lead: "Forms read", text: "the access request and 3 signed forms.", who: "agent", docs: ["form-mohammed", "form-khalifa", "form-rashid"] as EvidenceKey[] }] : [],
    people: [
      ...(has("kyc-check")
        ? [has("ren-kyc")
            ? { tone: "ok" as Tone, lead: "Rashid renewed", text: "his Emirates ID is valid again.", who: "agent" as const, people: ["rashid"] as PersonId[] }
            : { tone: "warn" as Tone, lead: "Rashid is on hold", text: "his Emirates ID expired 14 Aug. We asked him to renew. The others continue.", who: "agent" as const, people: ["rashid"] as PersonId[] }]
        : []),
      ...(has("id-digital") ? [{ tone: "ok" as Tone, lead: "People confirmed", text: "matched by Emirates ID, not by name. Mohammed already has a login, so we reuse it.", who: "agent" as const, people: ["mohammed", "khalifa", "rashid"] as PersonId[] }] : []),
    ],
    mandate: [
      ...(has("mandate-conflict") ? [{ tone: "ok" as Tone, lead: "Mandate understood", text: "the SVS mandate is more detailed than Finacle, so we used SVS.", who: "agent" as const, docs: ["svs-man"] as EvidenceKey[] }] : []),
      ...(has("mandate-letter")
        ? [has("rev-amendment")
            ? { tone: "ok" as Tone, lead: "2023 letter confirmed", text: "Sara checked the scan. Khalifa can sign alone up to AED 25,000.", who: "sara" as const, people: ["khalifa"] as PersonId[], docs: ["svs-amd"] as EvidenceKey[] }
            : { tone: "warn" as Tone, lead: "A 2023 letter is unclear", text: "it may raise Khalifa's limit to AED 25,000. Sara checks the scan.", who: "agent" as const, people: ["khalifa"] as PersonId[], docs: ["svs-amd"] as EvidenceKey[] }]
        : []),
    ],
    plan: has("policy-check") ? [{ tone: "ok", lead: "Plan built & tested", text: `${passed} of ${checks.length} checks passed on plan v${version}.`, who: "rules" }] : [],
    review: has("ex-readback")
      ? [{ tone: "ok", lead: "Approved and set up", text: "Sara approved all 4 stages. The setup was checked against the plan.", who: "rules" }]
      : has("submit")
        ? [{ tone: "wait", lead: "Your review", text: `plan v${version} is waiting for you.`, who: "sara" }]
        : [],
    live: has("ren-login")
      ? [{ tone: "ok", lead: "All 3 live", text: "everyone can sign today.", who: "agent", people: ["mohammed", "khalifa", "rashid"] }]
      : partLive
        ? [{ tone: "ok", lead: "2 of 3 live", text: rashidHeld ? "Mohammed and Khalifa can sign. Rashid joins after his EID." : "Mohammed and Khalifa can sign. Rashid is next.", who: "agent", people: ["mohammed", "khalifa"] }]
        : has("ex-readback")
          ? [{ tone: "wait", lead: "Granting access", text: "is Sara's call.", who: "sara" }]
          : [],
  };

  const ran = state.log.filter((e) => e.kind === "agent").map((e) => eventById(e.id));
  const spans = new Map<string, number[]>();
  ran.forEach((ev) => spans.set(ev.group, [...(spans.get(ev.group) ?? []), toMin(ev.time)]));
  const mins = Array.from(spans.values()).reduce((n, t) => n + Math.max(...t) - Math.min(...t) + 1, 0);
  const read = Array.from(new Set(ran.flatMap((ev) => ev.evidence ?? []))).filter((k) => evidence[k]);

  const reached = checkpoints.map((c) => has(c.done));
  const activeIdx = state.phase === "new" ? -1 : reached.findIndex((r) => !r);
  const headline = state.phase === "live" ? "All 3 live" : partLive ? "2 of 3 live" : ["in_review", "re_review"].includes(state.phase) ? "Plan ready for your review" : state.phase === "executed" ? "Set up. Granting access is your call" : "Setting up Creekside General Trading";
  const working = state.queue.length && !state.paused ? eventById(state.queue[0]).step : null;

  return (
    <div className="max-w-4xl">
      <h2 className="font-display text-2xl">{headline}</h2>
      {mins > 0 && (
        <div className="mt-2 text-sm text-muted">
          <button type="button" onClick={() => setRefs((r) => !r)} aria-expanded={refs} className="inline-flex items-center gap-1.5 hover:text-ink">
            <AgentMark size={16} className="text-person-agent" />
            Worked for <span className="tnum font-medium text-ink">{mins} min</span>
            <span aria-hidden>·</span>
            Read <span className="tnum font-medium text-ink">{read.length} sources</span>
            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-150", refs && "rotate-90")} />
          </button>
          {refs && <div className="mt-2"><Sources keys={read} /></div>}
        </div>
      )}
      <ol className="mt-6 grid grid-cols-6 gap-2" aria-label="Checkpoints">
        {checkpoints.map((c, i) => {
          const done = reached[i] || (c.id === "live" && partLive);
          const warn = lines[c.id].some((l) => l.tone === "warn") || (c.id === "live" && partLive && !reached[i]);
          const active = i === activeIdx;
          return (
            <li key={c.id} className="relative flex flex-col items-center text-center">
              {i > 0 && <span className={cn("absolute right-1/2 top-5 h-px w-full", reached[i - 1] ? "bg-ok/50" : "bg-line")} aria-hidden />}
              <span className={cn("relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-surface", warn ? "border-warn text-warn-ink" : done ? "border-ok text-ok-ink" : active ? "border-brand text-ink" : "border-line text-muted")}>
                {done && !warn ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <c.icon className="h-4 w-4" />}
              </span>
              <span className={cn("mt-2 text-xs", done || active ? "font-medium text-ink" : "text-muted")}>{c.label}</span>
            </li>
          );
        })}
      </ol>

      <ul className="mt-8 space-y-2" aria-live="polite">
        {checkpoints.flatMap((c) =>
          lines[c.id].map((l, j) => {
            const key = `${c.id}-${j}`;
            const isOpen = open === key;
            const events = state.log.filter((e) => e.kind === "agent" && c.steps.includes(eventById(e.id).step));
            return (
              <li key={key} className="animate-step rounded-card border border-line bg-surface">
                <button onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", l.tone === "ok" ? "bg-ok-soft text-ok-ink" : l.tone === "warn" ? "bg-warn-soft text-warn-ink" : "bg-brand-soft text-ink")}>
                    {l.tone === "ok" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : l.tone === "warn" ? <AlertTriangle className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                  </span>
                  <p className="min-w-0 flex-1 text-[15px]">
                    <span className="font-medium">{l.lead}:</span> <span className="text-sub">{l.text}</span>
                  </p>
                  {l.people && (
                    <span className="flex gap-0.5">
                      {l.people.map((p) => <Avatar key={p} id={p} size={26} held={p === "rashid" && rashidHeld} />)}
                    </span>
                  )}
                  <Who who={l.who} />
                  <ChevronRight className={cn("h-4 w-4 shrink-0 text-muted transition-transform duration-150", isOpen && "rotate-90")} />
                </button>
                {isOpen && (
                  <div className="border-t border-line px-4 py-3">
                    {l.docs && (
                      <div className="flex flex-wrap gap-3">
                        {l.docs.filter((k) => evidence[k]).map((k) => <DocThumb key={k} k={k} />)}
                      </div>
                    )}
                    <button onClick={() => setTech((t) => ({ ...t, [key]: !t[key] }))} className={cn("text-xs text-muted underline-offset-2 hover:text-ink hover:underline", l.docs && "mt-3")}>
                      {tech[key] ? "Hide technical details" : "Technical details"}
                    </button>
                    {tech[key] && (
                      <ul className="mt-2 space-y-1 font-mono text-[11px] text-muted">
                        {events.map((e) => {
                          const ev = eventById(e.id);
                          return <li key={e.id}>{ev.time} · {ev.actor} · {ev.call} → {ev.system}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          }),
        )}
        {working && (
          <li className="flex items-center gap-3 px-4 py-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> Working on {checkpoints.find((c) => c.steps.includes(working))?.label.toLowerCase() ?? "the next step"}
          </li>
        )}
      </ul>
    </div>
  );
}

function Who({ who }: { who: Line["who"] }) {
  if (who === "agent") return <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted"><AgentMark size={20} className="text-person-agent" /> Agent</span>;
  if (who === "rules") return <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-ok-soft text-ok-ink"><ShieldCheck className="h-3 w-3" /></span> Rules</span>;
  return <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink text-[9px] font-semibold">SM</span> Sara</span>;
}

function DocThumb({ k }: { k: EvidenceKey }) {
  const e = evidence[k];
  return (
    <figure className="w-44">
      <div className="relative h-24 overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
        {e.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.image} alt={e.title} className="h-full w-full object-cover" />
        ) : (
          <div className="space-y-1.5 p-3" aria-hidden>
            <div className="h-1.5 w-16 rounded bg-line-strong" />
            <div className="h-1 w-full rounded bg-line" />
            <div className="h-1 w-5/6 rounded bg-line" />
            <div className="h-1 w-4/6 rounded bg-line" />
            <div className="mt-3 h-4 w-12 rounded-sm border border-[rgb(var(--line-strong))]" />
          </div>
        )}
      </div>
      <figcaption className="mt-1 text-xs text-sub">{e.title}</figcaption>
      <p className="text-[11px] text-muted">{e.system}</p>
    </figure>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
function toMin(t: string) {
  const [d, hm] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return days.indexOf(d) * 1440 + h * 60 + m;
}
