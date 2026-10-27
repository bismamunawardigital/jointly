"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, ChevronRight, FlaskConical, Lightbulb, Repeat, ShieldCheck, Undo2, X } from "lucide-react";
import { EvidenceKey, isAgentRead } from "@/data/seed";
import { approvalValid, buildStages, diffStage } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { useTourTarget } from "@/components/Tour";
import { BasisTag, Button, Card, Empty, Pill, Proof, cn } from "@/components/ui";


function wordDiff(a: string, b: string) {
  const x = a.split(" "), y = b.split(" ");
  let p = 0;
  while (p < x.length && p < y.length && x[p] === y[p]) p++;
  let q = 0;
  while (q < x.length - p && q < y.length - p && x[x.length - 1 - q] === y[y.length - 1 - q]) q++;
  return { pre: x.slice(0, p).join(" "), del: x.slice(p, x.length - q).join(" "), ins: y.slice(p, y.length - q).join(" "), post: x.slice(x.length - q).join(" ") };
}

function Changed({ before, after }: { before: string; after: string }) {
  if (before === after) return <>{after}</>;
  const d = wordDiff(before, after);
  return (
    <>
      {d.pre && `${d.pre} `}
      {d.del && <del className="rounded bg-bad-soft px-0.5 text-bad-ink">{d.del}</del>}
      {d.del && d.ins && " "}
      {d.ins && <ins className="rounded bg-ok-soft px-0.5 font-medium text-ok-ink no-underline">{d.ins}</ins>}
      {d.post && ` ${d.post}`}
    </>
  );
}

function coverage(stageId: number, version: 1 | 2) {
  if (stageId === 1) return { label: "Finacle records", n: 3, of: 3 };
  if (stageId === 2) return { label: "SVS signatories", n: 3, of: 3 };
  return { label: "SVS documents confirmed", n: version === 1 ? 1 : 2, of: 2 };
}

function Coverage({ n, of, label }: { n: number; of: number; label: string }) {
  const full = n === of;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px]", full ? "text-ok-ink" : "text-warn-ink")} title={`${label}: ${n} of ${of}`}>
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: of }, (_, i) => (
          <span key={i} className={cn("h-1.5 w-3 rounded-full", i < n ? (full ? "bg-ok" : "bg-warn") : "bg-line-strong")} />
        ))}
      </span>
      {label} {n}/{of}
    </span>
  );
}

function ClaimRow({ label, value, sources }: { label: React.ReactNode; value: React.ReactNode; sources: EvidenceKey[] }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4 px-3 py-3">
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-sm">{value}</p>
        <div className="mt-1.5">
          <BasisTag keys={sources} />
        </div>
      </div>
      <div className="space-y-1.5">
        {sources.map((k) => (
          <Proof key={k} k={k} />
        ))}
      </div>
    </li>
  );
}

