"use client";

import { useState } from "react";
import { Check, MessageSquare, Rocket, TriangleAlert, X } from "lucide-react";
import { PersonId, business, firstName, people } from "@/data/seed";
import { releaseEligibility } from "@/lib/rules";
import { customerMessages, eventById } from "@/lib/script";
import { progressFor } from "@/lib/derive";
import { hasEvent, rulesFor, useStore } from "@/lib/store";
import { useTourTarget } from "@/components/Tour";
import { AssumptionChip, Avatar, Button, Card, Empty, Pill, cn } from "@/components/ui";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const mins = (t: string) => {
  const [d, hm] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return days.indexOf(d) * 1440 + h * 60 + m;
};

function Rings({ ids, size = 40 }: { ids: PersonId[]; size?: number }) {
  return (
    <span className="flex" aria-label={ids.map(firstName).join(" and ")}>
      {ids.map((id, i) => (
        <span key={id} className={cn(i > 0 && "ring-link -ml-3")} style={{ "--ring-from": "12px" } as React.CSSProperties}>
          <Avatar id={id} size={size} />
        </span>
      ))}
    </span>
  );
}

function Undo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-bad-soft px-1.5 py-0.5 text-[11px] font-medium text-bad-ink">
      <TriangleAlert className="h-3 w-3" /> {children}
    </span>
  );
}

export function ReleaseView() {
  const { state, dispatch, version, held } = useStore();
  const tour3 = useTourTarget(2);
  const [confirming, setConfirming] = useState(false);
  const [confirmingR, setConfirmingR] = useState(false);
  const [preview, setPreview] = useState(false);
  if (!hasEvent(state, "ex-readback"))
    return <Empty icon={Rocket} title="Not set up yet" body="After Sara approves all 4 stages, the agent sets them up, checks them and works out who can go live." />;
  const elig = releaseEligibility(rulesFor(version), held);
  const sent = customerMessages.filter((m) => hasEvent(state, m.afterEvent));
  const pending = customerMessages.filter((m) => m.afterEvent.startsWith("rel-"));
  const msgs = sent.length ? sent : pending;
  const live = state.phase === "live";
  const released = hasEvent(state, "rel-mohammed");
  const firstLogin = hasEvent(state, "rel-mohammed-login") ? mins(eventById("rel-mohammed-login").time) - mins(eventById("intake-forms").time) : 0;
  const sentence = state.phase === "rashid_ready" ? "Rashid's EID is renewed. Release Rashid?" : released ? "Mohammed and Khalifa are live. Rashid joins after his EID." : "Mohammed and Khalifa can approve together. They can go live today.";

  return (
    <div className="max-w-5xl space-y-5">
      {live ? (
        <Card className="flex animate-enter items-center gap-5 p-6">
          <Rings ids={people.map((p) => p.id)} size={48} />
          <div>
            <p className="font-display text-2xl">{business.name} is live</p>
            <p className="mt-1 text-sm text-sub">Form to first login {Math.floor(firstLogin / 60)}h {firstLogin % 60}m</p>
          </div>
        </Card>
      ) : (
        <section {...tour3}>
          <Card className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="rounded-full p-1 ring-2 ring-ok/40">
                  <Rings ids={["mohammed", "khalifa"]} />
                </span>
                <span className={cn(held.includes("rashid") && "opacity-60")}>
                  <Avatar id="rashid" size={40} held={held.includes("rashid")} />
                </span>
              </div>
              <div className="flex-1">
                <p className="font-display text-xl leading-snug">{sentence}</p>
                <div className="mt-2">
                  <AssumptionChip>partial release, validate with bank</AssumptionChip>
                </div>
              </div>
            </div>
            {state.phase === "executed" && (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                {confirming ? (
                  <>
                    <Undo>Can&apos;t be undone</Undo>
                    <span className="text-sm text-sub">Sends {pending.length} messages ·</span>
                    <button onClick={() => setPreview(true)} className="text-sm text-accent-ink underline-offset-2 hover:underline">
                      Preview
                    </button>
                    <span className="flex-1" />
                    <Button variant="ghost" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => dispatch({ type: "release" })}>
                      Yes, release them
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" disabled={!elig.eligible} onClick={() => setConfirming(true)}>
                      Release Mohammed and Khalifa
                    </Button>
                    <Button variant="ghost" onClick={() => setPreview(true)}>
                      <MessageSquare className="h-3.5 w-3.5" /> Preview {pending.length} messages
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
        </section>
      )}

      <div className="grid grid-cols-3 gap-4">
        {people.map((p) => {
          const h = held.includes(p.id);
          const rashidDecision = p.id === "rashid" && state.phase === "rashid_ready";
          return (
            <Card key={p.id} className={cn("p-4", rashidDecision && "border-warn")}>
              <div className="flex items-center gap-2.5">
                <Avatar id={p.id} held={h} />
                <p className="text-sm font-medium">{firstName(p.id)}</p>
                {h && <Pill tone="neutral">On hold · waiting for EID</Pill>}
              </div>
              <ol className="mt-3 space-y-2">
                {progressFor(state, p.id).map((t) => (
                  <li key={t.label} className="flex items-start gap-2">
                    <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", t.done ? "border-ok bg-ok text-onaccent" : "border-line")}>
                      {t.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    <p className={cn("text-sm", t.done ? "text-ink" : "text-muted")}>
                      {t.label} {t.time && <span className="tnum text-xs text-muted">{t.time}</span>}
                    </p>
                  </li>
                ))}
              </ol>
              {rashidDecision && (
                <div className="mt-4 border-t border-line pt-3">
                  {confirmingR ? (
                    <div className="space-y-2">
                      <p className="text-xs text-sub">
                        <Undo>Can&apos;t be undone</Undo> Switches him on and texts him the link.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => dispatch({ type: "releaseRashid" })}>
                          Yes, release Rashid
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmingR(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => setConfirmingR(true)}>
                      Release Rashid
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {released && (
        <button onClick={() => setPreview(true)} className="flex items-center gap-1.5 text-sm text-sub hover:text-ink">
          <MessageSquare className="h-3.5 w-3.5" /> See {sent.length} messages sent
        </button>
      )}

      {preview && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/20" onClick={() => setPreview(false)} aria-hidden />
          <aside className="fixed inset-y-0 right-0 z-50 w-[380px] animate-enter overflow-y-auto border-l border-line bg-surface p-6 shadow-lg" role="dialog" aria-label="Customer messages">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl">{sent.length ? "Messages sent" : "Messages to send"}</p>
              <button onClick={() => setPreview(false)} aria-label="Close" className="rounded-lg p-1 text-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">The agent drafts every message</p>
            <div className="mt-5 space-y-4 rounded-[28px] border border-line bg-panel p-4">
              {msgs.map((m) => (
                <div key={m.afterEvent}>
                  <p className="text-[11px] text-muted">
                    {m.channel} to {m.to}
                  </p>
                  <p className="mt-1 max-w-[90%] rounded-2xl rounded-tl-sm bg-surface px-3 py-2 text-sm shadow-sm">{m.text}</p>
                  <p className="mt-1 text-[11px] text-sub">{m.approval === "auto" ? "Pre-approved template, sent automatically" : "Approved by Sara M. with the release"}</p>
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[11px] text-muted">Technical details</summary>
                    <p className="mt-1 font-mono text-[11px] text-muted">template {m.template}</p>
                  </details>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
