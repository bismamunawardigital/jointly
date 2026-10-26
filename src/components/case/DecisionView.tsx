"use client";

import { FileCheck2, Printer } from "lucide-react";
import { business, checker } from "@/data/seed";
import { approvalValid, buildRules, buildStages, releaseEligibility } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { BasisTag, Button, Card, Empty, Quote, SourceChip } from "@/components/ui";

export function DecisionView() {
  const { state, version, held } = useStore();
  const stages = buildStages(version);
  const approved = stages.filter((s) => approvalValid(state.approvals[s.id], s));
  if (!approved.length && !state.returned)
    return <Empty icon={FileCheck2} title="No decisions yet" body="Every approval, return and release lands here with the rule, the source and who signed off." />;
  const elig = releaseEligibility(buildRules(version), held);
  const released = state.log.some((e) => e.id === "release");
  return (
    <div className="max-w-4xl space-y-4">
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
          <p className="mt-1 text-xs text-sub">Reason on screen: the agent had read 1 of 2 SVS documents. Fixed in plan v2 using the 2023 amendment letter.</p>
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
                Approved by {a.by} · {a.at} · <span className="font-mono">#{a.hash.length.toString(16)}{s.items.length}</span>
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
          <p className="text-xs text-muted">Mon 10:51 · {checker.name} released 2 of 3</p>
          <p className="mt-1 text-sm">{elig.summary}</p>
          <div className="mt-1.5 flex gap-1">
            <SourceChip k="svs-man-c1" />
            <SourceChip k="eid-rashid" />
          </div>
        </Card>
      )}
      {hasEvent(state, "ex-readback") && <p className="text-xs text-muted">Set-up read back from Digital Banking Admin: 0 differences from what was approved.</p>}
    </div>
  );
}
