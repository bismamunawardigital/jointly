"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { HeroFrame } from "./HeroFrame";

export function MobileReplay({ className }: { className: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Check it as Sara (5 min) <ArrowRight className="h-4 w-4" />
      </button>
      {open && (
        <div role="dialog" aria-label="15-second version" className="fixed inset-0 z-50 flex flex-col gap-4 overflow-y-auto bg-canvas p-5">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="self-end rounded-md p-1 text-sub hover:bg-panel"><X className="h-5 w-5" /></button>
          <p className="text-base">Jointly is built for a bank laptop, so here&apos;s the 15-second version instead.</p>
          <HeroFrame callouts={[]} />
          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText(location.origin + "/demo/case/"); setCopied(true); }}
            className="h-11 rounded-lg border border-line px-4 text-sm font-medium"
          >
            {copied ? "Copied" : "Copy link for later"}
          </button>
        </div>
      )}
    </>
  );
}
