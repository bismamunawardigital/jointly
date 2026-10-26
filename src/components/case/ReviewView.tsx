"use client";

import { useState } from "react";
import { AlertTriangle, Check, FlaskConical, ShieldCheck, Undo2 } from "lucide-react";
import { checker } from "@/data/seed";
import { approvalValid, buildStages, diffStage } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { useTourTarget } from "@/components/Tour";
import { Button, Card, Empty, Pill, Sources, cn } from "@/components/ui";


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

export function ReviewView() {
  const { state, dispatch, version, setTab } = useStore();
  const tour = useTourTarget(1);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");
  if (!hasEvent(state, "submit")) return <Empty icon={ShieldCheck} title="Nothing to review yet" body="The agent sends you all 4 stages at once, so you review in one sitting." />;
  const stages = buildStages(version);
  const v1 = buildStages(1);
  const reviewing = state.phase === "in_review" || state.phase === "re_review";

  return (
    <div className="max-w-4xl space-y-4" {...tour}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-sub">
          Reviewing as <span className="font-medium text-ink">{checker.name}</span>, {checker.role}. The plan was made by the Access Agent, so you can approve it.
        </p>
        <Pill tone="neutral">Plan v{version}</Pill>
      </div>
      {stages.map((s, i) => {
        const approval = state.approvals[s.id];
        const valid = approvalValid(approval, s);
        const stale = !!approval && !valid;
        const prevOk = stages.slice(0, i).every((p) => approvalValid(state.approvals[p.id], p));
        const changes = version === 2 ? diffStage(v1[i], s) : [];
        const wasReturned = state.returned?.stageId === s.id;
        const canAct = reviewing && !valid && prevOk;
        const canReturn = canAct && version === 1 && s.id === 3;
        return (
          <Card key={s.id} className={cn("p-5", canAct && "border-line-strong", valid && "bg-panel/30")}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">Stage {s.id} of 4</p>
                <h3 className="mt-0.5 text-base font-semibold">{s.title}</h3>
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
              <ul className="mt-4 space-y-2">
                {changes.map((c) => (
                  <li key={c.key} className="rounded-lg border border-accent/30 bg-accent-soft/40 px-3 py-2.5">
                    <p className="text-xs text-muted">
                      <Changed before={c.beforeLabel} after={c.afterLabel} />
                    </p>
                    <p className="mt-0.5 text-sm">
                      <Changed before={c.before} after={c.after} />
                    </p>
                    <div className="mt-1.5">
                      <Sources keys={c.sources} />
                    </div>
                  </li>
                ))}
                <li className="text-xs text-muted">{s.items.length - changes.length} other line{s.items.length - changes.length === 1 ? "" : "s"} unchanged</li>
              </ul>
            ) : (
              !valid && (
                <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                  {s.items.map((it) => (
                    <li key={it.key} className="flex items-start justify-between gap-4 px-3 py-2.5">
                      <div>
                        <p className="text-xs text-muted">{it.label}</p>
                        <p className="text-sm">{it.value}</p>
                      </div>
                      <Sources keys={it.sources} />
                    </li>
                  ))}
                </ul>
              )
            )}

            {s.id === 3 && !valid && (
              version === 1 ? (
                <div className="mt-3 flex gap-2.5 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2.5 text-sm text-warn-ink">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    <span className="font-medium">The agent didn&apos;t read everything.</span> It searched SVS for Mandates only. 1 Letter on this account, filed 01-Mar-2023, was not read, so these rules may be out of date.
                  </p>
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ok-ink">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} /> Read every SVS document on this account (2 of 2)
                </p>
              )
            )}

            {wasReturned && (
              <p className="mt-3 text-xs text-sub">
                <span className="font-medium text-ink">Sara&apos;s note:</span> {state.returned!.note}
              </p>
            )}

            {canAct && !returning && (
              <div className="mt-4 flex gap-2">
                <Button variant="primary" onClick={() => dispatch({ type: "approve", stageId: s.id })}>
                  <Check className="h-3.5 w-3.5" /> Approve stage {s.id}
                </Button>
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
