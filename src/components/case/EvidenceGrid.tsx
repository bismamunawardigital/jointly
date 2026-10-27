"use client";

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { EvidenceKey, evidence, people } from "@/data/seed";
import { buildRules, fmt, singleLimit } from "@/lib/rules";
import { hasEvent, useStore } from "@/lib/store";
import { Avatar, cn } from "@/components/ui";

type Tone = "ok" | "warn" | "bad" | "na" | "held";
type CellData = { tone: Tone; text: string; src?: EvidenceKey; why?: string; changed?: boolean };
const cols = ["Signed form", "Finacle", "EFR", "Digital Banking", "SVS mandate 2019", "SVS letter 2023", "Planned setup"];
const na: CellData = { tone: "na", text: "Not used" };

const glyph: Record<Tone, React.ReactNode> = {
  ok: <Check className="h-3.5 w-3.5 shrink-0 text-ok" strokeWidth={3} aria-hidden />,
  warn: <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warn" aria-hidden />,
  bad: <X className="h-3.5 w-3.5 shrink-0 text-bad" strokeWidth={3} aria-hidden />,
  held: <span className="h-3 w-3 shrink-0 rounded-full border border-dashed border-held" aria-hidden />,
  na: <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden />,
};
const toneWord: Record<Tone, string> = { ok: "Exact match", warn: "Needs you", bad: "Blocked", held: "Held", na: "Not applicable" };

export function EvidenceGrid() {
  const { state, version, held, openEvidence, setTab } = useStore();
  const [active, setActive] = useState<string | null>(null);
  const [diff, setDiff] = useState(false);
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
        { tone: "ok", text: `RCIF ${p.rcif}`, src: `cif-${p.id}` as EvidenceKey },
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
          ? { tone: "held", text: "Created, switched off", why: "Set up now, switched on only after EFR passes and Sara releases him." }
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
  const act = (c: CellData) => {
    if (c.tone === "warn") {
      setTab("review");
      setTimeout(() => document.getElementById("stage-3")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } else if (c.src) openEvidence(c.src);
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
      act(rows[r].cells[c]);
      return;
    }
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
                <th key={c} scope="col" className="px-3 py-2.5 font-medium">{c}</th>
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
                        aria-label={`${row.name}, ${cols[c]}: ${toneWord[cell.tone]}, ${cell.text}`}
                        onClick={() => act(cell)}
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
                      </button>
                      {active === key && tip && (
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
