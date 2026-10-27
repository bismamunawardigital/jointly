"use client";

import { useState } from "react";

type Tone = "plain" | "warn" | "ok";
type N = { lane: number; col: number; text: string; tone?: Tone };
const LW = 140, CW = 122, LH = 62, NW = 108, NH = 40;
const x = (c: number) => LW + 8 + c * CW;
const y = (l: number) => l * LH + (LH - NH) / 2;
const stroke: Record<Tone, string> = { plain: "rgb(var(--line-strong))", warn: "rgb(var(--warn))", ok: "rgb(var(--ok))" };

function Lane({ lanes, nodes, edges, pains, loop, empty }: { lanes: string[]; nodes: N[]; edges: [number, number][]; pains: { n: number; at: [number, number] }[]; loop?: [number, number]; empty?: { lane: number; text: string }[] }) {
  const H = lanes.length * LH;
  const mid = (i: number) => ({ l: x(nodes[i].col), r: x(nodes[i].col) + NW, cy: y(nodes[i].lane) + NH / 2, cx: x(nodes[i].col) + NW / 2, t: y(nodes[i].lane), b: y(nodes[i].lane) + NH });
  return (
    <svg viewBox={`0 0 1000 ${H}`} className="w-full min-w-[720px]" role="img">
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill="rgb(var(--muted))" />
        </marker>
      </defs>
      {lanes.map((l, i) => (
        <g key={l}>
          <rect x="0" y={i * LH} width="1000" height={LH} fill={i % 2 ? "rgb(var(--panel))" : "rgb(var(--surface))"} />
          <text x="12" y={i * LH + LH / 2 + 4} fontSize="13" fontWeight="600" fill="rgb(var(--sub))">{l}</text>
        </g>
      ))}
      {empty?.map((e) => (
        <text key={e.lane} x={x(3)} y={y(e.lane) + NH / 2 + 4} fontSize="13" fill="rgb(var(--muted))">{e.text}</text>
      ))}
      {edges.map(([a, b]) => {
        const A = mid(a), B = mid(b);
        const d = nodes[a].col === nodes[b].col ? `M${A.cx} ${A.cy < B.cy ? A.b : A.t} V${A.cy < B.cy ? B.t : B.b}` : `M${A.r} ${A.cy} H${(A.r + B.l) / 2} V${B.cy} H${B.l - 2}`;
        return <path key={`${a}-${b}`} d={d} fill="none" stroke="rgb(var(--muted))" strokeWidth="1.5" markerEnd="url(#arr)" className="draw-line" />;
      })}
      {loop &&
        [0, 1, 2, 3].map((k) => {
          const A = mid(loop[0]), B = mid(loop[1]);
          return <path key={k} d={`M${A.cx - 20 + k * 10} ${A.t} C${A.cx - 20 + k * 10} ${A.t - 26 - k * 4}, ${B.cx - 20 + k * 10} ${B.b + 26 + k * 4}, ${B.cx - 20 + k * 10} ${B.b}`} fill="none" stroke="rgb(var(--warn))" strokeWidth="1.25" className="loop-circle" strokeDasharray="3 3" opacity={1 - k * 0.15} />;
        })}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={x(n.col)} y={y(n.lane)} width={NW} height={NH} rx="8" fill="rgb(var(--surface))" stroke={stroke[n.tone ?? "plain"]} strokeWidth="1.5" />
          <text x={x(n.col) + NW / 2} y={y(n.lane) + (n.text.includes("|") ? 16 : 24)} textAnchor="middle" fontSize="13" fill="rgb(var(--ink))">
            {n.text.split("|").map((t, k) => (
              <tspan key={k} x={x(n.col) + NW / 2} dy={k ? 13 : 0}>{t}</tspan>
            ))}
          </text>
        </g>
      ))}
      {pains.map((p) => (
        <g key={p.n}>
          <circle cx={p.at[0]} cy={p.at[1]} r="10" fill="rgb(var(--warn))" />
          <text x={p.at[0]} y={p.at[1] + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{p.n}</text>
        </g>
      ))}
    </svg>
  );
}

export function DaysSwimlane({ t }: { t: { lanes: string[]; today: string; jointly: string; pains: string[]; todayNodes: string[]; jointlyNodes: string[]; empty: string; caption: string } }) {
  const [view, setView] = useState<"today" | "jointly">("today");
  const tn = t.todayNodes, jn = t.jointlyNodes;
  const today = (
    <Lane
      lanes={t.lanes}
      nodes={[
        { lane: 0, col: 0, text: tn[0] },
        { lane: 1, col: 1, text: tn[1] },
        { lane: 3, col: 1, text: tn[2], tone: "warn" },
        { lane: 1, col: 2, text: tn[3] },
        { lane: 2, col: 3, text: tn[4], tone: "warn" },
        { lane: 4, col: 4, text: tn[5] },
        { lane: 4, col: 5, text: tn[6], tone: "warn" },
        { lane: 0, col: 6, text: tn[7] },
      ]}
      edges={[[0, 1], [2, 1], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7]]}
      loop={[4, 3]}
      pains={[{ n: 1, at: [x(3) - 6, y(2) - 4] }, { n: 2, at: [x(1) + NW, y(3)] }, { n: 3, at: [x(5) + NW, y(4)] }]}
    />
  );
  const jointly = (
    <Lane
      lanes={t.lanes}
      nodes={[
        { lane: 0, col: 0, text: jn[0] },
        { lane: 3, col: 1, text: jn[1], tone: "ok" },
        { lane: 2, col: 3, text: jn[2], tone: "warn" },
        { lane: 2, col: 4, text: jn[3] },
        { lane: 3, col: 5, text: jn[4], tone: "ok" },
        { lane: 0, col: 6, text: jn[5], tone: "ok" },
      ]}
      edges={[[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]}
      pains={[]}
      empty={[{ lane: 1, text: t.empty }, { lane: 4, text: t.empty }]}
    />
  );
  const tab = (v: "today" | "jointly", label: string) => (
    <button type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-full px-3 py-1 text-xs ${view === v ? "bg-ink text-canvas" : "text-sub hover:text-ink"}`}>
      {label}
    </button>
  );
  return (
    <div>
      <div className="mb-4 hidden w-fit gap-1 rounded-full border border-line p-1 md:flex">{tab("today", t.today)}{tab("jointly", t.jointly)}</div>
      <div key={view} className="fade-in hidden overflow-hidden rounded-card border border-line md:block">{view === "today" ? today : jointly}</div>
      <div className="space-y-6 md:hidden">
        <div><p className="mb-2 text-xs font-medium text-muted">{t.today}</p><div className="overflow-x-auto rounded-card border border-line">{today}</div></div>
        <div><p className="mb-2 text-xs font-medium text-muted">{t.jointly}</p><div className="overflow-x-auto rounded-card border border-line">{jointly}</div></div>
      </div>
      <ol className={`mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sub ${view === "jointly" ? "md:invisible" : ""}`}>
        {t.pains.map((p, i) => (
          <li key={p} className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warn text-xs font-bold text-white">{i + 1}</span>
            {p}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted">{t.caption}</p>
    </div>
  );
}
