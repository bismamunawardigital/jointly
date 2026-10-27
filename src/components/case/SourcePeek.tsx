"use client";

import { useState } from "react";
import { ChevronRight, Database, FileSignature, FileText, ListChecks, ScanFace, Settings } from "lucide-react";
import { Avatar, cn } from "@/components/ui";
import { Gloss } from "@/components/Gloss";
import type { PersonId } from "@/data/seed";
import { hasEvent, useStore } from "@/lib/store";
import { glossary } from "@/content/glossary";

export type Sys = "finacle" | "svs" | "efr" | "admin";
export type Stamp = "ok" | "warn" | "bad";

export const sysMeta: Record<Sys, { name: string; Icon: typeof Database; read: string }> = {
  finacle: { name: "Finacle", Icon: Database, read: "The agent read each person's customer record and the account's mode of operation." },
  svs: { name: "SVS", Icon: FileSignature, read: "The agent read the 2019 mandate and the 2023 letter that changed it." },
  efr: { name: "EFR", Icon: ScanFace, read: "The agent checked that each Emirates ID is valid and matches the face on file." },
  admin: { name: "Digital Banking Admin", Icon: Settings, read: "The agent looked up who already has an online banking login." },
};

const order: Sys[] = ["finacle", "svs", "efr", "admin"];
const names: Record<PersonId, string> = { mohammed: "Mohammed", khalifa: "Khalifa", rashid: "Rashid" } as Record<PersonId, string>;

export const checks: Record<"mohammed" | "khalifa" | "rashid", Record<Sys, [Stamp, string]>> = {
  mohammed: { finacle: ["ok", "10:02"], svs: ["ok", "10:03"], efr: ["ok", "10:02"], admin: ["ok", "10:04"] },
  khalifa: { finacle: ["ok", "10:02"], svs: ["warn", "10:03"], efr: ["ok", "10:02"], admin: ["ok", "10:04"] },
  rashid: { finacle: ["ok", "10:02"], svs: ["ok", "10:03"], efr: ["bad", "10:02"], admin: ["ok", "10:04"] },
};

const stampCls: Record<Stamp, string> = { ok: "bg-ok-soft text-ok-ink", warn: "bg-warn-soft text-warn-ink", bad: "bg-bad-soft text-bad-ink" };
const stampWord: Record<Stamp, string> = { ok: "checked", warn: "needs Sara", bad: "blocked" };

