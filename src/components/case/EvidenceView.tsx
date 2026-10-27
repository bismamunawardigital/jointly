"use client";

import { Check, FileSearch, Search, X } from "lucide-react";
import { EvidenceKey, evidence, people, svsDocTypes } from "@/data/seed";
import { useTourTarget } from "@/components/Tour";
import { hasEvent, useStore } from "@/lib/store";
import { Avatar, Button, Card, Empty, Pill, SectionTitle, SourceChip, cn } from "@/components/ui";

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[11px] font-medium text-muted">{label}</p>
      {children}
    </div>
  );
}

export function EvidenceView() {
  const { state, dispatch } = useStore();
  const tour = useTourTarget(0);
  if (!hasEvent(state, "id-svs"))
    return <Empty icon={FileSearch} title="Evidence is still being gathered" body="Once the agent has read Finacle and SVS, you'll see how it matched each person and what the mandate says." />;
  const renewed = hasEvent(state, "ren-kyc");
  const searchedAll = hasEvent(state, "rev-amendment");
  const mandateDone = hasEvent(state, "mandate-conflict");

  return (
    <div className="max-w-5xl space-y-8">
      <section {...tour}>
        <SectionTitle aside={<p className="text-xs text-muted">Names are shown, never used to match</p>}>Who is who</SectionTitle>
        <Card className="divide-y divide-line">
          {people.map((p) => {
            const expired = !p.eidValid && !renewed;
            return (
              <div key={p.id} className="grid grid-cols-3 gap-x-6 gap-y-4 px-5 py-4 text-xs">
                <Cell label="Form">
                  <div className="mb-1 flex items-center gap-2">
                    <Avatar id={p.id} size={22} held={expired} />
                    <span className="text-sm font-medium text-ink">{p.name.split(" ")[0]}</span>
                  </div>
                  <p className="text-sub">{p.formName}</p>
                  <SourceChip k={`form-${p.id}` as EvidenceKey} className="mt-1" />
                </Cell>
                <Cell label="Finacle">
                  <p className="text-sub">{p.finacleName}</p>
                  <SourceChip k={`cif-${p.id}` as EvidenceKey} className="mt-1" />
                </Cell>
                <Cell label="SVS">
                  <p className="text-sub">{p.svsName}</p>
                  <SourceChip k="svs-signatories" className="mt-1" />
                </Cell>
                <Cell label="Matched on">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1 text-ok-ink">
                      <Check className="h-3 w-3" strokeWidth={3} /> EID …{p.eidLast4}
                    </span>
                    <span className="inline-flex items-center gap-1 text-ok-ink">
                      <Check className="h-3 w-3" strokeWidth={3} /> RCIF {p.rcif}
                    </span>
                  </div>
                </Cell>
                <Cell label="EFR">
                  {expired ? (
                    <div className="space-y-1">
                      <Pill tone="bad">EID expired</Pill>
                      <p className="text-muted">Expired {p.eidExpiry}</p>
                      <SourceChip k="eid-rashid" />
                    </div>
                  ) : (
                    <Pill tone="ok">{p.id === "rashid" ? "Renewed" : "Valid"}</Pill>
                  )}
                </Cell>
                <Cell label="Digital login">
                  {p.digitalUser.existing ? (
                    <div className="space-y-1">
                      <p className="font-medium text-ink">Has one: {p.digitalUser.userId}</p>
                      <p className="text-muted">Link it, don&apos;t recreate</p>
                      <SourceChip k="admin-user-mohammed" />
                    </div>
                  ) : (
                    <span className="text-muted">New user needed</span>
                  )}
                </Cell>
              </div>
            );
          })}
        </Card>
        {!renewed && (
          <p className="mt-3 text-xs text-sub">
            EID update request started for Rashid at {hasEvent(state, "kyc-request") ? "Mon 09:13" : "…"}. EFR is never waived, so he stays held until it clears.
          </p>
        )}
      </section>

      {mandateDone && (
        <section>
          <SectionTitle>What the mandate says</SectionTitle>
          <div className="grid grid-cols-[1fr_1.6fr] gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Finacle · Mode of Operation</p>
                <Pill tone="warn">Too coarse</Pill>
              </div>
              <p className="mt-3 font-mono text-sm">JOINTLY - ANY TWO</p>
              <p className="mt-2 text-sm text-sub">No amount bands. No single-signing right for Khalifa.</p>
              <div className="mt-3">
                <SourceChip k="finacle-mop" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">SVS · source of truth for the rules</p>
                <Pill tone="ok">Used</Pill>
              </div>
              <ol className="mt-3 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-muted">cl.1</span>
                  <div className="flex-1">
                    <p>Any two of the three sign jointly.</p>
                    <SourceChip k="svs-man-c1" className="mt-1" />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-muted">cl.2</span>
                  <div className="flex-1">
                    <p>
                      Khalifa can sign alone up to{" "}
                      {searchedAll ? (
                        <>
                          <span className="text-muted line-through">AED 10,000</span> <span className="font-medium">AED 25,000</span>
                        </>
                      ) : (
                        "AED 10,000"
                      )}
                      .
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <SourceChip k="svs-man-c2" />
                      {searchedAll && <SourceChip k="svs-amd" />}
                    </div>
                  </div>
                </li>
              </ol>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Search className="h-3.5 w-3.5" /> SVS document types searched
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {svsDocTypes.map((t) => {
                  const done = true;
                  return (
                    <li key={t} className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs", done ? "border-ok/30 bg-ok-soft text-ok-ink" : "border-dashed border-line text-muted")}>
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" />}
                      {t}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-sub">
                {searchedAll
                  ? `Used ${evidence["svs-amd"].ref} after Sara checked the scan.`
                  : "Found a 2023 Letter. The scan is unclear, so Sara checks it in review."}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Finacle cleanup ticket</p>
                <Pill tone={state.cleanupTicket === "sent" ? "ok" : "neutral"}>{state.cleanupTicket === "sent" ? "Sent" : "Draft"}</Pill>
              </div>
              <p className="mt-3 text-sm">Update Mode of Operation on AE07…0123 456 to reflect the SVS mandate{hasEvent(state, "rev-plan") ? " and the 2023 amendment" : ""}.</p>
              <p className="mt-1 text-xs text-muted">To Data Quality team. Doesn&apos;t block this case.</p>
              {state.cleanupTicket === "draft" && (
                <Button size="sm" className="mt-3" onClick={() => dispatch({ type: "sendCleanup" })}>
                  Send ticket
                </Button>
              )}
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
