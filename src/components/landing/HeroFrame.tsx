"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Circle } from "lucide-react";
import { Avatar, cn } from "@/components/ui";

type Tone = "ok" | "warn" | "dot";
const LOOP = 30;
const FIRST = 6;

function Cell({ tone, label }: { tone: Tone; label: string }) {
  const I = tone === "ok" ? Check : tone === "warn" ? AlertTriangle : Circle;
  return (
    <td className={cn("px-3 py-2.5 transition-colors duration-300", tone === "warn" ? "bg-warn-soft text-warn-ink" : "text-sub")}>
      <span className="flex items-center gap-1.5">
        <I aria-hidden className={tone === "ok" ? "h-3.5 w-3.5 text-ok" : tone === "warn" ? "h-3.5 w-3.5" : "h-2 w-2 text-muted"} />
        {label}
      </span>
    </td>
  );
}

const Pin = ({ n, cls }: { n: number; cls: string }) => (
  <span aria-hidden className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas shadow ${cls}`}>{n}</span>
);

export function HeroFrame({ callouts, url = "jointly · Creekside · Review" }: { callouts: string[]; url?: string }) {
  const [t, setT] = useState(FIRST);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || paused) return;
    const id = setInterval(() => setT((x) => (x + 1) % LOOP), 500);
    return () => clearInterval(id);
  }, [paused]);
  const ticked = (i: number) => t >= Math.min(4, i + 1);
  const confirmed = t >= 13;
  const raised = t >= 16;
  const live = t >= 20;
  const typed = "25,000".slice(0, Math.max(0, t - 10));
  const people = [
    { id: "mohammed" as const, name: "Mohammed", letter: ["dot", "Not used"] as [Tone, string], plan: "Link existing login" },
    {
      id: "khalifa" as const,
      name: "Khalifa",
      letter: (t < 4 ? ["dot", "Reading the scan"] : confirmed ? ["ok", "25,000 · Confirmed by Sara"] : ["warn", "25,000? Unclear scan"]) as [Tone, string],
      plan: raised ? "Solo up to 25,000" : "Solo up to 10,000",
    },
    { id: "rashid" as const, name: "Rashid", letter: ["dot", "Not used"] as [Tone, string], plan: "Created, switched off" },
  ];
  const bar = live
    ? ["2 of 3 live. Rashid waits for his ID.", "Mohammed and Khalifa can approve together."]
    : raised
      ? ["Signed off · plan v2", "The agent is setting it up."]
      : t >= 10
        ? ["Sara types what the letter says", "Her reading is checked against the agent's."]
        : ["Plan v1 is ready. 1 value needs your eye.", "Stages 1 and 2 passed by rule."];
  return (
    <figure className="min-w-0">
      <div
        dir="ltr"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative overflow-hidden rounded-card border border-line bg-surface shadow-lg"
      >
        <div className="flex items-center gap-1.5 border-b border-line bg-panel px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ms-3 truncate text-[13px] text-muted">{url}</span>
        </div>
        <div className="p-4">
          <p className="font-display text-lg">{live ? "Creekside is partly live" : confirmed ? "Both readings match" : "1 thing needs your judgement"}</p>
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-3 py-2 font-medium">Who</th>
                <th className="px-3 py-2 font-medium">SVS letter 2023</th>
                <th className="px-3 py-2 font-medium">Planned setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {people.map((r, i) => (
                <tr key={r.id} className={cn("transition-opacity duration-300", live && r.id === "rashid" && "opacity-50")}>
                  <td className="px-3 py-2.5 font-medium">
                    <span className="flex items-center gap-2">
                      <span className={cn("rounded-full transition-shadow", live && r.id !== "rashid" && "ring-2 ring-ok ring-offset-1 ring-offset-surface")}>
                        <Avatar id={r.id} size={22} held={live && r.id === "rashid"} />
                      </span>
                      {r.name}
                    </span>
                  </td>
                  <Cell tone={r.letter[0]} label={r.letter[1]} />
                  <Cell tone={ticked(i) ? "ok" : "dot"} label={r.plan} />
                </tr>
              ))}
            </tbody>
          </table>
          <p className={cn("mt-2 h-5 text-[13px] text-warn-ink transition-opacity", t >= 4 && t < 10 ? "opacity-100" : "opacity-0")}>The scan is unclear. Asking Sara.</p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line bg-panel px-4 py-3">
          <div className="min-w-0 text-[13px]">
            <p className="font-medium">{bar[0]}</p>
            <p className="text-muted">{bar[1]}</p>
          </div>
          {t >= 10 && t < 16 ? (
            <span className="tnum shrink-0 rounded-lg border-2 border-brand bg-surface px-3 py-1 text-[13px] font-medium">AED {typed || " "}</span>
          ) : !raised ? (
            <span className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-[13px] font-medium text-onaccent">Confirm AED 25,000</span>
          ) : null}
        </div>
        <Pin n={1} cls="left-[50%] top-[30%]" />
        <Pin n={2} cls="left-[60%] top-[50%]" />
        <Pin n={3} cls="right-[8%] bottom-[38px]" />
      </div>
      <p className="mt-2 text-xs text-muted">Watch the agent get stuck on a blurry letter and ask Sara for help instead of guessing.</p>
      <ol className="mt-3 space-y-1.5 text-sm text-sub">
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
