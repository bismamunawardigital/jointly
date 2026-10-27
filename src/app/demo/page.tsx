"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { business, otherCases } from "@/data/seed";
import { statusOf, stepStates } from "@/lib/derive";
import { useStore } from "@/lib/store";
import { Card, Pill, Tone, cn } from "@/components/ui";

const toneOf: Record<string, Tone> = { "Agent working": "accent", "Needs you": "warn", "Partially live": "ok", Live: "ok", New: "neutral" };

export default function CommandCenter() {
  const { state } = useStore();
  const router = useRouter();
  const st = state.paused && state.queue.length ? { label: state.handedOver ? "With a maker" : "Paused", tone: "warn" as const } : statusOf[state.phase];
  const active = stepStates(state).find((s) => s.state === "active");
  const needsYou = otherCases.filter((c) => c.status === "Needs you").length + (st.label === "Needs you" ? 1 : 0);
  const stats = [
    { label: "Open cases", value: "4" },
    { label: "Need you", value: String(needsYou), tone: "warn" as const },
    { label: "Agent working", value: String(otherCases.filter((c) => c.status === "Agent working").length + (st.tone === "accent" ? 1 : 0)) },
    { label: "Target: form to set up", value: "Under 2h", note: "Illustrative, not measured" },
  ];
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-10 py-10">
        <p className="text-xs font-medium text-muted">Queue · Accounts operations team</p>
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


        <h2 className="mb-3 mt-10 text-sm font-semibold">Queue</h2>
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
        <p className="mt-3 text-xs text-muted">Only Creekside General Trading is clickable in this demo.</p>
      </div>
    </div>
  );
}
