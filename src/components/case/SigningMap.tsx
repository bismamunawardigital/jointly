"use client";

import { useEffect, useId, useState } from "react";
import { Building2, Check, KeyRound, X } from "lucide-react";
import { PersonId, business, firstName, people } from "@/data/seed";
import { boundaryTests, buildRules, evaluate, fmt, outcomeLabel, singleLimit } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { Avatar, cn } from "@/components/ui";

const pos = (n: number) => {
  const v = n <= 10_000 ? (n / 10_000) * 40 : n <= 25_000 ? 40 + ((n - 10_000) / 15_000) * 20 : 60 + (Math.min(n - 25_000, 25_000) / 25_000) * 40;
  return `${v}%`;
};
type Combo = { key: string; ids: PersonId[] };
const pairs: Combo[] = ([["mohammed", "khalifa"], ["mohammed", "rashid"], ["khalifa", "rashid"]] as PersonId[][]).map((ids) => ({ key: ids.join("+"), ids }));
const solo: Combo = { key: "khalifa", ids: ["khalifa"] };
const names = (ids: PersonId[]) => ids.map(firstName).join(" and ");

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-xs text-sub">{children}</span>;
}

export function SigningMap({ compact = false, part = "all" }: { compact?: boolean; part?: "all" | "people" }) {
  const { state, version, held } = useStore();
  const rules = buildRules(version);
  const limit = singleLimit(rules) ?? 25_000;
  const [edge, setEdge] = useState(version === 2 ? 10_000 : limit);
  useEffect(() => {
    const t = setTimeout(() => setEdge(limit), 150);
    return () => clearTimeout(t);
  }, [limit]);
  const [hover, setHover] = useState<{ person?: PersonId; combo?: string } | null>(null);
  const [amount, setAmount] = useState(30_000);
  const [initiator, setInitiator] = useState<PersonId>("mohammed");
  const [tip, setTip] = useState(false);
  const descId = useId();
  const showPeople = part === "people" || !compact;
  const showLadder = part !== "people";
  const showTester = !compact && part !== "people";
  if (!hasEvent(state, "plan-build")) return null;

  const isHeld = (c: Combo) => c.ids.some((i) => held.includes(i));
  const band = amount <= limit ? "A" : "B";
  const allowed = (c: Combo) => c.ids.includes(initiator) && evaluate({ initiator, approvers: c.ids.filter((i) => i !== initiator), amount, currency: "AED" }, rules, held).outcome === "allowed";
  const dimCombo = (c: Combo) => (hover?.person ? !c.ids.includes(hover.person) : hover?.combo ? hover.combo !== c.key : false);
  const dimPerson = (id: PersonId) => (hover?.combo ? !hover.combo.split("+").includes(id) : hover?.person ? hover.person !== id : false);
  const bands = [
    { id: "A", label: `AED 1 to ${fmt(limit)}`, combos: [solo, ...pairs] },
    { id: "B", label: `Above AED ${fmt(limit)}`, combos: pairs },
  ];
  const rashidHeld = held.includes("rashid");
  const sentence = `Khalifa can approve up to AED ${fmt(limit)} alone. Above that, any two must approve.${rashidHeld ? " Rashid joins when his ID clears." : ""}`;
  const ok = bands.find((b) => b.id === band)!.combos.filter(allowed);
  const initHeld = held.includes(initiator);
  const test = initHeld
    ? `${firstName(initiator)} can't sign until his EID clears.`
    : ok.some((c) => c.ids.length === 1)
      ? `${firstName(initiator)} can approve AED ${fmt(amount)} alone.`
      : ok.length
        ? `${firstName(initiator)} needs ${ok.map((c) => firstName(c.ids.find((i) => i !== initiator)!)).join(" or ")} to approve AED ${fmt(amount)}.`
        : `Nobody can approve this with ${firstName(initiator)} today.`;
  const heldNote = !initHeld && rashidHeld ? " Rashid can't yet, his EID is on hold." : "";
  const desc = bands.map((b) => `${b.label}: ${b.combos.map((c) => `${names(c.ids)}${c.ids.length === 1 ? " alone" : " together"}${isHeld(c) ? " (not available until Rashid's EID clears)" : ""}`).join(", ")}.`).join(" ");
  const tests = boundaryTests(rules, held);
  const fromLetter = version === 2;
  const showGhost = fromLetter && !hasEvent(state, "rel-mohammed");

  const token = (c: Combo, b: string) => {
    const h = isHeld(c);
    const lit = !compact && b === band && allowed(c);
    const label = `${names(c.ids)}${c.ids.length === 1 ? " alone" : " together"}${h ? ". Not available until Rashid's EID clears" : ""}`;
    return (
      <button
        key={c.key}
        type="button"
        title={h ? "Not available until Rashid's EID clears" : label}
        aria-label={label}
        onMouseEnter={() => setHover({ combo: c.key })}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover({ combo: c.key })}
        onBlur={() => setHover(null)}
        className={cn(
          "relative z-20 inline-flex items-center rounded-full border bg-surface px-1.5 py-1 transition-[opacity,box-shadow] duration-150",
          lit ? "border-ok ring-2 ring-ok/30" : "border-line",
          h && "border-dashed border-held opacity-70",
          dimCombo(c) && "opacity-35",
        )}
      >
        {c.ids.map((id, i) => (
          <span key={id} className={cn(i > 0 && "ring-link -ml-2")} style={{ "--ring-from": "8px" } as React.CSSProperties}>
            <Avatar id={id} size={32} held={held.includes(id)} />
          </span>
        ))}
        {c.ids.length === 1 && <span className="ml-1.5 pr-1 text-xs text-sub">alone</span>}
      </button>
    );
  };

  return (
    <section className={cn("rounded-card border border-line bg-surface", compact ? "p-5 pt-6" : "p-6")} aria-label="Signing map" aria-describedby={descId}>
      <p id={descId} className="sr-only">
        {desc} {sentence}
      </p>
      {showPeople && (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-sm font-medium">
          <Building2 className="h-4 w-4 text-muted" aria-hidden /> {business.name}
        </div>
        <svg viewBox="0 0 300 28" preserveAspectRatio="none" className="h-7 w-2/3" aria-hidden>
          {[50, 150, 250].map((x) => (
            <path key={x} d={`M150 0 C150 14, ${x} 14, ${x} 28`} fill="none" className="stroke-line-strong" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="grid w-2/3 grid-cols-3">
          {people.map((p) => {
            const h = held.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setHover({ person: p.id })}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover({ person: p.id })}
                onBlur={() => setHover(null)}
                className={cn("flex flex-col items-center gap-1.5 rounded-xl p-2 text-center transition-opacity duration-150", h && "grayscale", dimPerson(p.id) && "opacity-30")}
              >
                <span className="relative">
                  <Avatar id={p.id} size={compact ? 40 : 56} held={h} />
                  {p.id === "mohammed" && (
                    <span title="Already has a login" className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface">
                      <KeyRound className="h-3 w-3 text-muted" aria-label="Existing login" />
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium">{firstName(p.id)}</span>
                {p.id === "khalifa" ? (
                  <span className="flex flex-wrap justify-center gap-1">
                    <Badge>Solo up to AED {fmt(limit)}</Badge>
                    <Badge>Joint above</Badge>
                  </span>
                ) : (
                  <Badge>Joint signer</Badge>
                )}
                {p.id === "khalifa" && showGhost && <span className="text-xs text-muted line-through">was 10,000</span>}
                {h && <span className="rounded-full bg-held-soft px-2 py-0.5 text-xs font-medium text-held">On hold · EID expired</span>}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {showLadder && (
      <>
      <div className="relative mt-10">
        <div className="flex min-h-[112px] overflow-hidden rounded-xl bg-panel">
          {bands.map((b) => (
            <div
              key={b.id}
              className={cn("flex flex-col gap-2 p-3 transition-[width] duration-700 ease-out", b.id === "A" ? "border-r border-dashed border-line-strong bg-surface" : "flex-1 bg-panel/50")}
              style={b.id === "A" ? { width: pos(edge) } : undefined}
            >
              <p className="text-xs font-medium text-sub">
                {b.id === "A" && showGhost ? (
                  <>
                    AED 1 to <s className="font-normal text-muted">10,000</s> {fmt(limit)}
                  </>
                ) : (
                  b.label
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">{b.combos.map((c) => token(c, b.id))}</div>
            </div>
          ))}
        </div>
        {!compact && (
          <span className="pointer-events-none absolute -inset-y-1 z-10 w-0.5 rounded bg-ink transition-[left] duration-150" style={{ left: pos(amount) }} aria-hidden />
        )}
        <button
          type="button"
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          onFocus={() => setTip(true)}
          onBlur={() => setTip(false)}
          className="absolute -top-8 -translate-x-1/2 rounded-full border border-line bg-surface px-2 py-0.5 text-xs font-medium transition-[left] duration-700 ease-out"
          style={{ left: pos(edge) }}
        >
          AED {fmt(limit)}
        </button>
        {tip && (
          <div className="absolute top-5 z-20 w-56 -translate-x-1/2 rounded-xl border border-line bg-surface p-3 shadow-lg" style={{ left: pos(edge) }} role="tooltip">
            <p className="text-xs font-medium">Source: {fromLetter ? "2023 amendment letter" : "2019 mandate"}</p>
            {fromLetter && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/scans/svs-amd-2023.png" width={1100} height={380} loading="lazy" decoding="async" alt="2023 amendment letter" className="mt-2 h-16 w-full rounded border border-line object-cover" />
            )}
            {!fromLetter && hasEvent(state, "mandate-letter") && <p className="mt-1 text-xs text-sub">A 2023 letter may change this. Sara checks it.</p>}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between text-xs text-muted">
        <span>AED 0</span>
        <span>No limit</span>
      </div>

      <p className={cn("mt-4 font-display leading-snug", compact ? "text-lg" : "text-xl")}>{sentence}</p>
      </>
      )}

      {showTester && (
        <>
          <div className="mt-5 flex items-center gap-5 rounded-xl bg-panel/60 px-4 py-3">
            <span className="text-xs font-medium text-muted">Test a payment</span>
            <div className="flex gap-1" role="group" aria-label="Who starts the payment">
              {people.map((p) => (
                <button key={p.id} type="button" aria-pressed={initiator === p.id} aria-label={`${firstName(p.id)} starts it`} onClick={() => setInitiator(p.id)} className={cn("rounded-full p-0.5 transition-opacity", initiator === p.id ? "ring-2 ring-ink" : "opacity-50 hover:opacity-100")}>
                  <Avatar id={p.id} size={28} held={held.includes(p.id)} />
                </button>
              ))}
            </div>
            <input type="range" min={500} max={50_000} step={500} value={amount} onChange={(e) => setAmount(Number(e.target.value))} aria-label="Payment amount in AED" className="flex-1 accent-ink" />
            <span className="tnum w-28 text-right text-sm font-medium">AED {fmt(amount)}</span>
          </div>
          <p className="mt-2 text-sm text-sub" aria-live="polite">
            {test}
            {heldNote}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-muted">
              Boundary tests: {tests.filter((t) => t.pass).length} of {tests.length} pass
            </summary>
            <ul className="mt-2 space-y-1 text-sm">
              {tests.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  {t.pass ? <Check className="h-3.5 w-3.5 text-ok" /> : <X className="h-3.5 w-3.5 text-bad" />} {t.label} → {outcomeLabel[t.expected]}
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </section>
  );
}
