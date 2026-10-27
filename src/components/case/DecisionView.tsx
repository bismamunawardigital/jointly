"use client";

import { FileCheck2, Printer } from "lucide-react";
import { business, checker } from "@/data/seed";
import { approvalValid, buildRules, buildStages, releaseEligibility } from "@/lib/rules";
import { hasEvent, letterLabel, useStore } from "@/lib/store";
import { BasisTag, Button, Card, Empty, Quote, SourceChip } from "@/components/ui";

export function DecisionView() {
  const { state, version } = useStore();
  const stages = buildStages(version);
  const approved = stages.filter((s) => approvalValid(state.approvals[s.id], s));
  if (!approved.length && !state.returned)
    return <Empty icon={FileCheck2} title="No decisions yet" body="Every approval, return and release lands here with the rule, the source and who signed off." />;
  const first = releaseEligibility(buildRules(version), ["rashid"]);
  const rashidReleased = state.log.some((e) => e.id === "release-rashid");
  const released = state.log.some((e) => e.id === "release");
  return (
    <div className="max-w-4xl space-y-4">
      <dl aria-label="Agent and rules" className="grid grid-cols-2 gap-3 rounded-card bg-panel p-4 text-sm md:grid-cols-4">
        {[["Agent", "v1.4"], ["Rule set", "2026.10"], ["Owner", "Head of Operations"], ["Last validated", "20 Oct 2026"]].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="tnum font-medium">{v}</dd></div>
        ))}
        <p className="col-span-full text-xs text-muted">All synthetic.</p>
      </dl>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Why this case was set up this way</p>
          <p className="text-xs text-muted">
            {business.name} · plan v{version} · what an auditor asks for: the rule, the source and who approved it
          </p>
        </div>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print or save PDF
        </Button>
      </div>
      {state.returned && (
        <Card className="p-4">
          <p className="text-xs text-muted">Mon 10:07 · {checker.name} returned stage 3</p>
          <p className="mt-1 text-sm">&ldquo;{state.returned.note}&rdquo;</p>
          <p className="mt-1 text-xs text-sub">Reason on screen: the 2023 letter scan was unclear. Fixed in plan v2.</p>
        </Card>
      )}
      {state.confirmed !== undefined && (
        <Card className="p-4">
          <p className="text-xs text-muted">Mon 10:07 · {checker.name} checked the 2023 letter · {letterLabel(state)}</p>
          <p className="mt-1 text-sm">
            {state.mine
              ? `Sara read AED ${state.confirmed.toLocaleString("en-US")} on the scan, while the agent read AED 25,000 and wasn't sure. Sara chose her own value, so the plan uses AED ${state.confirmed.toLocaleString("en-US")}.`
              : state.copy === "received"
                ? `Sara's first reading of the blurry scan was AED ${(state.disagreed ?? 0).toLocaleString("en-US")}, so she asked the branch for a clean copy. She read AED ${state.confirmed.toLocaleString("en-US")} on the clean copy, so the plan uses it.`
                : `Sara typed AED ${state.confirmed.toLocaleString("en-US")} from the image, which matched the agent's reading, so plan v2 uses it.`}
          </p>
          <div className="mt-1.5 flex gap-1">
            <SourceChip k="svs-amd" />
          </div>
        </Card>
      )}
      {approved.map((s) => {
        const a = state.approvals[s.id]!;
        return (
          <Card key={s.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                <span className="mr-1.5 text-muted">{s.id}</span>
                {s.title}
              </p>
              <p className="tnum text-xs text-muted">
                Approved by {a.by} · {a.at} · <span className="tnum">#{a.hash.length.toString(16)}{s.items.length}</span>
              </p>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {s.items.map((it) => (
                <li key={it.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2.5">
                  <div>
                    <p className="text-xs text-muted">{it.label}</p>
                    <p className="text-sm">{it.value}</p>
                    <div className="mt-1">
                      <BasisTag keys={it.sources} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {it.sources.map((k) => (
                      <div key={k}>
                        <Quote k={k} />
                        <SourceChip k={k} className="ml-1" />
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
      {released && (
        <Card className="p-4">
          <p className="text-xs text-muted">Mon 10:51 · {checker.name}</p>
          <p className="mt-1 text-sm font-medium">Released Mohammed and Khalifa</p>
          <p className="mt-0.5 text-sm text-sub">{first.summary}</p>
          <div className="mt-1.5 flex gap-1">
            <SourceChip k="svs-man-c1" />
            <SourceChip k="eid-rashid" />
          </div>
        </Card>
      )}
      {rashidReleased && (
        <Card className="p-4">
          <p className="text-xs text-muted">Wed 09:41 · {checker.name}</p>
          <p className="mt-1 text-sm font-medium">Released Rashid</p>
          <p className="mt-0.5 text-sm text-sub">His EID is renewed. Adding him keeps every approval combination valid. Future payments only.</p>
          <div className="mt-1.5 flex gap-1">
            <SourceChip k="eid-rashid" />
          </div>
        </Card>
      )}
      {hasEvent(state, "ex-readback") && (
        <Card className="p-4">
          <table className="w-full text-sm">
            <caption className="mb-2 text-start text-sm font-medium">Approved by Sara vs read back from Digital Banking Admin</caption>
            <thead>
              <tr className="text-start text-xs text-muted"><th className="py-1 text-start font-medium">Setting</th><th className="py-1 text-start font-medium">Approved by Sara</th><th className="py-1 text-start font-medium">Read back from Digital Banking Admin</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[["Users", "3"], ["Rashid", "Switched off until his ID clears"], ["Up to the solo limit", `Khalifa alone, or any 2`], ["Solo limit", `AED ${(state.mine ?? 25000).toLocaleString("en-US")}`], ["Above the limit", "Any 2"]].map(([k, v]) => (
                <tr key={k}><td className="py-1.5 text-sub">{k}</td><td className="tnum py-1.5">{v}</td><td className="tnum py-1.5">{v}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm font-medium text-ok-ink">0 differences</p>
          <p className="mt-1 text-xs text-muted">Frozen at decision time. Later changes go in History, never in this record.</p>
        </Card>
      )}
      <dl className="space-y-1.5 border-t border-line pt-4 text-sm">
        <div><dt className="inline font-medium text-ok-ink">Verified: </dt><dd className="inline text-sub">The identities, the mandate rules and the setup were all read back from Admin.</dd></div>
        <div><dt className="inline font-medium">Assumed: </dt><dd className="inline text-sub">Admin has no write API.</dd></div>
        <div><dt className="inline font-medium text-muted">Not checked: </dt><dd className="inline text-sub">Sanctions screening isn&apos;t covered here, because Compliance does it separately.</dd></div>
        <p className="pt-2 text-xs text-muted">1 in 20 cleanly approved cases goes to a supervisor for a second look.</p>
      </dl>
    </div>
  );
}
