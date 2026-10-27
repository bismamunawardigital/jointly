"use client";

import { useId, useState } from "react";

export function Gloss({ term, def }: { term: string; def: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="rounded-sm text-sub underline decoration-dotted decoration-1 underline-offset-4 hover:text-ink"
      >
        {term}
      </button>
      <span role="tooltip" id={id} className={`absolute start-0 top-full z-30 mt-2 w-64 rounded-lg border border-line bg-surface p-3 text-xs leading-relaxed text-sub shadow-lg ${open ? "block" : "hidden"}`}>
        {def}
      </span>
    </span>
  );
}