export function CheckStrip({ id }: { id: "mohammed" | "khalifa" | "rashid" }) {
  return (
    <ul className="grid grid-cols-4 gap-1.5">
      {order.map((s) => {
        const [st, at] = checks[id][s];
        const { Icon, name } = sysMeta[s];
        return (
          <li key={s} className={cn("rounded-md px-2 py-1.5 text-xs", stampCls[st])} title={`${name} ${stampWord[st]} at ${at}`}>
            <span className="flex items-center gap-1 font-medium"><Icon aria-hidden className="h-3.5 w-3.5" />{s === "admin" ? "Admin" : name}</span>
            <span className="tnum">{at}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function NotChecked() {
  return <p className="text-xs text-muted">Not checked by the agent: sanctions screening (done by Compliance).</p>;
}

export function SystemsStrip({ onOpen }: { onOpen?: (s: Sys) => void }) {
  const tally = (s: Sys) => {
    const v = (["mohammed", "khalifa", "rashid"] as const).map((p) => checks[p][s][0]);
    return v.includes("bad") ? "bad" : v.includes("warn") ? "warn" : "ok";
  };
  const note: Record<Sys, string> = { finacle: "3 people", svs: "1 unclear value", efr: "1 ID expired", admin: "1 login found" };
  return (
    <ul aria-label="Systems the agent checked" className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {order.map((s) => {
        const { Icon, name, read } = sysMeta[s];
        const t = tally(s);
        return (
          <li key={s} className="group relative">
            <button type="button" onClick={() => onOpen?.(s)} className="flex w-full items-center gap-2 rounded-lg bg-panel px-3 py-2 text-start text-sm hover:bg-line/60">
              <Icon aria-hidden className="h-5 w-5 shrink-0 text-sub" />
              <span className="min-w-0">
                <span className="block truncate font-medium">{name}</span>
                <span className={cn("block text-xs", t === "ok" ? "text-ok-ink" : t === "warn" ? "text-warn-ink" : "text-bad-ink")}>{t === "ok" ? "✓" : t === "warn" ? "!" : "✕"} {note[s]}</span>
              </span>
            </button>
            <span role="tooltip" className="pointer-events-none absolute start-0 top-full z-30 mt-1 hidden w-64 rounded-lg border border-line bg-surface p-3 text-xs text-sub shadow-lg group-hover:block">{read}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function PersonChips({ held }: { held: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {(["mohammed", "khalifa", "rashid"] as const).map((p) => (
        <li key={p} className="group relative">
          <span tabIndex={0} className="flex items-center gap-2 rounded-full bg-panel py-1 pe-3 ps-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <Avatar id={p} size={28} held={held.includes(p)} />{names[p]}
          </span>
          <div className="absolute start-0 top-full z-30 mt-1 hidden w-80 rounded-lg border border-line bg-surface p-3 shadow-lg group-focus-within:block group-hover:block">
            <p className="mb-2 text-xs font-medium text-muted">What the agent checked for {names[p]}</p>
            <CheckStrip id={p} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SourceTrail({ onOpen }: { onOpen?: () => void }) {
  const steps = ["SVS", "Letter AMD-2023-0107", "Line 2", "AED 25,000"];
  return (
    <nav aria-label="Where this value came from" className="flex flex-wrap items-center gap-1 text-xs text-sub">
      <FileSignature aria-hidden className="h-4 w-4" />
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1">
          {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-muted rtl:-scale-x-100" />}
          <button type="button" onClick={onOpen} className={cn("rounded px-1 hover:bg-panel hover:text-ink", i === 3 && "tnum font-medium text-warn-ink")}>{s}</button>
        </span>
      ))}
    </nav>
  );
}

export function SourceIcons({ sys }: { sys: Sys[] }) {
  return (
    <span className="ms-1 inline-flex gap-1 align-middle">
      {sys.map((s) => {
        const { Icon, name, read } = sysMeta[s];
        return <Icon key={s} aria-label={name} className="h-4 w-4 text-muted"><title>{`${name}. ${read}`}</title></Icon>;
      })}
    </span>
  );
}

const Hi = ({ children }: { children: React.ReactNode }) => <mark className="rounded-sm bg-transparent px-0.5 text-inherit outline outline-2 outline-brand">{children}</mark>;
const Tag = () => <span className="rounded-[4px] bg-panel px-1.5 py-0.5 text-xs text-muted">Synthetic record</span>;

const eid: Record<string, string> = { mohammed: "3391", khalifa: "7714", rashid: "5082" };
const rcif: Record<string, string> = { mohammed: "100234", khalifa: "100587", rashid: "100912" };
const upper: Record<string, string> = { mohammed: "MOHAMMED ALMANSOORI", khalifa: "KHALIFA S ALFALASI", rashid: "RASHID ALKETBI" };

export function PeekMock({ col, person }: { col: number; person: string }) {
  const head = (Icon: typeof Database, t: string) => (
    <p className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-muted"><span className="flex items-center gap-1.5"><Icon aria-hidden className="h-4 w-4" />{t}</span><Tag /></p>
  );
  if (person === "rules" || col === 6)
    return (
      <div>
        {head(ListChecks, "Planned setup")}
        <p className="text-sm font-medium">The plan line comes from a rule, not from the agent&apos;s judgement.</p>
        <p className="mt-2 rounded-md bg-panel p-2 text-xs text-sub"><Hi>Rule M-2</Hi> If the mandate gives a person a solo limit, set that limit in Digital Banking, and send anything above it to any 2.</p>
      </div>
    );
  if (col === 0)
    return (
      <div>
        {head(FileText, "Signed access request form")}
        <div className="rounded-md border border-line p-3 text-xs">
          <p>Name: {names[person as PersonId]}</p>
          <p className="tnum mt-1">Emirates ID: 784-XXXX-XXXXXXX-<Hi>{eid[person]?.slice(-1)}</Hi> ending <Hi>{eid[person]}</Hi></p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="h-12 rounded border border-dashed border-line-strong p-1 text-muted">Signature on the form</div>
            <div className="h-12 rounded border border-dashed border-line-strong p-1 text-muted">Specimen from SVS</div>
          </div>
          <p className="mt-1 font-medium text-ok-ink">Matches specimen</p>
        </div>
      </div>
    );
  if (col === 1)
    return (
      <div>
        {head(Database, "Finacle customer record")}
        <pre className="overflow-x-auto rounded-md bg-ink p-3 font-mono text-xs leading-5 text-canvas">
{"CUST INQ  ----------------------\n"}<Hi>{`RCIF      ${rcif[person]}`}</Hi>{`\nNAME      ${upper[person]}\n`}<Hi>{`EID NO    XXXXXXXX${eid[person]}`}</Hi>{"\nMODE OPS  JOINTLY - ANY TWO\nSTATUS    ACTIVE"}
        </pre>
        <p className="mt-2 text-xs text-sub"><Gloss term="RCIF" /> is how the agent matches the person, whatever the spelling.</p>
      </div>
    );
  if (col === 2) {
    const bad = person === "rashid";
    return (
      <div>
        {head(ScanFace, "EFR ID check")}
        <div className="relative flex gap-3 overflow-hidden rounded-md border border-line p-3">
          <span aria-hidden className="absolute inset-0 flex items-center justify-center text-2xl font-bold tracking-[0.3em] text-line">SPECIMEN</span>
          <span aria-hidden className="relative h-14 w-11 rounded bg-panel" />
          <div className="relative text-xs">
            <p>{names[person as PersonId]}</p>
            <p className={cn("tnum mt-1 font-medium", bad ? "text-bad-ink" : "text-ok-ink")}><Hi>EID ending {eid[person]} · {bad ? "Expired 14 Aug 2026" : "Valid"}</Hi></p>
          </div>
        </div>
      </div>
    );
  }
  if (col === 3)
    return (
      <div>
        {head(Settings, "Digital Banking Admin user")}
        <p className="tnum rounded-md bg-panel p-2 text-xs">
          {person === "mohammed" ? <Hi>DBU-77120 · Active since 2021 · linked RCIF 100234</Hi> : <Hi>No user found for RCIF {rcif[person]}</Hi>}
        </p>
      </div>
    );
  const letter = col === 5;
  return (
    <div>
      {head(FileSignature, letter ? "SVS letter 2023 · line 2" : "SVS mandate 2019")}
      <div className="overflow-hidden rounded-md bg-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={letter ? "/scans/svs-amd-2023.png" : "/scans/svs-amd-2023.png"} alt="" className="h-20 w-full scale-150 object-cover object-[60%_55%] outline outline-2 -outline-offset-4 outline-brand" />
      </div>
      <p className="mt-2 text-xs text-sub"><Hi>{letter ? "Khalifa may approve alone up to AED 25,000" : "Any 2 of the 3 signatories may approve together"}</Hi>{letter ? ", and the last digits are smudged." : "."}</p>
    </div>
  );
}

export function NameMatch() {
  const rows: [Sys | "form", string][] = [["form", "Mohammed Al Mansoori"], ["finacle", "MOHAMMED ALMANSOORI"], ["admin", "Mohd Al-Mansouri"]];
  return (
    <div className="w-80">
      <p className="mb-2 text-xs font-medium text-muted">3 spellings, 1 person</p>
      <div className="flex items-center gap-3">
        <ul className="flex-1 space-y-1.5">
          {rows.map(([s, n]) => (
            <li key={n} className="rounded-md bg-panel px-2 py-1 text-xs"><span className="text-muted">{s === "form" ? "Form" : sysMeta[s].name}</span> · {n} · <span className="tnum">EID 3391</span></li>
          ))}
        </ul>
        <ChevronRight aria-hidden className="h-5 w-5 text-brand rtl:-scale-x-100" />
        <span className="flex flex-col items-center gap-1 text-xs font-medium"><Avatar id="mohammed" size={32} />Mohammed</span>
      </div>
      <p className="mt-2 text-xs text-sub">The agent matched them on the Emirates ID, not on the name.</p>
    </div>
  );
}

export function usePeek() {
  return useState<string | null>(null);
}

export function FocusSources() {
  const { held } = useStore();
  const [open, setOpen] = useState<Sys | null>(null);
  const col: Record<Sys, number> = { finacle: 1, svs: 5, efr: 2, admin: 3 };
  return (
    <div className="space-y-3">
      <SystemsStrip onOpen={(s) => setOpen(open === s ? null : s)} />
      {open && (
        <div className="rounded-lg border border-line bg-surface p-3 shadow-lg">
          <PeekMock col={col[open]} person={open === "efr" ? "rashid" : open === "admin" ? "mohammed" : "khalifa"} />
        </div>
      )}
      <PersonChips held={held} />
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-sub">
        {Object.keys(glossary).slice(0, 7).map((t) => <Gloss key={t} term={t} />)}
      </p>
    </div>
  );
}

export function ChecksBlock() {
  return (
    <div className="space-y-2 border-b border-line pb-4">
      <PlanChecklist />
      {(["mohammed", "khalifa", "rashid"] as const).map((p) => (
        <div key={p} className="flex items-center gap-2">
          <Avatar id={p} size={28} />
          <div className="min-w-0 flex-1"><CheckStrip id={p} /></div>
        </div>
      ))}
      <NotChecked />
    </div>
  );
}

type StepState = "Waiting" | "Working" | "Done" | "Skipped" | "Failed";
const stepCls: Record<StepState, string> = { Waiting: "text-muted", Working: "text-accent-ink", Done: "text-ok-ink", Skipped: "text-sub", Failed: "text-bad-ink" };

export function PlanChecklist() {
  const { state } = useStore();
  const has = (id: string) => hasEvent(state, id);
  const written = has("ex-workflow");
  const failed = has("ex-workflow-fail");
  const steps: [string, StepState, string, string?][] = [
    ["Read the forms", has("intake-forms") ? "Done" : "Working", "Pass"],
    ["Match people by Emirates ID", has("id-digital") ? "Done" : "Waiting", "Pass"],
    ["Check Rashid's access", has("kyc-check") ? "Skipped" : "Waiting", "Warn", "His Emirates ID expired, so his access waits."],
    ["Read the mandate", has("mandate-conflict") ? "Done" : "Waiting", "Warn"],
    ["Write to Digital Banking Admin", written ? "Done" : failed ? "Failed" : "Waiting", failed && !written ? "Fail" : "Pass", failed ? "Admin timed out. Attempt 1 of 3." : undefined],
    ["Read back from Admin", has("ex-readback") ? "Done" : "Waiting", "Pass"],
  ];
  return (
    <ol aria-label="Plan checklist" className="mb-3 space-y-1 text-sm">
      {steps.map(([t, st, v, why]) => (
        <li key={t} className="flex flex-wrap items-baseline gap-x-2">
          <span className={cn("w-16 shrink-0 text-xs font-medium", stepCls[st])}>{st}</span>
          <span className="min-w-0 flex-1">{t}{why && <span className="block text-xs text-sub">{why}</span>}</span>
          {st !== "Waiting" && <span className="text-xs text-muted">Rules: {v}</span>}
        </li>
      ))}
    </ol>
  );
}
