"use client";

import { Check, FileSearch, Search, X } from "lucide-react";
import { evidence, people, svsDocTypes } from "@/data/seed";
import { useTourTarget } from "@/components/Tour";
import { hasEvent, useStore } from "@/lib/store";
import { Avatar, Button, Card, Empty, Pill, SectionTitle, SourceChip, cn } from "@/components/ui";

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
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/60 text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Signatory</th>
                <th className="px-4 py-2.5 font-medium">Name in each system</th>
                <th className="px-4 py-2.5 font-medium">Matched on</th>
                <th className="px-4 py-2.5 font-medium">KYC</th>
                <th className="px-4 py-2.5 font-medium">Digital login</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => {
                const expired = !p.eidValid && !renewed;
                const differs = p.finacleName.toLowerCase() !== p.formName.toLowerCase() || p.svsName !== p.formName;
                return (
                  <tr key={p.id} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar id={p.id} held={expired} />
                        <span className="font-medium">{p.name.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <dl className="grid grid-cols-[52px_1fr] gap-x-2 gap-y-0.5 text-xs">
                        <dt className="text-muted">Form</dt>
                        <dd className="text-sub">{p.formName}</dd>
                        <dt className="text-muted">Finacle</dt>
                        <dd className={cn("font-mono", differs ? "text-warn-ink" : "text-sub")}>{p.finacleName}</dd>
                        <dt className="text-muted">SVS</dt>
                        <dd className={differs ? "text-warn-ink" : "text-sub"}>{p.svsName}</dd>
                      </dl>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 whitespace-nowrap text-xs">
                        <span className="inline-flex items-center gap-1 text-ok-ink">
                          <Check className="h-3 w-3" strokeWidth={3} /> EID …{p.eidLast4}
                        </span>
                        <span className="inline-flex items-center gap-1 text-ok-ink">
                          <Check className="h-3 w-3" strokeWidth={3} /> RCIF {p.rcif}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {expired ? (
                        <div className="space-y-1">
                          <Pill tone="bad">EID expired</Pill>
                          <p className="text-xs text-muted">Expired {p.eidExpiry}</p>
                          <SourceChip k="eid-rashid" />
                        </div>
                      ) : (
                        <Pill tone="ok">{p.id === "rashid" ? "Renewed" : "Valid"}</Pill>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.digitalUser.existing ? (
                        <div className="space-y-1">
                          <p className="font-medium text-ink">Has one: {p.digitalUser.userId}</p>
                          <p className="text-muted">Link it, don&apos;t recreate</p>
                          <SourceChip k="admin-user-mohammed" />
                        </div>
                      ) : (
                        <span className="text-muted">New user needed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        {!renewed && (
          <p className="mt-3 text-xs text-sub">
            EID update request started for Rashid at {hasEvent(state, "kyc-request") ? "Mon 09:13" : "…"}. KYC is never waived, so he stays held until it clears.
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
                  const done = searchedAll || t === "Mandate";
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
                  ? `Found ${evidence["svs-amd"].ref}, filed as a Letter. The agent now searches every type.`
                  : "Shown so a checker can see what the agent did not look at."}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Finacle cleanup ticket</p>
                <Pill tone={state.cleanupTicket === "sent" ? "ok" : "neutral"}>{state.cleanupTicket === "sent" ? "Sent" : "Draft"}</Pill>
              </div>
              <p className="mt-3 text-sm">Update Mode of Operation on AE07…0123 456 to reflect the SVS mandate and the 2023 amendment.</p>
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
