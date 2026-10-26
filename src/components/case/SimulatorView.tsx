"use client";

import { useState } from "react";
import { Check, FlaskConical, X } from "lucide-react";
import { PersonId, firstName, people } from "@/data/seed";
import { Outcome, boundaryTests, evaluate } from "@/lib/rules";
import { hasEvent, rulesFor, useStore } from "@/lib/store";
import { Avatar, Card, Empty, Pill, SectionTitle, Tone, cn } from "@/components/ui";

const outcomeUi: Record<Outcome, { label: string; tone: Tone }> = {
  allowed: { label: "Allowed", tone: "ok" },
  blocked: { label: "Blocked", tone: "bad" },
  held: { label: "EFR pending", tone: "warn" },
  not_covered: { label: "Not covered by mandate", tone: "neutral" },
};

export function SimulatorView() {
  const { state, version, held } = useStore();
  const [v, setV] = useState<1 | 2 | null>(null);
  const [initiator, setInitiator] = useState<PersonId>("khalifa");
  const [approvers, setApprovers] = useState<PersonId[]>([]);
  const [amount, setAmount] = useState(10_001);
  const [currency, setCurrency] = useState("AED");
  if (!hasEvent(state, "plan-build")) return <Empty icon={FlaskConical} title="Nothing to test yet" body="Once there's a plan, try any payment here. Results come from the rules engine, not from the agent." />;
  const ver = v ?? version;
  const rules = rulesFor(ver);
  const result = evaluate({ initiator, approvers, amount, currency }, rules, held);
  const tests = boundaryTests(rules, held);
  const toggle = (id: PersonId) => setApprovers((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <div className="max-w-5xl space-y-8">
      <section>
        <SectionTitle
          aside={
            version === 2 && (
              <div className="flex rounded-lg border border-line p-0.5 text-xs">
                {([1, 2] as const).map((n) => (
                  <button key={n} onClick={() => setV(n)} className={cn("rounded-md px-2.5 py-1", ver === n ? "bg-panel font-medium" : "text-muted hover:text-ink")}>
                    Rules v{n}
                  </button>
                ))}
              </div>
            )
          }
        >
          Try a payment
        </SectionTitle>
        <Card className="grid grid-cols-[1.3fr_1fr] divide-x divide-line">
          <div className="space-y-5 p-5">
            <div>
              <p className="mb-2 text-xs text-muted">Started by</p>
              <div className="flex gap-2">
                {people.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setInitiator(p.id);
                      setApprovers((a) => a.filter((x) => x !== p.id));
                    }}
                    className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors", initiator === p.id ? "border-ink bg-white" : "border-line text-sub hover:border-sub")}
                  >
                    <Avatar id={p.id} size={22} held={held.includes(p.id)} /> {firstName(p.id)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted">Also approved by</p>
              <div className="flex gap-2">
                {people
                  .filter((p) => p.id !== initiator)
                  .map((p) => (
                    <label key={p.id} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm", approvers.includes(p.id) ? "border-ink" : "border-line text-sub")}>
                      <input type="checkbox" className="accent-[#1E5BD8]" checked={approvers.includes(p.id)} onChange={() => toggle(p.id)} />
                      {firstName(p.id)}
                    </label>
                  ))}
              </div>
            </div>
            <div className="flex gap-3">
              <label className="block">
                <span className="mb-2 block text-xs text-muted">Amount</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="tnum h-9 w-40 rounded-lg border border-line px-3 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs text-muted">Currency</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 rounded-lg border border-line bg-white px-2 text-sm outline-none focus:border-accent">
                  <option>AED</option>
                  <option>USD</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex flex-col justify-center p-5" aria-live="polite">
            <p className="text-xs text-muted">Rules engine says</p>
            <Pill tone={outcomeUi[result.outcome].tone} className="mt-2 self-start px-2.5 py-1 text-sm">
              {outcomeUi[result.outcome].label}
            </Pill>
            <p className="mt-3 text-sm text-sub">{result.reason}</p>
          </div>
        </Card>
      </section>

      <section>
        <SectionTitle aside={<p className="text-xs text-muted">Run before every submit</p>}>Boundary tests, rules v{ver}</SectionTitle>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/60 text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5 font-medium">Expected</th>
                <th className="px-4 py-2.5 font-medium">Got</th>
                <th className="px-4 py-2.5 font-medium">Why</th>
                <th className="w-16 px-4 py-2.5 font-medium">Pass</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} className="border-b border-line last:border-0">
                  <td className="tnum px-4 py-2.5">{t.label}</td>
                  <td className="px-4 py-2.5 text-sub">{outcomeUi[t.expected].label}</td>
                  <td className="px-4 py-2.5">
                    <Pill tone={outcomeUi[t.actual.outcome].tone}>{outcomeUi[t.actual.outcome].label}</Pill>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-sub">{t.actual.reason}</td>
                  <td className="px-4 py-2.5">{t.pass ? <Check className="h-4 w-4 text-ok" /> : <X className="h-4 w-4 text-bad" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
