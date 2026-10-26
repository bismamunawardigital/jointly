"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { evidence } from "@/data/seed";
import { useStore } from "@/lib/store";

export function EvidenceDrawer() {
  const { evidenceOpen, openEvidence } = useStore();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openEvidence(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openEvidence]);
  if (!evidenceOpen) return null;
  const e = evidence[evidenceOpen];
  const parts = e.highlight ? e.body.split(e.highlight) : [e.body];
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={e.title}>
      <button className="absolute inset-0 bg-ink/10" aria-label="Close source" onClick={() => openEvidence(null)} />
      <aside className="relative flex h-full w-[420px] animate-enter flex-col border-l border-line bg-white shadow-[0_0_40px_rgba(23,24,28,0.08)]">
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs text-muted">{e.system}</p>
            <h3 className="mt-0.5 text-base font-semibold">{e.title}</h3>
            <p className="mt-1 font-mono text-xs text-sub">{e.ref}</p>
          </div>
          <button onClick={() => openEvidence(null)} className="rounded-md p-1 text-muted hover:bg-panel hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto px-5 py-5">
          <div className="rounded-lg border border-line bg-panel p-4 font-mono text-[13px] leading-relaxed text-ink">
            {parts.length === 2 ? (
              <>
                {parts[0]}
                <mark className="rounded bg-accent-soft px-0.5 text-accent-ink">{e.highlight}</mark>
                {parts[1]}
              </>
            ) : (
              e.body
            )}
          </div>
          {e.note && <p className="text-sm text-sub">{e.note}</p>}
          <p className="text-xs text-muted">Synthetic record. Read-only copy pulled by the agent.</p>
        </div>
      </aside>
    </div>
  );
}
