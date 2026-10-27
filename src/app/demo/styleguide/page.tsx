"use client";

import { useState } from "react";
import { AgentMark, Avatar, Button, Card, Pill, ScreenHead, Tween } from "@/components/ui";
import { Logo } from "@/components/Shell";

const swatches: [string, string, string][] = [
  ["Ink", "ink", "Text and Sara"],
  ["Canvas", "canvas", "Page background"],
  ["Surface", "surface", "Cards"],
  ["Border", "line", "Hairlines"],
  ["Saffron", "brand", "Logo, hero, active step"],
  ["Ink blue", "accent", "Primary action"],
  ["Verified", "ok", "Checked by rules"],
  ["Needs you", "warn", "A person decides"],
  ["Blocked", "bad", "Can't go ahead"],
  ["Held", "held", "Waiting on something"],
];
const people: [string, "mohammed" | "khalifa" | "rashid"][] = [
  ["Mohammed · teal", "mohammed"],
  ["Khalifa · indigo", "khalifa"],
  ["Rashid · coral", "rashid"],
];
const scale = [12, 14, 16, 20, 28, 40, 56, 72];

function Rings({ a, b }: { a: string; b: string }) {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" aria-hidden>
      <circle cx="14" cy="14" r="11" fill="none" stroke={`rgb(var(--p-${a}))`} strokeWidth="3" />
      <circle className="ring-link" cx="30" cy="14" r="11" fill="none" stroke={`rgb(var(--p-${b}))`} strokeWidth="3" />
    </svg>
  );
}

function Board({ theme }: { theme: "light" | "dark" }) {
  const [amount, setAmount] = useState(10000);
  return (
    <div data-theme={theme} className="space-y-8 rounded-card border border-line bg-canvas p-6 text-ink">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-xs text-muted">{theme === "light" ? "Light" : "Dark"}</span>
      </div>

      <section>
        <h2 className="mb-3 text-xs font-medium text-muted">Colour</h2>
        <div className="grid grid-cols-5 gap-3">
          {swatches.map(([name, token, use]) => (
            <div key={token}>
              <div className="h-12 rounded-xl border border-line" style={{ background: `rgb(var(--${token}))` }} />
              <p className="mt-1.5 text-xs font-medium">{name}</p>
              <p className="text-[11px] text-muted">{use}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium text-muted">People keep one colour everywhere</h2>
        <div className="flex flex-wrap items-center gap-5">
          {people.map(([label, id]) => (
            <div key={id} className="flex items-center gap-2">
              <Avatar id={id} size={36} />
              <span className="text-sm">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Avatar id="rashid" size={36} held />
            <span className="text-sm">Held</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-person-sara bg-person-sara/10 text-xs font-semibold text-person-sara">SM</span>
            <span className="text-sm">Sara · ink</span>
          </div>
          <div className="flex items-center gap-2">
            <AgentMark size={36} />
            <span className="text-sm">Agent · graphite</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2"><Rings a="mohammed" b="khalifa" /><span className="text-xs text-sub">Mohammed + Khalifa</span></div>
          <div className="flex items-center gap-2"><Rings a="khalifa" b="rashid" /><span className="text-xs text-sub">Khalifa + Rashid</span></div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium text-muted">Type</h2>
        <div className="space-y-1">
          {scale.map((s) => (
            <div key={s} className="flex items-baseline gap-4">
              <span className="tnum w-8 text-[11px] text-muted">{s}</span>
              <span className={s >= 28 ? "font-display leading-none" : ""} style={{ fontSize: s }}>
                {s >= 28 ? "2 of 3 can go live" : "Khalifa can approve alone up to AED 25,000"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium text-muted">Buttons and status</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary">Approve stage 1</Button>
          <Button>Test a payment</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Return to agent</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="ok">Verified</Pill>
          <Pill tone="warn">Needs you</Pill>
          <Pill tone="bad">Blocked</Pill>
          <Pill tone="held">Held</Pill>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium text-muted">Card</h2>
        <Card className="p-6">
          <ScreenHead eyebrow="Creekside General Trading LLC" title="2 of 3 signatories can go live today." />
          <p className="mt-4 text-sm text-sub">
            Khalifa&apos;s single limit:{" "}
            <span className="font-medium text-ink">
              <Tween value={amount} prefix="AED " />
            </span>
          </p>
          <Button size="sm" className="mt-3" onClick={() => setAmount((a) => (a === 10000 ? 25000 : 10000))}>
            Play the diff
          </Button>
        </Card>
      </section>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1180px] px-10 py-10">
        <ScreenHead eyebrow="Jointly · design system" title="Gulf private bank meets modern ops tool." />
        <div className="mt-8 grid grid-cols-2 gap-6">
          <Board theme="light" />
          <Board theme="dark" />
        </div>
      </div>
    </div>
  );
}
