"use client";

import { useState } from "react";
import { Download, ScrollText, ShieldCheck, UserRound } from "lucide-react";
import { eventById } from "@/lib/script";
import { useStore } from "@/lib/store";
import { AgentMark, Card, Empty, Sources, cn } from "@/components/ui";

type Lane = "agent" | "rules" | "person";
const lanes: { id: Lane; label: string; filter: string }[] = [
  { id: "person", label: "Sara", filter: "Decisions" },
  { id: "agent", label: "Agent", filter: "Agent" },
  { id: "rules", label: "Rules", filter: "Rules" },
];
const mark: Record<Lane, React.ReactNode> = {
  agent: <AgentMark size={20} className="text-person-agent" />,
  rules: <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ok-soft text-ok-ink"><ShieldCheck className="h-3 w-3" /></span>,
  person: <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink"><UserRound className="h-3 w-3" /></span>,
};

export function AuditView() {
  const { state } = useStore();
  const [show, setShow] = useState<Lane | "all">("all");
  const [tech, setTech] = useState(false);
  if (!state.log.length) return <Empty icon={ScrollText} title="No activity yet" body="Every agent call, rules check and human decision will be recorded here." />;
  const rows = state.log.map((entry) => {
    if (entry.kind === "human") return { key: entry.id, time: entry.time, lane: (entry.by === "Rules" ? "rules" : "person") as Lane, who: entry.by, what: entry.text, call: entry.by === "Rules" ? "Rule check" : "Human decision", sources: undefined, legacy: false };
    const e = eventById(entry.id);
    const lane: Lane = e.actor === "Rules engine" ? "rules" : "agent";
    return { key: entry.id, time: e.time, lane, who: e.actor, what: e.title, call: `${e.call} · ${e.system}`, sources: e.evidence, legacy: entry.id === "ex-workflow-fail" || entry.id === "ex-workflow" };
  });
  const day: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
  const at = (t: string) => {
    const [d, hm] = t.split(" ");
    const [h, m] = (hm ?? "0:0").split(":").map(Number);
    return (day[d] ?? 0) * 1440 + h * 60 + m;
  };
  rows.sort((a, b) => at(a.time) - at(b.time));
  const visible = rows.filter((r) => show === "all" || r.lane === show);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5" role="group" aria-label="Filter by who acted">
        {[{ id: "all" as const, label: "All" }, ...lanes.map((l) => ({ id: l.id, label: l.filter }))].map((f) => (
          <button key={f.id} aria-pressed={show === f.id} onClick={() => setShow(f.id)} className={cn("rounded-full border px-3 py-1 text-xs", show === f.id ? "border-ink font-medium text-ink" : "border-line text-muted hover:text-ink")}>
            {f.label}
          </button>
        ))}
        <button onClick={() => setTech((t) => !t)} aria-pressed={tech} className="ml-auto text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
          {tech ? "Hide technical details" : "Show technical details"}
        </button>
        <button onClick={() => window.print()} className="ml-3 inline-flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-1 text-xs text-sub hover:text-ink">
          <Download className="h-3.5 w-3.5" /> Export audit PDF
        </button>
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      {mark[r.lane]} {tech ? r.who : l.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {r.what}
                    {r.legacy && <span className="ml-2 whitespace-nowrap rounded-full bg-panel px-2 py-0.5 text-[11px] text-sub">Legacy system</span>}
                    {tech && <p className="mt-0.5 font-mono text-[11px] text-muted">{r.call}</p>}
                  </td>
                  <td className="px-4 py-2.5">{tech && r.sources ? <Sources keys={r.sources} /> : <span className="whitespace-nowrap text-xs text-muted">{r.sources ? `${r.sources.length} source${r.sources.length > 1 ? "s" : ""}` : "None needed"}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
