"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

const before = [
  { at: "Day 1", text: "Forms arrive. Maker reads Finacle and SVS by hand" },
  { at: "Day 2", text: "Checker finds a mismatch. Case goes back" },
  { at: "Day 3", text: "Second round. Then a third" },
  { at: "Day 4", text: "Setup done in Admin. PINs printed" },
  { at: "Day 5", text: "Courier delivers. First login, maybe" },
];
const after = [
  { at: "09:12", text: "Forms arrive. Agent gathers evidence" },
  { at: "09:31", text: "Plan with sources sent to Sara" },
  { at: "10:07", text: "Sara returns 1 stage. Agent fixes only that" },
  { at: "10:46", text: "Set up and read back. 0 differences" },
  { at: "13:22", text: "Mohammed and Khalifa live. Rashid joins later" },
];

// 5 working days of 8 hours vs 4h 10m
const afterShare = 250 / (5 * 8 * 60);

function Lane({ title, sub, items, share, run, slow }: { title: string; sub: string; items: typeof before; share: number; run: boolean; slow: boolean }) {
  const step = slow ? 420 : 180;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={clsx("h-full rounded-full transition-[width] ease-out", slow ? "bg-muted" : "bg-accent")}
          style={{ width: run ? `${Math.max(share * 100, 3)}%` : "0%", transitionDuration: `${step * items.length}ms` }}
        />
      </div>
      <ol className="mt-5 space-y-3">
        {items.map((b, i) => (
          <li
            key={b.at}
            className={clsx("flex gap-4 text-sm transition-all duration-500 ease-out", run ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}
            style={{ transitionDelay: run ? `${i * step}ms` : "0ms" }}
          >
            <span className={clsx("tnum w-12 shrink-0", slow ? "text-muted" : "font-medium text-accent-ink")}>{b.at}</span>
            <span className={slow ? "text-sub" : undefined}>{b.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setRun(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div className="grid gap-10 md:grid-cols-2">
        <Lane title="Before" sub="4 to 5 days, mostly waiting" items={before} share={1} run={run} slow />
        <Lane title="After" sub="Same controls, same day. Illustrative target" items={after} share={afterShare} run={run} slow={false} />
      </div>
      <p className={clsx("mt-8 text-xs text-muted transition-opacity duration-700", run ? "opacity-100" : "opacity-0")} style={{ transitionDelay: run ? "2200ms" : "0ms" }}>
        Bars are to scale: 5 working days against 4 hours 10 minutes.
      </p>
    </div>
  );
}
