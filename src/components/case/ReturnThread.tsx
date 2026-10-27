import { Check } from "lucide-react";
import { checker } from "@/data/seed";
import { hasEvent, useStore } from "@/lib/store";
import { AgentMark, cn } from "@/components/ui";

function Msg({ agent, name, time, children }: { agent?: boolean; name: string; time: string; children: React.ReactNode }) {
  const label = time === "later" ? null : time;
  return (
    <li className="relative flex gap-2.5 pb-3">
      <span className="absolute left-[11px] top-6 h-full w-px bg-line" aria-hidden />
      <span className={cn("relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", agent ? "bg-surface text-person-agent ring-1 ring-line" : "bg-accent-soft text-accent-ink")}>
        {agent ? <AgentMark size={14} /> : "SM"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted"><span className="font-medium text-ink">{name}</span>{label && <> · {label}</>}</p>
        <p className="mt-0.5 text-sm text-ink">{children}</p>
      </div>
    </li>
  );
}

export function ReturnThread() {
  const { state } = useStore();
  if (!state.returned) return null;
  const replied = hasEvent(state, "rev-submit");
  const resolved = replied && state.confirmed !== undefined;
  return (
    <ol aria-label="Return thread" className="mt-3 rounded-lg border border-line bg-panel/60 p-3">
      <Msg name={checker.name} time="Mon 10:07">&ldquo;{state.returned.note}&rdquo;</Msg>
      {state.copy && (
        <Msg agent name="Agent" time="Mon 10:07">Asked the branch for a clean copy of the 2023 letter. The case waits until it comes.</Msg>
      )}
      {state.copy === "received" && !replied && (
        <Msg agent name="Agent" time="later">The clean copy is here. Please check the limit on it.</Msg>
      )}
      {replied && (
        <Msg agent name="Agent" time="later">Rebuilt stage 3 with the limit you checked. Plan v2 shows only what changed.</Msg>
      )}
      <li className="flex items-center gap-2.5 text-xs">
        <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", resolved ? "bg-ok-soft text-ok" : "border border-dashed border-line text-muted")}>
          <Check className="h-3.5 w-3.5" />
        </span>
        {resolved ? <span className="font-medium text-ok-ink">Resolved by {checker.name} when she checked the letter</span> : <span className="text-muted">{checker.name} resolves it by checking the letter</span>}
      </li>
    </ol>
  );
}
