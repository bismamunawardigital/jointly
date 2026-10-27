"use client";

import { ArrowRight, Banknote, Lock, UserRoundX } from "lucide-react";
import { PersonId, firstName, people } from "@/data/seed";
import { buildRules, fmt, singleLimit } from "@/lib/rules";
import { useStore } from "@/lib/store";
import { Avatar, cn } from "@/components/ui";

const all = people.map((p) => p.id);

function Stack({ ids }: { ids: PersonId[] }) {
  const { held } = useStore();
  return (
    <span className="flex gap-0.5" aria-label={ids.map(firstName).join(", ")}>
      {ids.map((id) => (
        <Avatar key={id} id={id} size={24} held={held.includes(id)} />
      ))}
    </span>
  );
}

function Step({ title, ids, className }: { title: string; ids?: PersonId[]; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-center", className)}>
      <span className="text-xs font-medium">{title}</span>
      {ids && <Stack ids={ids} />}
    </div>
  );
}

const Arrow = () => <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />;

function Released() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-ok-soft px-3 py-1.5 text-xs font-medium text-ok-ink">
      <Banknote className="h-3.5 w-3.5" /> Bank releases payment
    </div>
  );
}

export function PaymentWorkflow({ diff = false }: { diff?: boolean }) {
  const { version, held } = useStore();
  const limit = singleLimit(buildRules(version)) ?? 25_000;
  const was = diff && limit !== 10_000;
  const edge = (
    <>
      {was && <span className="mr-1 text-muted line-through">10,000</span>}
      <span className={cn(was && "rounded bg-accent-soft px-1 text-accent-ink")}>{fmt(limit)}</span>
    </>
  );
  const rashidHeld = held.includes("rashid");

  return (
    <section aria-label="Payment workflow" className="space-y-3">
      <div className="rounded-card border border-line bg-panel/40 p-4">
        <p className="mb-3 text-xs font-medium text-muted">AED 1 to {edge}</p>
        <div className="flex items-center gap-2">
          <Step title="Someone starts it" ids={all} />
          <Arrow />
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-line-strong p-2">
            <Step title="Khalifa approves alone" ids={["khalifa"]} className="flex-1" />
            <span className="text-xs font-medium text-muted">or</span>
            <Step title="Any 2 of 3 approve" ids={all} className="flex-1" />
          </div>
          <Arrow />
          <Released />
        </div>
      </div>

      <div className="rounded-card border border-line bg-panel/40 p-4">
        <p className="mb-3 text-xs font-medium text-muted">Above AED {edge}</p>
        <div className="flex items-center gap-2">
          <Step title="Someone starts it" ids={all} />
          <Arrow />
          <Step title="1st approval" ids={all} className="flex-1" />
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-xs text-sub" title="The second approver must be a different signatory">
            <UserRoundX className="h-3 w-3" /> not the same person
          </span>
          <Step title="2nd approval" ids={all} className="flex-1" />
          <Arrow />
          <Released />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-card border border-dashed border-line p-4 text-sm text-muted">
        <Lock className="h-4 w-4" /> Other currencies: not set up. The mandate covers AED only.
      </div>

      {rashidHeld && <p className="text-xs text-sub">Rashid shows dashed: he&apos;s in the flow but can&apos;t approve until his EID clears.</p>}

      <details>
        <summary className="cursor-pointer text-xs text-muted">Technical details</summary>
        <ul className="mt-2 space-y-1 tnum text-xs text-muted">
          <li>WF-AED-LOW · 1 to {fmt(limit)} · rules R2 (single) | R1 (any 2)</li>
          <li>WF-AED-HIGH · above {fmt(limit)} · rule R1 · maker-checker distinct users</li>
          <li>Other currencies · no workflow created</li>
        </ul>
      </details>
    </section>
  );
}
