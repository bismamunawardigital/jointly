"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui";

// Granola-style hero: the stage stays pinned while you scroll, shrinks a little,
// and the headline on the left gives way to 3 numbered points.
export function HeroScroll({ intro, points, stage }: { intro: React.ReactNode; points: React.ReactNode[]; stage: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce), (max-width: 1023px)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const run = el.offsetHeight - window.innerHeight;
        setP(run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (still) {
    return (
      <section id="hero" className="pb-16 pt-28">
        <div className="mx-auto max-w-6xl px-6">
          {intro}
          <div className="mt-10">{stage}</div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">{points.map((pt, i) => <Point key={i} n={i + 1} on>{pt}</Point>)}</ol>
        </div>
      </section>
    );
  }

  const shrink = Math.min(1, p / 0.45);
  const lit = p < 0.3 ? 0 : p < 0.5 ? 1 : p < 0.7 ? 2 : 3;
  return (
    <section id="hero" ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen items-center pt-16">
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-12 px-8">
          <div className="relative min-h-[420px]">
            <div className={cn("absolute inset-0 flex flex-col justify-center transition-all duration-500", lit > 0 ? "pointer-events-none -translate-y-6 opacity-0" : "opacity-100")}>{intro}</div>
            <div className={cn("absolute inset-0 flex flex-col justify-center transition-all duration-500", lit > 0 ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0")}>
              <p className="font-display text-3xl leading-tight tracking-tight xl:text-4xl">Prepared by an agent, decided by a person.</p>
              <ol className="mt-8 space-y-6">{points.map((pt, i) => <Point key={i} n={i + 1} on={lit >= i + 1}>{pt}</Point>)}</ol>
            </div>
          </div>
          <div className="origin-right transition-transform duration-150 ease-out" style={{ transform: `scale(${1 - shrink * 0.14})` }}>
            {stage}
          </div>
        </div>
      </div>
    </section>
  );
}

function Point({ n, on, children }: { n: number; on: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("flex gap-4 transition-all duration-500", on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-25")}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong font-display text-sm font-semibold">{n}</span>
      <div className="pt-1.5">{children}</div>
    </li>
  );
}
