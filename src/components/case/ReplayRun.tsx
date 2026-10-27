"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button, cn } from "@/components/ui";

const steps = [
  { lead: "Forms read", text: "The access request and 3 signed forms.", src: "Signed forms" },
  { lead: "People matched", text: "By Emirates ID, not by name.", src: "Finacle" },
  { lead: "Rashid held", text: "His Emirates ID expired 14 Aug.", src: "EFR" },
  { lead: "Mandate read", text: "SVS has more detail than Finacle, so SVS wins.", src: "SVS mandate 2019" },
  { lead: "Letter flagged", text: "A blurry 2023 letter may raise Khalifa to AED 25,000.", src: "SVS letter 2023" },
  { lead: "Plan built and tested", text: "Sent to Sara with 1 thing to check.", src: "Rules" },
];
const STEP_MS = 3300;

export function ReplayRun({ onDone }: { onDone: () => void }) {
  const [at, setAt] = useState(-1);
  useEffect(() => {
    if (at < 0) return;
    const t = setTimeout(() => (at >= steps.length ? (setAt(-1), onDone()) : setAt(at + 1)), at === 0 ? 300 : STEP_MS);
    return () => clearTimeout(t);
  }, [at, onDone]);
  if (at < 0)
    return (
      <Button className="mb-5" onClick={() => setAt(0)}>
        <RotateCcw className="h-3.5 w-3.5" /> Replay what the agent did before Sara arrived (20 s)
      </Button>
    );
  return (
    <ol className="mb-6 space-y-2 rounded-card border border-line p-4" aria-live="polite">
      {steps.map((s, i) => (
        <li key={s.lead} className={cn("flex items-start gap-3 text-sm transition-opacity", i < at ? "opacity-100" : "opacity-25")}>
          <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", i < at ? "bg-ok text-white" : "border border-line")}>
            {i < at && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-medium">{s.lead}.</span> {s.text}
          </span>
          <span className="shrink-0 rounded-full bg-panel px-2 py-0.5 text-[11px] text-sub">{s.src}</span>
        </li>
      ))}
      <li className="pt-1">
        <Button variant="ghost" size="sm" onClick={() => { setAt(-1); onDone(); }}>Stop replay</Button>
      </li>
    </ol>
  );
}
