"use client";

import { useState } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { buildStages, diffStage } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { Card, Empty, Pill, Sources, cn } from "@/components/ui";

export function PlanView() {
  const { state, version } = useStore();
  const [view, setView] = useState<1 | 2 | null>(null);
  if (!hasEvent(state, "plan-build")) return <Empty icon={ClipboardList} title="No plan yet" body="The agent drafts the plan after identity and mandate checks." />;
  const v = view ?? version;
  const stages = buildStages(v);
  const prev = buildStages(1);
  return (
    <div className="max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-sub">Everything the agent will set up in Digital Banking Admin, with where each line came from.</p>
        {version === 2 && (
          <div className="flex rounded-lg border border-line p-0.5 text-xs">
            {([1, 2] as const).map((n) => (
              <button key={n} onClick={() => setView(n)} className={cn("rounded-md px-2.5 py-1 transition-colors", v === n ? "bg-panel font-medium text-ink" : "text-muted hover:text-ink")}>
                Plan v{n}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stages.map((s, i) => {
          const changes = v === 2 ? diffStage(prev[i], s) : [];
          return (
            <Card key={s.id} className={cn("p-4", changes.length && "border-accent/40")}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  <span className="mr-1.5 text-muted">{s.id}</span>
                  {s.title}
                </p>
                {v === 2 && <Pill tone={changes.length ? "accent" : "neutral"}>{changes.length ? "Changed in v2" : "Unchanged"}</Pill>}
              </div>
              <ul className="mt-3 divide-y divide-line">
                {s.items.map((it) => {
                  const ch = changes.find((c) => c.key === it.key);
                  return (
                    <li key={it.key} className="py-2.5">
                      <p className="text-xs text-muted">
                        {ch && ch.beforeLabel !== ch.afterLabel ? (
                          <>
                            <span className="line-through">{ch.beforeLabel}</span> <ArrowRight className="inline h-3 w-3" /> {it.label}
                          </>
                        ) : (
                          it.label
                        )}
                      </p>
                      {ch && ch.before !== ch.after ? (
                        <p className="mt-0.5 text-sm">
                          <span className="text-muted line-through">{ch.before}</span>
                          <ArrowRight className="mx-1 inline h-3 w-3 text-accent" />
                          <span className="font-medium">{it.value}</span>
                        </p>
                      ) : (
                        <p className="mt-0.5 text-sm">{it.value}</p>
                      )}
                      <div className="mt-1.5">
                        <Sources keys={it.sources} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
