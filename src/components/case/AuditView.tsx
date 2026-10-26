"use client";

import { eventById } from "@/lib/script";
import { useStore } from "@/lib/store";
import { Card, Empty } from "@/components/ui";
import { ScrollText } from "lucide-react";

export function AuditView() {
  const { state } = useStore();
  if (!state.log.length) return <Empty icon={ScrollText} title="No activity yet" body="Every agent call, rules check and human decision will be recorded here." />;
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-panel/60 text-left text-xs text-muted">
            <th className="w-24 px-4 py-2.5 font-medium">Time</th>
            <th className="w-36 px-4 py-2.5 font-medium">Who</th>
            <th className="px-4 py-2.5 font-medium">What</th>
            <th className="px-4 py-2.5 font-medium">System call</th>
          </tr>
        </thead>
        <tbody>
          {state.log.map((entry, i) => {
            if (entry.kind === "human")
              return (
                <tr key={i} className="border-b border-line bg-panel/40 last:border-0">
                  <td className="tnum px-4 py-2.5 text-xs text-sub">{entry.time}</td>
                  <td className="px-4 py-2.5 font-medium">{entry.by}</td>
                  <td className="px-4 py-2.5">{entry.text}</td>
                  <td className="px-4 py-2.5 text-xs text-muted">Human decision</td>
                </tr>
              );
            const e = eventById(entry.id);
            return (
              <tr key={i} className="border-b border-line last:border-0">
                <td className="tnum px-4 py-2.5 text-xs text-sub">{e.time}</td>
                <td className="px-4 py-2.5 text-sub">{e.actor}</td>
                <td className="px-4 py-2.5">{e.title}</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted">
                  {e.call} · {e.system}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
