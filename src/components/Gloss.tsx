"use client";

import { useId, useState } from "react";
import { glossary } from "@/content/glossary";

export function Gloss({ term, def, children }: { term: string; def?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="rounded-sm underline decoration-dotted decoration-1 underline-offset-4 hover:text-ink"
      >
        {children ?? term}
      </button>
      <span role="tooltip" id={id} className={`absolute start-0 top-full z-40 mt-2 w-64 whitespace-normal rounded-lg border border-line bg-surface p-3 text-start text-xs font-normal leading-relaxed text-sub shadow-lg ${open ? "block" : "hidden"}`}>
        {def ?? glossary[term]}
      </span>
    </span>
  );
}
