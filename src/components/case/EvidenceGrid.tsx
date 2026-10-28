"use client";

import { useEffect, useState } from "react";
import { Gloss } from "@/components/landing/Gloss";
import { EidCard } from "@/components/case/EidCard";
import { glossary } from "@/content/glossary";
import { AlertTriangle, Check, X } from "lucide-react";
import { EvidenceKey, evidence, people } from "@/data/seed";
import { buildRules, fmt, singleLimit } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { Avatar, cn } from "@/components/ui";

type Tone = "ok" | "warn" | "bad" | "na" | "held";
type CellData = { tone: Tone; text: string; src?: EvidenceKey; why?: string; changed?: boolean; tag?: string };
const cols = ["Signed form", "Finacle", "EFR", "Digital Banking", "SVS mandate 2019", "SVS letter 2023", "Planned setup"];
const na: CellData = { tone: "na", text: "Not used" };

const glyph: Record<Tone, React.ReactNode> = {
  ok: <Check className="h-3.5 w-3.5 shrink-0 text-ok" strokeWidth={3} aria-hidden />,
  warn: <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warn" aria-hidden />,
  bad: <X className="h-3.5 w-3.5 shrink-0 text-bad" strokeWidth={3} aria-hidden />,
  held: <span className="h-3 w-3 shrink-0 rounded-full border border-dashed border-held" aria-hidden />,
  na: <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden />,
};
const checkedBy = [
  "Rules: the Emirates ID on the form must match Finacle.",
  "Rules: people are matched by Emirates ID, not by name.",
  "EFR: the ID must be valid and the face must match it.",
  "Rules: each person gets one login, and existing ones are reused.",
  "Rules: each mandate clause becomes a payment rule.",
  "Sara confirms the value, then rules apply it.",
  "Rules: the setup must match the mandate exactly.",
];

function Outlined({ text, needle }: { text: string; needle?: string }) {
  const i = needle ? text.indexOf(needle) : -1;
  if (!needle || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-transparent px-0.5 text-ink outline outline-2 outline-accent">{needle}</mark>
      {text.slice(i + needle.length)}
    </>
  );
}

function FinacleCrop({ id }: { id: string }) {
  const p = people.find((x) => x.id === id)!;
  const svsName = new RegExp(`([^.]*) \\(RCIF ${p.rcif}\\)`).exec(evidence["svs-signatories"].body)?.[1].trim() ?? p.name;
  return (
    <div className="space-y-2">
      <figure>
        <div className="relative overflow-hidden rounded border border-[#9aa7b4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sources/finacle-cif.png" alt="Finacle Inquire on Signatures screen, with the CIF ID field outlined" className="block w-full" />
          <span className="absolute flex items-center bg-white px-1 font-mono text-[9px] leading-none text-black outline outline-2 outline-offset-1 outline-accent" style={{ left: "39.1%", top: "47.9%", width: "28.8%", height: "6.1%" }}>{p.rcif}</span>
        </div>
        <figcaption className="mt-1 text-[11px] text-muted">The Finacle screen the agent reads. The CIF ID is filled in for this demo.</figcaption>
      </figure>
      {p.id === "khalifa" && <DedupRows />}
      <p className="text-ink">
        The SVS mandate says <q>{svsName}</q> and the form says <q>{p.name}</q>. The agent matched them by Emirates ID and <Gloss term="RCIF" def={glossary.RCIF} />, so it doesn&apos;t matter how the name is written.
      </p>
    </div>
  );
}

