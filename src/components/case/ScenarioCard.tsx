"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const KEY = "jointly-scenario-seen";

export const scenarioSeen = () => !!localStorage.getItem(KEY);

export function ScenarioCard({ onStart, onWatch }: { onStart: () => void; onWatch: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(KEY)) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener("jointly:scenario", show);
    return () => window.removeEventListener("jointly:scenario", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  function close() {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  }
  useEffect(() => {
    document.body.classList.toggle("scenario-open", open);
    return () => document.body.classList.remove("scenario-open");
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-bg/40 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label="Scenario" className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <button type="button" aria-label="Close" onClick={close} className="absolute right-3 top-3 rounded p-1 text-muted hover:text-ink">
          <X className="h-4 w-4" />
        </button>
        <p className="pr-6 text-base leading-relaxed text-ink">
          You&apos;re Sara, a checker in a bank&apos;s customer fulfilment operations team. Creekside General Trading has 3 partners who sign payments together, and they need online banking. The agent does the work and only comes to you when it needs a person.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="primary" autoFocus onClick={() => { close(); onStart(); }}>Start</Button>
          <Button onClick={() => { close(); onWatch(); }}>Watch it play (90 s)</Button>
        </div>
      </div>
    </div>
  );
}