function ScanCheck({ canAct, onConfirm }: { canAct: boolean; onConfirm: (v: number) => void }) {
  const [value, setValue] = useState("");
  const n = Number(value.replace(/[^0-9.]/g, ""));
  const mismatch = value.trim() !== "" && n > 0 && n !== 25000;
  return (
    <div className="mt-4 rounded-lg border border-warn/30 bg-warn-soft/40 p-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-warn-ink">
        <AlertTriangle className="h-4 w-4 shrink-0" /> A 2023 letter may change Khalifa&apos;s limit. The scan is unclear.
      </p>
      <div className="mt-3 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scans/svs-amd-2023.png" alt="Scan of the 2023 amendment letter. The amount is blurred." className="w-full rounded-md border border-line" />
          <figcaption className="mt-1 text-[11px] text-muted">2023 amendment letter · scan from SVS</figcaption>
        </figure>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-muted">The agent read</p>
            <p className="mt-0.5 font-medium">
              AED 25,000 <span className="text-xs font-normal text-warn-ink">not certain</span>
            </p>
            <p className="mt-1 text-xs text-sub">Plan v1 keeps AED 10,000 until you confirm.</p>
          </div>
          {canAct && (
            <div>
              <label htmlFor="scan-value" className="text-xs text-muted">
                What limit does the letter say? Type it from the image.
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted">AED</span>
                <input id="scan-value" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="25,000" className="h-9 w-32 rounded-lg border border-line bg-surface px-2.5 text-sm outline-none focus:border-accent" />
              </div>
              {mismatch && <p className="mt-1 text-xs text-bad-ink">That doesn&apos;t match the agent&apos;s reading. Return the stage with a note instead.</p>}
              <Button variant="primary" className="mt-2" disabled={n !== 25000} onClick={() => onConfirm(n)}>
                <Check className="h-3.5 w-3.5" /> Confirm and update the plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReviewView() {
  const { state, dispatch, version, setTab } = useStore();
  const tour = useTourTarget(1);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [hint, setHint] = useState(false);
  useEffect(() => setChecked({}), [version]);
  useEffect(() => {
    try {
      setHint(localStorage.getItem("jointly-hint") !== "off");
    } catch {}
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key.toLowerCase() !== "a" || e.ctrlKey || e.metaKey || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (state.phase !== "in_review" && state.phase !== "re_review") return;
      const list = buildStages(version);
      const next = list.find((st, n) => !approvalValid(state.approvals[st.id], st) && list.slice(0, n).every((p) => approvalValid(state.approvals[p.id], p)));
      if (!next || (next.id === 3 && version === 1)) return;
      const needs = next.items.some((it) => it.sources.some(isAgentRead));
      if (needs && !checked[next.id]) return;
      dispatch({ type: "approve", stageId: next.id });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, version, checked, dispatch]);
  if (!hasEvent(state, "submit")) return <Empty icon={ShieldCheck} title="Nothing to review yet" body="The agent sends you all 4 stages at once, so you review in one sitting." />;
  const stages = buildStages(version);
  const v1 = buildStages(1);
  const reviewing = state.phase === "in_review" || state.phase === "re_review";

  return (
    <div className="max-w-4xl space-y-4" {...tour}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <BasisTag keys={["finacle-cif"]} /> came from a system record
          <span className="mx-1 text-line-strong">|</span>
          <BasisTag keys={["svs-man"]} /> the agent read a document, so compare it with the quote
        </div>
        <Pill tone="neutral">Plan v{version}</Pill>
      </div>
      {hint && (
        <div className="flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent-soft/40 px-3 py-2.5 text-sm">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="flex-1 text-sub">
            <span className="font-medium text-ink">Where I&apos;m reliable:</span> anything copied from Finacle, EFR or Admin. <span className="font-medium text-ink">Where to check me:</span> what I read from SVS documents, especially letters and amendments.
          </p>
          <button
            aria-label="Dismiss"
            className="rounded p-0.5 text-muted hover:text-ink"
            onClick={() => {
              setHint(false);
              try {
                localStorage.setItem("jointly-hint", "off");
              } catch {}
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {stages.map((s, i) => {
        const approval = state.approvals[s.id];
        const valid = approvalValid(approval, s);
        const stale = !!approval && !valid;
        const prevOk = stages.slice(0, i).every((p) => approvalValid(state.approvals[p.id], p));
        const changes = version === 2 ? diffStage(v1[i], s) : [];
        const wasReturned = state.returned?.stageId === s.id;
        const canAct = reviewing && !valid && prevOk;
        const canReturn = canAct && version === 1 && s.id === 3;
        const needsCheck = s.items.some((it) => it.sources.some(isAgentRead));
        const cov = coverage(s.id, version);
        const readItems = s.items.filter((it) => it.sources.some(isAgentRead));
        const exactItems = s.items.filter((it) => !it.sources.some(isAgentRead));
        return (
          <Card key={s.id} className={cn("p-5", canAct && "border-line-strong", valid && "bg-panel/30")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">Stage {s.id} of 4</p>
                <h3 className="mt-0.5 text-base font-semibold">{s.title}</h3>
                <div className="mt-1.5">
                  <Coverage {...cov} />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {valid ? (
                  <Pill tone="ok">
                    {state.returned && s.id < 3 ? "Approval kept" : "Approved"} · {approval!.by} {approval!.at}
                  </Pill>
                ) : changes.length ? (
                  <Pill tone="accent">Changed, review the diff</Pill>
                ) : wasReturned && version === 1 ? (
                  <Pill tone="warn">Returned</Pill>
                ) : canAct ? (
                  <Pill tone="warn">Waiting for you</Pill>
                ) : (
                  <Pill tone="neutral">{reviewing ? "Approve the stage above first" : "Waiting"}</Pill>
                )}
                {stale && <p className="text-[11px] text-muted">Earlier approval no longer matches</p>}
              </div>
            </div>

            {changes.length > 0 && !valid ? (
              <ul className="mt-4 divide-y divide-accent/20 rounded-lg border border-accent/30 bg-accent-soft/30">
                {changes.map((c) => (
                  <ClaimRow key={c.key} label={<Changed before={c.beforeLabel} after={c.afterLabel} />} value={<Changed before={c.before} after={c.after} />} sources={c.sources} />
                ))}
                <li className="px-3 py-2 text-xs text-muted">{s.items.length - changes.length} other line{s.items.length - changes.length === 1 ? "" : "s"} unchanged</li>
              </ul>
            ) : (
              !valid && (
                <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                  {readItems.map((it) => (
                    <ClaimRow key={it.key} label={it.label} value={it.value} sources={it.sources} />
                  ))}
                  {exactItems.length > 0 && (
                    <li>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-sm">
                          <ChevronRight className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-90" />
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ok text-onaccent">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                          <span className="font-medium">{exactItems.length} line{exactItems.length === 1 ? "" : "s"} copied exactly from system records</span>
                          <span className="text-xs text-muted">Nothing to interpret. Open to see them.</span>
                        </summary>
                        <ul className="divide-y divide-line border-t border-line">
                          {exactItems.map((it) => (
                            <ClaimRow key={it.key} label={it.label} value={it.value} sources={it.sources} />
                          ))}
                        </ul>
                      </details>
                    </li>
                  )}
                </ul>
              )
            )}

            {s.id === 3 && !valid && (
              version === 1 ? (
                <ScanCheck canAct={canAct && !returning} onConfirm={(v) => dispatch({ type: "confirm", value: v })} />
              ) : (
                <>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-ok-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> 2023 letter checked by you: AED 25,000
                  </p>
                  <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-line bg-panel/60 px-3 py-2.5">
                    <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Make this fix stick?</p>
                      <p className="mt-0.5 text-xs text-sub">The agent proposes: when a scan is unclear, ask the branch for a clean copy before building the plan. A supervisor has to approve it.</p>
                    </div>
                    {state.log.some((e) => e.id === "lesson") ? (
                      <Pill tone="neutral">Sent to supervisor</Pill>
                    ) : (
                      <Button size="sm" onClick={() => dispatch({ type: "lesson" })}>
                        Send to supervisor
                      </Button>
                    )}
                  </div>
                </>
              )
            )}

            {wasReturned && (
              <p className="mt-3 text-xs text-sub">
                <span className="font-medium text-ink">Sara&apos;s note:</span> {state.returned!.note}
              </p>
            )}

            {canAct && !returning && needsCheck && !(s.id === 3 && version === 1) && (
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-sub">
                <input type="checkbox" className="accent-accent" checked={!!checked[s.id]} onChange={(e) => setChecked((c) => ({ ...c, [s.id]: e.target.checked }))} />
                I compared the highlighted words with the agent&apos;s lines
              </label>
            )}
            {canAct && !returning && (
              <div className="mt-3 flex gap-2">
                {!(s.id === 3 && version === 1) && (
                  <Button variant="primary" disabled={needsCheck && !checked[s.id]} onClick={() => dispatch({ type: "approve", stageId: s.id })}>
                    <Check className="h-3.5 w-3.5" /> Approve stage {s.id} · {s.items.length} line{s.items.length === 1 ? "" : "s"}
                    <kbd className="ml-1 rounded border border-onaccent/40 px-1 text-[10px] font-normal opacity-80">A</kbd>
                  </Button>
                )}
                {s.id === 3 && (
                  <Button variant="ghost" onClick={() => setTab("simulator")}>
                    <FlaskConical className="h-3.5 w-3.5" /> Test a payment
                  </Button>
                )}
                {canReturn && (
                  <Button variant="danger" onClick={() => setReturning(true)}>
                    <Undo2 className="h-3.5 w-3.5" /> Return to agent
                  </Button>
                )}
              </div>
            )}
            {canReturn && returning && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs text-muted" htmlFor="return-note">
                  Note for the agent
                </label>
                <textarea id="return-note" placeholder="Tell the agent what to check" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full rounded-lg border border-line p-2.5 text-sm outline-none focus:border-accent" />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    disabled={!note.trim()}
                    onClick={() => {
                      dispatch({ type: "return", note: note.trim() });
                      setReturning(false);
                    }}
                  >
                    Return stage 3
                  </Button>
                  <Button variant="ghost" onClick={() => setReturning(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
