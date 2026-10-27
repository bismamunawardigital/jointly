"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StoreProvider, previewState } from "@/lib/store";
import { EvidenceGrid } from "@/components/case/EvidenceGrid";
import { SigningMap } from "@/components/case/SigningMap";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-card bg-surface shadow-lg ring-1 ring-line">
      <div className="flex items-center gap-1.5 border-b border-line bg-panel px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" /><span className="h-2.5 w-2.5 rounded-full bg-line-strong" /><span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
      </div>
      {children}
    </div>
  );
}

export function LiveGrid() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.setAttribute("inert", ""), []);
  return (
    <Frame>
      <div dir="ltr" className="overflow-x-auto">
        <div ref={ref} aria-hidden className="min-w-[860px] select-none p-5">
          <StoreProvider frozen>
            <EvidenceGrid />
          </StoreProvider>
        </div>
      </div>
    </Frame>
  );
}

export function MandateToggle({ before, after, see, label }: { before: string; after: string; see: string; label: string }) {
  const [v, setV] = useState<1 | 2>(1);
  return (
    <div>
      <div className="mb-4 flex w-fit gap-1 rounded-full border border-line p-1">
        {([1, 2] as const).map((n) => (
          <button key={n} type="button" aria-pressed={v === n} onClick={() => setV(n)} className={`rounded-full px-3 py-1 text-xs ${v === n ? "bg-ink text-canvas" : "text-sub hover:text-ink"}`}>
            {n === 1 ? before : after}
          </button>
        ))}
      </div>
      <Frame>
        <div dir="ltr" className="overflow-x-auto p-5">
          <StoreProvider key={v} frozen initial={previewState(v)}>
            <SigningMap />
          </StoreProvider>
        </div>
      </Frame>
      <Link href="/demo/case/?view=map" aria-label={label} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline">
        {see} <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
      </Link>
    </div>
  );
}
