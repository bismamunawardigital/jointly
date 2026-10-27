"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { EvidenceKey, evidence } from "@/data/seed";
import { Tab, useStore } from "@/lib/store";
import { cn, sourceLabel } from "@/components/ui";

export function CommandPalette({ tabs }: { tabs: { id: Tab; label: string }[] }) {
  const { setTab, openEvidence } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);
  const items = useMemo(() => {
    const all = [
      ...tabs.map((t) => ({ kind: "Go to", label: t.label, run: () => setTab(t.id) })),
      ...(Object.keys(evidence) as EvidenceKey[]).map((k) => ({ kind: "Source", label: `${evidence[k].title} · ${sourceLabel(k)}`, run: () => openEvidence(k) })),
    ];
    const s = q.trim().toLowerCase();
    return (s ? all.filter((x) => x.label.toLowerCase().includes(s)) : all).slice(0, 9);
  }, [q, tabs, setTab, openEvidence]);
  if (!open) return null;
  const go = (n: number) => {
    items[n]?.run();
    setOpen(false);
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/20 pt-[12vh]" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); input.current?.focus(); } }} className="w-[560px] animate-enter overflow-hidden rounded-xl border border-line bg-surface shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-4 w-4 text-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setI(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(x + 1, items.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(x - 1, 0)); }
              if (e.key === "Enter") go(i);
            }}
            placeholder="Jump to a tab or a source"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={items[i] ? `palette-opt-${i}` : undefined}
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 text-[10px] text-muted">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto py-1">
          {items.length === 0 && <li className="px-4 py-3 text-sm text-muted">Nothing matches. Try a name, a system or a tab.</li>}
          {items.map((x, n) => (
            <li key={x.kind + x.label} id={`palette-opt-${n}`} role="option" aria-selected={n === i}>
              <button tabIndex={-1} onMouseEnter={() => setI(n)} onClick={() => go(n)} className={cn("flex w-full items-center gap-3 px-4 py-2 text-left text-sm", n === i && "bg-accent-soft text-accent-ink")}>
                <span className="w-14 shrink-0 text-[11px] text-muted">{x.kind}</span>
                <span className="truncate">{x.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
