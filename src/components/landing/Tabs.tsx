"use client";

import { useState } from "react";
import { cn } from "@/components/ui";

export function Tabs({ labels, children }: { labels: string[]; children: React.ReactNode[] }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-line">
        {labels.map((l, k) => (
          <button
            key={l}
            role="tab"
            type="button"
            aria-selected={i === k}
            onClick={() => setI(k)}
            className={cn("-mb-px border-b-2 px-3 py-2 text-sm font-medium", i === k ? "border-brand text-ink" : "border-transparent text-sub hover:text-ink")}
          >
            {l}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-8">{children[i]}</div>
    </div>
  );
}
