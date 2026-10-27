"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Avatar, cn } from "@/components/ui";

function Identity() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      {["Mohammed Al Mansoori", "MOHAMMED ALMANSOORI", "Mohd Al-Mansouri"].map((n) => (
        <span key={n} className="rounded-full border border-line bg-canvas px-3 py-1 text-sm text-sub line-through decoration-muted/40">
          {n}
        </span>
      ))}
      <ArrowRight className="h-4 w-4 rotate-90 text-muted" />
      <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">
        <Avatar id="mohammed" size={28} /> EID ending 3391
      </span>
    </div>
  );
}

function Hold() {
  return (
    <div className="flex items-end gap-6">
      <Avatar id="mohammed" size={52} />
      <Avatar id="khalifa" size={52} />
      <div className="flex flex-col items-center gap-2">
        <Avatar id="rashid" size={52} held />
        <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "rgb(var(--held-soft))", color: "rgb(var(--held))" }}>
          EID expired 14 Aug
        </span>
      </div>
    </div>
  );
}

function Scan() {
  return (
    <div className="w-full max-w-sm space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scans/svs-amd-2023.png" alt="Blurry scan of the 2023 amendment letter" className="w-full rounded-lg border border-line" />
      <div className="flex items-center gap-2 text-sm text-sub">
        The letter says AED
        <span className="rounded-md border-2 border-accent bg-surface px-2 py-0.5 font-medium text-ink">25,000</span>
        <Check className="h-4 w-4 text-ok" strokeWidth={3} />
      </div>
    </div>
  );
}

function Live() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-5">
        <span className="flex rounded-full p-1 ring-2 ring-ok/40">
          <Avatar id="mohammed" size={52} />
          <span className="-ml-3">
            <Avatar id="khalifa" size={52} />
          </span>
        </span>
        <Avatar id="rashid" size={52} held />
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok-soft px-4 py-1.5 text-sm font-semibold text-ok-ink">
        <span className="h-2 w-2 rounded-full bg-ok" /> 2 of 3 live
      </span>
    </div>
  );
}

const steps = [
  { title: "Matches people by ID, never by name", tab: "evidence", V: Identity },
  { title: "Catches the expired ID before any work starts", tab: "run", V: Hold },
  { title: "Reads a blurry 2023 letter, and asks Sara to confirm", tab: "review", V: Scan },
  { title: "Releases what's safe, holds the rest", tab: "release", V: Live },
];

export function Moments() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const V = steps[active].V;
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="hidden md:block">
        <div aria-hidden className="sticky top-24 flex h-[380px] items-center justify-center rounded-card border border-line bg-surface p-8 shadow-sm">
          <div key={active} className="flex w-full animate-enter justify-center">
            <V />
          </div>
        </div>
      </div>
      <ol className="space-y-10 md:space-y-0">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className="flex flex-col justify-center md:min-h-[60vh]"
          >
            <p className={cn("tnum text-sm", i === active ? "text-accent-ink" : "text-muted")}>0{i + 1}</p>
            <p className={cn("mt-2 font-display text-2xl leading-snug md:text-3xl", i !== active && "md:text-muted")}>{s.title}</p>
            <div aria-hidden className="mt-4 flex justify-center rounded-card border border-line bg-surface p-6 md:hidden">
              <s.V />
            </div>
            <Link href={`/demo/case/?tab=${s.tab}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline">
              See it live <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
