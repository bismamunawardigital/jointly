"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { business, checker, otherCases } from "@/data/seed";
import { statusOf, stepStates } from "@/lib/derive";
import { useStore } from "@/lib/store";
import { AgentMark, Card, Pill, Tone, cn } from "@/components/ui";

const toneOf: Record<string, Tone> = { "Agent working": "accent", "Needs you": "warn", "Partially live": "ok", Live: "ok", New: "neutral" };

export default function CommandCenter() {
  const { state } = useStore();
  const router = useRouter();
  const st = state.paused && state.queue.length ? { label: state.handedOver ? "With a maker" : "Paused", tone: "warn" as const } : statusOf[state.phase];
  const active = stepStates(state).find((s) => s.state === "active");
  const needsYou = otherCases.filter((c) => c.status === "Needs you").length + (st.label === "Needs you" ? 1 : 0);
  const [view, setView] = useState<"all" | "agent">("all");
  const doing = state.phase === "live" ? "Granted access to all 3. Nothing left to do." : state.paused ? `Paused by ${checker.name}` : st.label === "Needs you" ? `Waiting for ${checker.name} to check and sign off` : state.phase === "partially_live" ? "Waiting for Rashid to renew his ID" : st.tone === "accent" ? `Working on ${(active?.label ?? "intake").toLowerCase()}` : "Starting the run";
  const agentRows = [
    { id: "creekside", business: business.name, doing, label: st.label, tone: st.tone as Tone, link: true },
    ...otherCases.map((c) => ({ id: c.id, business: c.business, doing: c.agentDoing, label: c.status as string, tone: toneOf[c.status], link: false })),
  ];
  const running = agentRows.filter((r) => r.tone === "accent").length;
  const done = agentRows.filter((r) => r.label === "Live").length;
  const stats = [
    { label: "Open cases", value: "4" },
    { label: "Need you", value: String(needsYou), tone: "warn" as const },
    { label: "Agent working", value: String(otherCases.filter((c) => c.status === "Agent working").length + (st.tone === "accent" ? 1 : 0)) },
    { label: "Target: form to set up", value: "Under 2h", note: "Illustrative, not measured" },
  ];
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-10 py-10">
        <p className="text-xs font-medium text-muted">Queue · Customer fulfilment operations team</p>
        <h1 className="mt-1 font-display text-[28px] leading-tight text-ink">
          {needsYou === 1 ? "1 case needs you today." : needsYou > 1 ? `${needsYou} cases need you today.` : "Nothing needs you right now."}
        </h1>
        <div className="mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-4">
              <p className="text-xs text-muted">{s.label}</p>
              <p className={`tnum mt-1 text-2xl font-semibold ${s.tone === "warn" && s.value !== "0" ? "text-warn-ink" : ""}`}>{s.value}</p>
              {s.note && <p className="mt-0.5 text-[11px] text-muted">{s.note}</p>}
            </div>
          ))}
        </div>


        <div role="tablist" aria-label="Queue view" className="mb-3 mt-10 flex gap-5 border-b border-line text-sm">
          {(["all", "agent"] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("-mb-px flex items-center gap-1.5 border-b-2 pb-2 font-medium transition-colors", view === v ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink")}>
              {v === "agent" && <AgentMark size={14} className="text-person-agent" />}
              {v === "all" ? "All cases" : "Agent's work"}
            </button>
          ))}
        </div>
        {view === "agent" ? (
          <Card className="overflow-hidden">
            <p className="border-b border-line bg-panel/60 px-4 py-2.5 text-xs text-muted">
              <span className="tnum font-medium text-ink">{running}</span> running · <span className="tnum font-medium text-ink">{agentRows.length - running - done}</span> waiting on a person · <span className="tnum font-medium text-ink">{done}</span> done. {checker.name} owns every one.
            </p>
            <ul>
              {agentRows.map((r) => (
                <li key={r.id} className={cn("flex items-center gap-3 border-b border-line px-4 py-3 last:border-0", r.link && "cursor-pointer hover:bg-panel/60")} onClick={r.link ? () => router.push("/demo/case/") : undefined}>
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-line", r.tone === "accent" ? "text-person-agent" : "text-muted")}>
                    <AgentMark size={16} className={cn(r.tone === "accent" && "motion-safe:animate-pulse")} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", r.link ? "text-ink" : "text-sub")}>{r.business}</p>
                    <p className="truncate text-xs text-muted">{r.doing}</p>
                  </div>
                  <Pill tone={r.tone}>{r.label}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/60 text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Business</th>
                <th className="px-4 py-2.5 font-medium">Request</th>
                <th className="px-4 py-2.5 font-medium">Step</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Waiting on</th>
                <th className="px-4 py-2.5 text-right font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr
                onClick={() => router.push("/demo/case/")}
                className={cn("cursor-pointer border-b border-line transition-colors", st.label === "Needs you" ? "bg-warn-soft/50 hover:bg-warn-soft/80" : "bg-accent-soft/30 hover:bg-accent-soft/60")}
              >
                <td className="px-4 py-3">
                  <Link href="/demo/case/" className="flex items-center gap-1.5 font-medium text-ink">
                    {business.name} <ArrowRight className="h-3.5 w-3.5 text-accent" />
                  </Link>
                  <p className="font-mono text-[11px] text-muted">{business.iban}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                    Owner <span className="font-medium text-sub">{checker.name}</span> · Helping <AgentMark size={12} className="text-person-agent" /> Agent
                  </p>
                </td>
                <td className="px-4 py-3 text-sub">Joint signatories (3)</td>
                <td className="px-4 py-3 text-sub">{state.phase === "live" ? "Done" : active?.label ?? "Intake & EFR"}</td>
                <td className="px-4 py-3">
                  <Pill tone={st.tone}>{st.label}</Pill>
                </td>
                <td className="px-4 py-3 text-sub">{st.label === "Needs you" ? "Sara M." : st.tone === "accent" ? "Agent" : state.phase === "partially_live" ? "Rashid, EID renewal" : state.phase === "new" ? "Agent" : "None"}</td>
                <td className="tnum px-4 py-3 text-right text-sub">Today</td>
              </tr>
              {[...otherCases].sort((x, y) => Number(y.status === "Needs you") - Number(x.status === "Needs you")).map((c) => (
                <tr key={c.id} className={cn("border-b border-line last:border-0", c.status === "Needs you" && "bg-warn-soft/30")}>
                  <td className="px-4 py-3 font-medium text-sub">{c.business}</td>
                  <td className="px-4 py-3 text-muted">{c.type}</td>
                  <td className="px-4 py-3 text-muted">{c.stage}</td>
                  <td className="px-4 py-3">
                    <Pill tone={toneOf[c.status]}>{c.status}</Pill>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.owner}</td>
                  <td className="tnum px-4 py-3 text-right text-muted">{c.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        )}
        <p className="mt-3 text-xs text-muted">Only Creekside General Trading is clickable in this demo.</p>
      </div>
    </div>
  );
}
