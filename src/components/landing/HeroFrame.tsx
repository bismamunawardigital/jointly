"use client";

import { useEffect, useRef } from "react";
import { StoreProvider } from "@/lib/store";
import { EvidenceGrid } from "@/components/case/EvidenceGrid";
import { NeedsYou } from "@/components/case/NeedsYou";

const pins = [
  { n: 1, cls: "left-[30%] top-[22%]" },
  { n: 2, cls: "left-[73%] top-[52%]" },
  { n: 3, cls: "left-[56%] top-[90%]" },
];

export function HeroFrame({ callouts, url = "jointly · Creekside · Review" }: { callouts: string[]; url?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.setAttribute("inert", ""), []);
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-line bg-panel px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" />
          <span dir="ltr" className="ms-3 truncate text-[11px] text-muted">{url}</span>
        </div>
        <div dir="ltr" className="relative h-[40px] overflow-hidden md:h-[246px]">
          <div ref={ref} aria-hidden className="pointer-events-none absolute left-0 top-0 w-[1000px] origin-top-left -translate-y-[134px] scale-[0.62] select-none md:translate-y-0 md:scale-[0.555]">
            <StoreProvider frozen>
              <div className="bg-canvas p-5 pb-0">
                <p className="mb-3 font-display text-2xl text-ink">1 thing needs your judgement</p>
                <EvidenceGrid />
              </div>
              <div className="mt-3">
                <NeedsYou />
              </div>
            </StoreProvider>
          </div>
          {pins.map((p) => (
            <span key={p.n} aria-hidden className={`absolute hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas shadow md:flex ${p.cls}`}>
              {p.n}
            </span>
          ))}
        </div>
      </div>
      <ol className="mt-4 space-y-1.5 text-sm text-sub">
        {callouts.map((c, i) => (
          <li key={c} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-canvas">{i + 1}</span>
            {c}
          </li>
        ))}
      </ol>
    </figure>
  );
}
