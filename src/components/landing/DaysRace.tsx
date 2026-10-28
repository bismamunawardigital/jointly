"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, Printer, RotateCcw, Search, Smartphone, Truck, Undo2, UserRound, type LucideIcon } from "lucide-react";
import { AgentMark, cn } from "@/components/ui";

type Step = { at: string; label: string; icons: React.ReactNode[] };

const ic = (I: LucideIcon, k = 0) => <I key={k} aria-hidden className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} />;

const TODAY: Step[] = [
  { at: "Day 1", label: "Forms arrive", icons: [ic(FileText)] },
  { at: "Day 2", label: "Maker reads Finacle and SVS", icons: [ic(Search)] },
  { at: "Day 3", label: "4 maker-checker rounds", icons: [0, 1, 2, 3].map((k) => ic(Undo2, k)) },
  { at: "Day 4", label: "PIN mailers printed", icons: [ic(Printer)] },
  { at: "Day 5", label: "Courier delivers", icons: [ic(Truck)] },
];

const JOINTLY: Step[] = [
  { at: "09:12", label: "Agent reads Finacle, SVS and EFR", icons: [<AgentMark key={0} size={22} />] },
  { at: "09:20", label: "Asks Sara about 1 blurry value", icons: [ic(UserRound)] },
  { at: "10:38", label: "Sara checks it and signs off", icons: [ic(Check)] },
  { at: "10:46", label: "Agent sets up access, 0 differences", icons: [<AgentMark key={0} size={22} />] },
  { at: "11:06", label: "SMS, first login", icons: [ic(Smartphone)] },
];

// 1h 54m against 5 working days of 8 hours
const SHARE = 114 / (5 * 8 * 60);
const T_TODAY = 5200;
const T_SNAP = 700;
const T_JOINTLY = 3000;
const T_END = T_TODAY + T_SNAP + T_JOINTLY;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function DaysRace() {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [t, setT] = useState(0);

  const play = () => {
    cancelAnimationFrame(raf.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(T_END);
    const start = performance.now();
    const tick = (now: number) => {
      const e = Math.min(now - start, T_END);
      setT(e);
      if (e < T_END) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);

  const pToday = clamp(t / T_TODAY);
  const pSnap = clamp((t - T_TODAY) / T_SNAP);
  const pJointly = clamp((t - T_TODAY - T_SNAP) / T_JOINTLY);
  const done = t >= T_END;
  const day = Math.min(5, Math.floor(pToday * 5) + 1);
  const mins = Math.round(pJointly * 114);
  const clock = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;

  return (
    <div ref={ref} role="img" aria-label="Today a joint signatory setup takes 5 days: forms, a maker reading Finacle and SVS, 4 maker-checker rounds, PIN mailers and a courier. With Jointly it takes 1 hour 54 minutes and a person makes 2 decisions. Bars are to scale.">
      <div aria-hidden>
        <Lane title="Today" total="5 days" totalClass="text-warn" done={done}>
          <ol className="grid grid-cols-5 gap-2">
            {TODAY.map((s, i) => {
              const on = pToday >= i / 5 + 0.02;
              return <StepCell key={s.at} s={s} on={on} tone="text-warn" />;
            })}
          </ol>
          <Track>
            <div className="h-full rounded-full bg-warn" style={{ width: `${pToday * 100}%` }} />
            {t > 0 && !done && pToday < 1 && <Head left={pToday} text={`Day ${day}`} className="bg-warn text-white" />}
          </Track>
        </Lane>

        <Lane title="With Jointly" total="1h 54m" totalClass="text-ok-ink" done={done} className="mt-12">
          <Track>
            <div className="h-full rounded-full bg-ok" style={{ width: `${Math.max(pSnap * SHARE * 100, pSnap > 0 ? 0.8 : 0)}%` }} />
            {pSnap > 0 && <Head left={SHARE} text={pJointly > 0 ? clock : "0h 00m"} className="bg-ok text-white" />}
          </Track>
          <div className={cn("relative transition-opacity duration-500", pSnap > 0.5 ? "opacity-100" : "opacity-0")}>
            <svg className="h-8 w-full text-ok/50" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d={`M0 0 L0 1 L0 9 M${SHARE * 100} 0 L100 9`} fill="none" stroke="currentColor" strokeWidth="0.3" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
            </svg>
            <div className="rounded-card border border-ok/30 bg-ok-soft/40 p-4">
              <p className="mb-3 text-xs text-muted">Zoomed in: the whole case fits in the first sliver</p>
              <ol className="grid grid-cols-5 gap-2">
                {JOINTLY.map((s, i) => {
                  const on = pJointly >= i / 5 + 0.02;
                  return <StepCell key={s.at} s={s} on={on} tone="text-ok-ink" timeClass="tnum font-medium" />;
                })}
              </ol>
            </div>
          </div>
        </Lane>
      </div>

      <div className={cn("mt-10 flex flex-wrap items-end justify-between gap-6 transition-all duration-700", done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>
        <p className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
          <span className="text-muted line-through decoration-2">5 days</span> <span className="text-ok-ink">1h 54m</span>
        </p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-sub">Same checks. A person makes 2 decisions.</p>
          <button type="button" onClick={play} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-sub hover:bg-panel hover:text-ink">
            <RotateCcw aria-hidden className="h-4 w-4" /> Replay
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">Bars are to scale: 5 working days against 1 hour 54 minutes. Synthetic case, not measured.</p>
    </div>
  );
}

function Lane({ title, total, totalClass, done, className, children }: { title: string; total: string; totalClass: string; done: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
        <p className={cn("tnum font-display text-xl font-semibold transition-opacity duration-500", totalClass, done ? "opacity-100" : "opacity-0")}>{total}</p>
      </div>
      {children}
    </div>
  );
}

function Track({ children }: { children: React.ReactNode }) {
  return <div className="relative mt-10 h-2.5 rounded-full bg-line">{children}</div>;
}

function Head({ left, text, className }: { left: number; text: string; className: string }) {
  return (
    <span className={cn("tnum absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", className)} style={{ left: `${Math.max(left * 100, 3)}%` }}>
      {text}
    </span>
  );
}

function StepCell({ s, on, tone, timeClass }: { s: Step; on: boolean; tone: string; timeClass?: string }) {
  return (
    <li className={cn("transition-all duration-300", on ? "opacity-100" : "opacity-30")}>
      <p className={cn("text-xs", on ? tone : "text-muted", timeClass)}>{s.at}</p>
      <div className={cn("mt-2 flex h-8 items-center gap-1 transition-transform duration-300", on ? `${tone} scale-100` : "scale-95 text-muted")}>{s.icons}</div>
      <p className="mt-1 text-[11px] leading-snug text-sub md:text-xs">{s.label}</p>
    </li>
  );
}
