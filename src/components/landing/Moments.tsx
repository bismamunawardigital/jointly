"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Avatar, cn } from "@/components/ui";
import { HeroScene, type SceneText } from "./HeroScene";

type Labels = { id: string; expired: string; letter: string; alt: string; scene?: SceneText };
export const momentLabels: Labels = { id: "EID ending", expired: "EID expired 14 Aug", letter: "The letter says AED", alt: "Blurry scan of the 2023 amendment letter" };

export function Identity({ v }: { v: Labels }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      {["Mohammed Al Mansoori", "MOHAMMED ALMANSOORI", "Mohd Al-Mansouri"].map((n) => (
        <span key={n} className="rounded-full border border-line bg-canvas px-3 py-1 text-sm text-sub line-through decoration-muted/40">
          {n}
        </span>
      ))}
      <ArrowRight className="h-4 w-4 rotate-90 text-muted" />
      <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">
        <Avatar id="mohammed" size={28} /> {v.id} <bdi>3391</bdi>
      </span>
    </div>
  );
}

function Hold({ v }: { v: Labels }) {
  return (
    <div className="flex items-end gap-6">
      <Avatar id="mohammed" size={52} />
      <Avatar id="khalifa" size={52} />
      <div className="flex flex-col items-center gap-2">
        <Avatar id="rashid" size={52} held />
        <span className="whitespace-nowrap rounded-md border border-bad/30 bg-bad-soft px-2.5 py-1 font-mono text-[11px] font-medium text-bad-ink">
          {v.expired}
        </span>
      </div>
    </div>
  );
}

function Scan({ v }: { v: Labels }) {
  return (
    <div className="w-full max-w-sm space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scans/svs-amd-2023.png" width={1100} height={380} loading="lazy" decoding="async" alt={v.alt} className="w-full rounded-lg border border-line" />
      <div className="flex items-center gap-2 text-sm text-sub">
        {v.letter}
        <span className="rounded-md border-2 border-accent bg-surface px-2 py-0.5 font-medium text-ink">25,000</span>
        <Check className="h-4 w-4 text-ok" strokeWidth={3} />
      </div>
    </div>
  );
}

export function Live({ v }: { v: Labels }) {
  return (
    <div className="w-full max-w-md">
      <HeroScene t={v.scene} />
    </div>
  );
}

const steps = [
  { title: "Matches people by ID, never by name", tab: "evidence", V: Identity },
  { title: "Catches the expired ID before any work starts", tab: "run", V: Hold },
  { title: "Reads a blurry 2023 letter, and asks Sara to confirm", tab: "review", V: Scan },
  { title: "Releases what's safe, holds the rest", tab: "release", V: Live },
];

export function Moments({ titles, see = "See it live", v = momentLabels }: { titles?: string[]; see?: string; v?: Labels }) {
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
            <V v={v} />
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
            className="flex flex-col justify-center md:min-h-[34vh]"
          >
            <p className={cn("tnum text-sm", i === active ? "text-accent-ink" : "text-muted")}>0{i + 1}</p>
            <p className={cn("mt-2 font-display text-2xl leading-snug md:text-3xl", i !== active && "md:text-muted")}>{titles?.[i] ?? s.title}</p>
            <div aria-hidden className="mt-4 flex justify-center rounded-card border border-line bg-surface p-6 md:hidden">
              <s.V v={v} />
            </div>
            <Link href={`/demo/case/?moment=${i + 1}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline">
              {see} <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