function DedupRows() {
  const rows = [
    { rcif: "100587", where: "Linked in SVS", used: true },
    { rcif: "087316", where: "Deira, 2014", used: false },
  ];
  return (
    <div aria-label="DEDUP result: 2 records with the same Emirates ID" className="rounded-md border border-line">
      <p className="border-b border-line px-2 py-1 text-[11px] text-muted">DEDUP, every branch · same Emirates ID</p>
      {rows.map((r) => (
        <div key={r.rcif} className={cn("flex items-center gap-2 px-2 py-1.5", !r.used && "text-muted")}>
          {r.used ? <Check className="h-3.5 w-3.5 text-ok" strokeWidth={3} aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden />}
          <span className={cn("font-mono text-[11px]", r.used ? "text-ink" : "line-through")}>RCIF {r.rcif}</span>
          <span className="text-[11px]">{r.where}</span>
          <span className={cn("ml-auto text-[11px] font-medium", r.used ? "text-ok-ink" : "text-muted")}>{r.used ? "Used" : "To Data Quality"}</span>
        </div>
      ))}
    </div>
  );
}

const toneWord: Record<Tone, string> = { ok: "Exact match", warn: "Needs you", bad: "Blocked", held: "Held", na: "Not applicable" };

export function EvidenceGrid() {
  const { state, version, held, openEvidence, setTab } = useStore();
  const [active, setActive] = useState<string | null>(null);
  const [diff, setDiff] = useState(false);
  const [pinned, setPinned] = useState<string | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!pinned) return;
    const [r, c] = pinned.split("-");
    const follow = () => {
      const b = document.querySelector(`[aria-label="Evidence grid"] button[data-r="${r}"][data-c="${c}"]`);
      if (b) setRect(b.getBoundingClientRect());
    };
    follow();
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    return () => {
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
    };
  }, [pinned]);
  const limit = singleLimit(buildRules(version))!;
  const v2 = version === 2;
  const renewed = hasEvent(state, "ren-kyc");

  const rows: { id: string; label: React.ReactNode; name: string; cells: CellData[] }[] = people.map((p) => {
    const expired = !p.eidValid && !renewed;
    const isHeld = held.includes(p.id);
    return {
      id: p.id,
      name: p.name.split(" ")[0],
      label: (
        <span className="flex items-center gap-2">
          <Avatar id={p.id} size={24} held={isHeld} />
          {p.name.split(" ")[0]}
        </span>
      ),
      cells: [
        { tone: "ok", text: `EID …${p.eidLast4}`, src: `form-${p.id}` as EvidenceKey },
        { tone: "ok", text: `RCIF ${p.rcif}`, src: `cif-${p.id}` as EvidenceKey, tag: p.id === "khalifa" && hasEvent(state, "id-dedup") ? "+1 old" : undefined },
        expired
          ? { tone: "bad", text: "EID expired", src: "eid-rashid", why: `EID expired ${p.eidExpiry}. EFR fails, so ${p.name.split(" ")[0]} is held until he renews.` }
          : { tone: "ok", text: p.id === "rashid" ? "Renewed" : "Valid" },
        p.digitalUser.existing ? { tone: "ok", text: `Login ${p.digitalUser.userId}`, src: "admin-user-mohammed" } : { tone: "na", text: "No login yet" },
        { tone: "ok", text: p.id === "khalifa" ? "Solo to 10,000" : "Joint signer", src: p.id === "khalifa" ? "svs-man-c2" : "svs-man-c1" },
        p.id === "khalifa"
          ? v2
            ? { tone: "ok", text: "Solo to 25,000", src: "svs-amd", changed: true }
            : { tone: "warn", text: "25,000? Unclear scan", src: "svs-amd", why: "The amount on the 2023 letter is smudged. Type what you read in stage 3." }
          : na,
        isHeld
          ? { tone: "held", text: "Created, switched off", why: "Set up now, switched on only after EFR passes and Sara grants him access." }
          : { tone: "ok", text: p.id === "khalifa" ? `Solo to ${fmt(limit)}` : p.digitalUser.existing ? "Link existing login" : "New login", changed: p.id === "khalifa" && v2 },
      ],
    };
  });
  rows.push({
    id: "mandate",
    name: "Mandate rules",
    label: "Mandate rules",
    cells: [
      na,
      { tone: "ok", text: "ANY TWO, less detail", src: "finacle-mop" },
      na,
      na,
      { tone: "ok", text: "Any 2, solo to 10,000", src: "svs-man" },
      v2 ? { tone: "ok", text: "Solo raised to 25,000", src: "svs-amd", changed: true } : { tone: "warn", text: "May raise the limit", src: "svs-amd", why: "Check the letter in stage 3. The plan follows your reading." },
      { tone: "ok", text: `Any 2, solo to ${fmt(limit)}`, changed: v2 },
    ],
  });

  const all = rows.flatMap((r) => r.cells);
  const count = (t: Tone) => new Set(all.filter((c) => c.tone === t).map((c, i) => (t === "warn" ? c.src : i))).size;
  const toLetter = () => {
    setPinned(null);
    setTab("review");
    setTimeout(() => document.getElementById("stage-3")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  const act = (c: CellData, key?: string) => {
    if (c.tone === "na") return;
    if (key) setPinned((p) => (p === key ? null : key));
  };
  const onKey = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const el = e.target as HTMLElement;
    const r = Number(el.dataset.r);
    const c = Number(el.dataset.c);
    if (Number.isNaN(r)) return;
    const move: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0], j: [1, 0], k: [-1, 0] };
    const m = move[e.key];
    if (e.key === "Enter") {
      e.preventDefault();
      act(rows[r].cells[c], `${r}-${c}`);
      return;
    }
    if (e.key === "Escape") setPinned(null);
    if (!m) return;
    e.preventDefault();
    e.stopPropagation();
    const nr = Math.max(0, Math.min(rows.length - 1, r + m[0]));
    const nc = Math.max(0, Math.min(cols.length - 1, c + m[1]));
    (e.currentTarget.querySelector(`[data-r="${nr}"][data-c="${nc}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <section aria-label="Evidence grid" className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">{glyph.ok}<span className="tnum font-medium">{count("ok")}</span> exact matches</span>
        <span className="flex items-center gap-1.5">{glyph.warn}<span className="tnum font-medium">{count("warn")}</span> {count("warn") === 1 ? "needs" : "need"} you</span>
        <span className="flex items-center gap-1.5">{glyph.bad}<span className="tnum font-medium">{count("bad")}</span> blocked</span>
        <span className="flex items-center gap-1.5">{glyph.held}<span className="tnum font-medium">{count("held")}</span> held</span>
        {v2 && (
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-sub">
            <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} /> Show what changed in plan v2
          </label>
        )}
      </div>
      <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-xs" onKeyDown={onKey}>
          <caption className="sr-only">Evidence for each signatory, by source. Use arrow keys to move, Enter to open.</caption>
          <thead>
            <tr className="border-b border-line text-left text-[11px] text-muted">
              <th scope="col" className="px-3 py-2.5 font-medium">Who</th>
              {cols.map((c) => (
                <th key={c} scope="col" className="px-3 py-2.5 font-medium">
                  {c === "Finacle" ? <Gloss term="Finacle" def={glossary.Finacle} />
                    : c === "EFR" ? <Gloss term="EFR" def={glossary.EFR} />
                    : c === "SVS mandate 2019" ? <><Gloss term="SVS" def={glossary.SVS} align="end" /> <Gloss term="mandate" def={glossary.Mandate} align="end" /> 2019</>
                    : c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.id} data-row={row.id} className="border-b border-line last:border-0">
                <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left text-sm font-medium">{row.label}</th>
                {row.cells.map((cell, c) => {
                  const key = `${r}-${c}`;
                  const tip = cell.why ?? (cell.src ? evidence[cell.src].body : undefined);
                  return (
                    <td key={c} className="relative p-0">
                      <button
                        type="button"
                        data-r={r}
                        data-c={c}
                        tabIndex={r === 0 && c === 0 ? 0 : -1}
                        aria-label={`${row.name}, ${cols[c]}: ${toneWord[cell.tone]}, ${cell.text}${cell.tag ? `, ${cell.tag} record` : ""}`}
                        onClick={(e) => { setRect(e.currentTarget.getBoundingClientRect()); act(cell, key); }}
                        aria-expanded={pinned === key}
                        onMouseEnter={() => setActive(key)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(key)}
                        onBlur={() => setActive(null)}
                        className={cn(
                          "flex h-full min-h-[44px] w-full items-center gap-1.5 px-3 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
                          cell.tone === "warn" && "bg-warn-soft/60 font-medium text-warn-ink",
                          cell.tone === "bad" && "bg-bad-soft/60 font-medium text-bad-ink",
                          cell.tone === "held" && "text-held",
                          cell.tone === "na" && "text-muted",
                          cell.tone === "ok" && "text-sub hover:bg-panel",
                          diff && cell.changed && "bg-accent-soft ring-1 ring-inset ring-accent",
                        )}
                      >
                        {glyph[cell.tone]}
                        <span className={/^(EID|RCIF) /.test(cell.text) ? "min-w-0 whitespace-nowrap font-mono text-[11px]" : "min-w-0"}>{cell.text}</span>
                        {cell.tag && <span className="whitespace-nowrap rounded-full bg-panel px-1.5 text-[10px] text-muted ring-1 ring-line">{cell.tag}</span>}
                      </button>
                      {pinned === key && (
                        <div role="dialog" aria-label={`Source for ${row.name}, ${cols[c]}`} style={rect ? { left: Math.min(rect.left + 8, window.innerWidth - (c === 1 ? 432 : 336)), ...(rect.bottom + (c === 1 || c === 2 ? 560 : 360) > window.innerHeight && rect.top > window.innerHeight - rect.bottom ? { bottom: window.innerHeight - rect.top + 4, maxHeight: rect.top - 12 } : { top: rect.bottom + 4, maxHeight: window.innerHeight - rect.bottom - 12 }) } : undefined}
                          className={cn("fixed z-50 overflow-y-auto rounded-lg border border-line bg-surface p-3 text-xs text-sub shadow-lg", c === 1 ? "w-[26rem]" : "w-80")}>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="font-medium text-ink">{cell.src ? evidence[cell.src].system : cols[c]}</span>
                            <button type="button" aria-label="Close" onClick={() => setPinned(null)} className="rounded p-0.5 text-muted hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                          </div>
                          {cell.src && <p className="mb-1 font-mono text-[11px] text-muted">{evidence[cell.src].ref} · {evidence[cell.src].title}</p>}
                          {c === 2 && row.id !== "mandate" && <EidCard id={row.id} expired={cell.tone === "bad"} />}
                          {c === 1 && row.id !== "mandate" ? <FinacleCrop id={row.id} /> : (
                          <p className="rounded-md bg-panel p-2 leading-relaxed text-ink">
                            {cell.src ? (
                              <Outlined
                                text={evidence[cell.src].body}
                                needle={[cell.text.replace(/^(EID …|RCIF |Login )/, ""), evidence[cell.src].highlight].find((n) => n && evidence[cell.src!].body.includes(n))}
                              />
                            ) : (
                              <Outlined text={cell.why ?? cell.text} needle={cell.why ? undefined : cell.text} />
                            )}
                          </p>
                          )}
                          <p className="mt-2">{checkedBy[c]}</p>
                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted">
                            <span>{c === 1 ? "Real Finacle screen, demo data" : c === 2 ? "Illustrated ID, demo data" : "Synthetic record"}</span>
                            {cell.tone === "warn" ? (
                              <button type="button" onClick={toLetter} className="font-medium text-accent-ink hover:underline">Go to the letter check</button>
                            ) : cell.src ? (
                              <button type="button" onClick={() => { setPinned(null); openEvidence(cell.src!); }} className="font-medium text-accent-ink hover:underline">Open the full source</button>
                            ) : null}
                          </div>
                        </div>
                      )}
                      {active === key && pinned !== key && tip && (
                        <div role="tooltip" className="absolute left-2 top-full z-20 mt-1 w-64 rounded-lg border border-line bg-surface p-3 text-xs text-sub shadow-lg">
                          {cell.src && <p className="mb-1 font-mono text-[11px] text-muted">{evidence[cell.src].ref}</p>}
                          {tip}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
