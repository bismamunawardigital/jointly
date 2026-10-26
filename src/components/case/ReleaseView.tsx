"use client";

import { useState } from "react";
import { Check, Lock, MessageSquare, Rocket, ScanFace, Smartphone, Truck } from "lucide-react";
import { firstName, people } from "@/data/seed";
import { releaseEligibility } from "@/lib/rules";
import { customerMessages } from "@/lib/script";
import { progressFor } from "@/lib/derive";
import { hasEvent, rulesFor, useStore } from "@/lib/store";
import { useTourTarget } from "@/components/Tour";
import { AssumptionChip, Avatar, Button, Card, Empty, Pill, SectionTitle, cn } from "@/components/ui";

export function ReleaseView() {
  const { state, dispatch, version, held } = useStore();
  const tour3 = useTourTarget(2);
  const tour4 = useTourTarget(3);
  const [confirming, setConfirming] = useState(false);
  if (!hasEvent(state, "ex-readback"))
    return <Empty icon={Rocket} title="Not set up yet" body="After Sara approves all 4 stages, the agent sets them up, reads them back and checks who can be released." />;
  const elig = releaseEligibility(rulesFor(version), held);
  const joint = elig.combos.find((c) => c.needed > 1)!;
  const sent = customerMessages.filter((m) => hasEvent(state, m.afterEvent));

  return (
    <div className="max-w-5xl space-y-8">
      <section {...tour3}>
        <SectionTitle aside={<AssumptionChip>partial release, validate with bank</AssumptionChip>}>Can we go live without Rashid?</SectionTitle>
        <Card className="p-5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              {people.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-1.5">
                  <Avatar id={p.id} size={40} held={held.includes(p.id)} />
                  <span className={cn("text-xs", held.includes(p.id) ? "text-muted" : "text-ink")}>{firstName(p.id)}</span>
                  <Pill tone={held.includes(p.id) ? "warn" : "ok"}>{held.includes(p.id) ? "Held" : "Ready"}</Pill>
                </div>
              ))}
            </div>
            <div className="flex-1 border-l border-line pl-8">
              <p className="text-xs text-muted">Rule R1 needs any {joint.needed}. Ready signatories can form:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {joint.groups.map((g) => (
                  <span key={g.join()} className="inline-flex items-center gap-1.5 rounded-lg border border-ok/30 bg-ok-soft px-2.5 py-1 text-sm text-ok-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> {g.map(firstName).join(" + ")}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-medium">{elig.summary}</p>
              <p className="mt-1 text-xs text-muted">Checked by the rules engine. If Khalifa were also held, Mohammed alone couldn&apos;t sign anything. If the mandate needed Rashid to co-sign any payment, release would be blocked too, and everyone would wait for him.</p>
            </div>
          </div>
          {state.phase === "executed" && (
            <div className="mt-5 border-t border-line pt-4">
              {confirming ? (
                <div className="space-y-3">
                  <p className="text-sm text-sub">This texts Mohammed and Khalifa that they can start, and tells them Rashid joins later. Messages can&apos;t be unsent.</p>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => dispatch({ type: "release" })}>
                      Yes, release them
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="primary" disabled={!elig.eligible} onClick={() => setConfirming(true)}>
                  Release Mohammed and Khalifa
                </Button>
              )}
            </div>
          )}
        </Card>
      </section>

      <section>
        <SectionTitle>Each person, tracked separately</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {people.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-2.5">
                <Avatar id={p.id} held={held.includes(p.id)} />
                <p className="text-sm font-medium">{firstName(p.id)}</p>
                {p.digitalUser.existing && <Pill tone="neutral" dot={false}>Existing user</Pill>}
              </div>
              <ol className="mt-4 space-y-3">
                {progressFor(state, p.id).map((t) => (
                  <li key={t.label} className="flex gap-2.5">
                    <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", t.done ? "border-ok bg-ok text-onaccent" : "border-line")}>
                      {t.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    <div className="text-sm">
                      <p className={t.done ? "text-ink" : "text-muted"}>
                        {t.label} {t.time && <span className="tnum text-xs text-muted">{t.time}</span>}
                      </p>
                      {t.note && <p className="text-xs text-muted">{t.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      <section {...tour4}>
        <SectionTitle aside={<AssumptionChip>digital activation, subject to bank security approval</AssumptionChip>}>How credentials reach people</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Before</p>
              <Pill tone="neutral">Today</Pill>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-sub">
              <li className="flex gap-2.5"><Lock className="h-4 w-4 shrink-0 text-muted" /> Bank prints a PIN mailer per user</li>
              <li className="flex gap-2.5"><Truck className="h-4 w-4 shrink-0 text-muted" /> Courier delivers it to each signatory</li>
              <li className="flex gap-2.5"><Smartphone className="h-4 w-4 shrink-0 text-muted" /> User logs in and changes the password</li>
            </ol>
            <p className="mt-4 text-xs text-muted">Usually days, even after setup is done.</p>
          </Card>
          <Card className="border-accent/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">After</p>
              <Pill tone="accent">Proposed</Pill>
            </div>
            <ol className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5"><MessageSquare className="h-4 w-4 shrink-0 text-accent" /> Secure link by SMS to the mobile on file</li>
              <li className="flex gap-2.5"><ScanFace className="h-4 w-4 shrink-0 text-accent" /> Person verifies their own EID with a face check</li>
              <li className="flex gap-2.5"><Lock className="h-4 w-4 shrink-0 text-accent" /> They set their own login. No password is made, seen or sent by the agent</li>
            </ol>
            <p className="mt-4 text-xs text-muted">Mohammed skips this. He already has a login, so his is just linked.</p>
          </Card>
        </div>
      </section>

      {sent.length > 0 && (
        <section>
          <SectionTitle aside={<p className="text-xs text-muted">Approved templates, filled by the agent</p>}>Messages to customers</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {sent.map((m) => (
              <Card key={m.afterEvent} className="p-4">
                <p className="text-xs text-muted">
                  {m.channel} to {m.to}
                </p>
                <p className="mt-2 rounded-lg rounded-tl-sm bg-panel px-3 py-2 text-sm">{m.text}</p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
