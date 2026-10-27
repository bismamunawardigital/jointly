import Link from "next/link";
import { ArrowUpRight, Ban, Check, ShieldCheck, UserRound } from "lucide-react";
import { AgentIcon } from "./ui";
import type { Tab } from "@/lib/store";
import { Lane, autonomy } from "@/data/autonomy";
import { clsx } from "clsx";

const cn = clsx;

const look: Record<Lane, { icon: React.ComponentType<{ className?: string }>; head: string; icon_: string }> = {
  agent: { icon: AgentIcon, head: "border-t-accent", icon_: "text-accent" },
  rules: { icon: ShieldCheck, head: "border-t-ok", icon_: "text-ok" },
  human: { icon: UserRound, head: "border-t-warn", icon_: "text-warn" },
  never: { icon: Ban, head: "border-t-bad", icon_: "text-bad" },
};

export function AutonomyMap({ done, onOpen }: { done?: (event: string) => boolean; onOpen?: (tab: Tab) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {autonomy.map((lane) => {
        const { icon: Icon, head, icon_ } = look[lane.id];
        return (
          <div key={lane.id} className={cn("flex flex-col rounded-xl border border-line border-t-2 bg-surface p-4", head)}>
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", icon_)} />
              <p className="text-sm font-semibold">{lane.title}</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{lane.why}</p>
            <ul className="mt-4 space-y-1">
              {lane.items.map((item) => {
                const happened = done && item.event ? done(item.event) : false;
                const body = (
                  <>
                    <span className="flex-1">{item.text}</span>
                    {happened && <Check className="h-3.5 w-3.5 shrink-0 text-ok" aria-label="Happened in this case" />}
                    {item.tab && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />}
                  </>
                );
                const cls = "group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm text-sub transition-colors";
                if (!item.tab) return <li key={item.text} className={cn(cls, lane.id === "never" && "line-through decoration-bad/40")}>{body}</li>;
                return (
                  <li key={item.text}>
                    {onOpen ? (
                      <button onClick={() => onOpen(item.tab!)} className={cn(cls, "hover:bg-panel hover:text-ink")}>{body}</button>
                    ) : (
                      <Link href={`/demo/case/?tab=${item.tab}`} className={cn(cls, "hover:bg-panel hover:text-ink")}>{body}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
