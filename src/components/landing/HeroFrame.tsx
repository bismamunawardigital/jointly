import { AlertTriangle, Check, Circle } from "lucide-react";
import { Avatar } from "@/components/ui";

type Tone = "ok" | "warn" | "dot";
const rows: { id: "mohammed" | "khalifa" | "rashid"; name: string; letter: [Tone, string]; plan: [Tone, string] }[] = [
  { id: "mohammed", name: "Mohammed", letter: ["dot", "Not used"], plan: ["ok", "Link existing login"] },
  { id: "khalifa", name: "Khalifa", letter: ["warn", "25,000? Unclear scan"], plan: ["ok", "Solo up to 10,000"] },
  { id: "rashid", name: "Rashid", letter: ["dot", "Not used"], plan: ["ok", "Created, switched off"] },
];

function Cell({ t: [tone, label] }: { t: [Tone, string] }) {
  const I = tone === "ok" ? Check : tone === "warn" ? AlertTriangle : Circle;
  return (
    <td className={tone === "warn" ? "bg-warn-soft px-3 py-2.5 text-warn-ink" : "px-3 py-2.5 text-sub"}>
      <span className="flex items-center gap-1.5">
        <I aria-hidden className={tone === "ok" ? "h-3.5 w-3.5 text-ok" : tone === "warn" ? "h-3.5 w-3.5" : "h-2 w-2 text-muted"} />
        {label}
      </span>
    </td>
  );
}

const Pin = ({ n, cls }: { n: number; cls: string }) => (
  <span aria-hidden className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas shadow ${cls}`}>{n}</span>
);

export function HeroFrame({ callouts, url = "jointly · Creekside · Review" }: { callouts: string[]; url?: string }) {
  return (
    <figure className="min-w-0">
      <div dir="ltr" className="relative overflow-hidden rounded-card border border-line bg-surface shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-line bg-panel px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" /><span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ms-3 truncate text-[13px] text-muted">{url}</span>
        </div>
        <div className="p-4">
          <p className="font-display text-lg">1 thing needs your judgement</p>
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-3 py-2 font-medium">Who</th>
                <th className="px-3 py-2 font-medium">SVS letter 2023</th>
                <th className="px-3 py-2 font-medium">Planned setup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2.5 font-medium">
                    <span className="flex items-center gap-2"><Avatar id={r.id} size={22} /> {r.name}</span>
                  </td>
                  <Cell t={r.letter} />
                  <Cell t={r.plan} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line bg-panel px-4 py-3">
          <div className="min-w-0 text-[13px]">
            <p className="font-medium">Plan v1 is ready. 1 value needs your eye.</p>
            <p className="text-muted">Stages 1 and 2 passed by rule.</p>
          </div>
          <span className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-[13px] font-medium text-onaccent">Confirm AED 25,000</span>
        </div>
        <Pin n={1} cls="left-[50%] top-[30%]" />
        <Pin n={2} cls="left-[60%] top-[52%]" />
        <Pin n={3} cls="right-[8%] bottom-[38px]" />
      </div>
      <ol className="mt-4 space-y-1.5 text-sm text-sub">
        {callouts.map((c, i) => (
          <li key={c} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-canvas">{i + 1}</span>
            {c}
          </li>
        ))}
      </ol>
    </figure>
  );
}
