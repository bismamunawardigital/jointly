"use client";

import { useState } from "react";
import { Bot, ScrollText, ShieldCheck, UserRound } from "lucide-react";
import { eventById } from "@/lib/script";
import { useStore } from "@/lib/store";
import { Card, Empty, Sources, cn } from "@/components/ui";

type Lane = "agent" | "rules" | "person";
const lanes: { id: Lane; label: string; icon: React.ComponentType<{ className?: string }>; tone: string }[] = [
  { id: "agent", label: "Agent", icon: Bot, tone: "text-accent-ink bg-accent-soft" },
  { id: "rules", label: "Rules", icon: ShieldCheck, tone: "text-ok-ink bg-ok-soft" },
  { id: "person", label: "People", icon: UserRound, tone: "text-ink bg-panel" },
];

export function AuditView() {
  const { state } = useStore();
  const [show, setShow] = useState<Lane | "all">("all");
  if (!state.log.length) return <Empty icon={ScrollText} title="No activity yet" body="Every agent call, rules check and human decision will be recorded here." />;
  const rows = state.log.map((entry) => {
    if (entry.kind === "human") return { key: entry.id, time: entry.time, lane: "person" as Lane, who: entry.by, what: entry.text, call: "Human decision", sources: undefined };
    const e = eventById(entry.id);
    const lane: Lane = e.actor === "Rules engine" ? "rules" : "agent";
    return { key: entry.id, time: e.time, lane, who: e.actor, what: e.title, call: `${e.call} · ${e.system}`, sources: e.evidence };
  });
  const visible = rows.filter((r) => show === "all" || r.lane === show);
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5" role="group" aria-label="Filter by who acted">
        {[{ id: "all" as const, label: `All ${rows.length}` }, ...lanes.map((l) => ({ id: l.id, label: `${l.label} ${rows.filter((r) => r.lane === l.id).length}` }))].map((f) => (
          <button key={f.id} aria-pressed={show === f.id} onClick={() => setShow(f.id)} className={cn("rounded-lg border px-2.5 py-1 text-xs", show === f.id ? "border-ink font-medium text-ink" : "border-line text-muted hover:text-ink")}>
            {f.label}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/60 text-left text-xs text-muted">
              <th className="w-24 px-4 py-2.5 font-medium">Time</th>
              <th className="w-44 px-4 py-2.5 font-medium">Who</th>
              <th className="px-4 py-2.5 font-medium">What</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const l = lanes.find((x) => x.id === r.lane)!;
              return (
                <tr key={r.key} className={cn("border-b border-line align-top last:border-0", r.lane === "person" && "bg-panel/40")}>
                  <td className="tnum px-4 py-2.5 text-xs text-sub">{r.time}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium", l.tone)}>
                      <l.icon className="h-3 w-3" /> {r.who}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {r.what}
                    <p className="mt-0.5 font-mono text-[11px] text-muted">{r.call}</p>
                  </td>
                  <td className="px-4 py-2.5">{r.sources ? <Sources keys={r.sources} /> : <span className="text-xs text-muted">None needed</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
