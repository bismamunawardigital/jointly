"use client";

import { AutonomyMap } from "@/components/AutonomyMap";
import { hasEvent, useStore } from "@/lib/store";

export function AutonomyView() {
  const { state, setTab } = useStore();
  return (
    <div className="max-w-6xl">
      <h2 className="text-base font-semibold">Who decides what</h2>
      <p className="mt-1 max-w-2xl text-sm text-sub">
        The agent does the legwork. Code answers the yes or no questions. Sara signs off on anything that changes who can move money. A tick means it has happened in this case. Click any line to see it.
      </p>
      <div className="mt-6">
        <AutonomyMap done={(e) => hasEvent(state, e)} onOpen={setTab} />
      </div>
    </div>
  );
}
