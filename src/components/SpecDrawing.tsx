import { Check, FileText, Undo2 } from "lucide-react";

const hatch = {
  backgroundImage: "repeating-linear-gradient(45deg, rgb(var(--accent) / 0.16) 0 1px, transparent 1px 6px)",
};

function Gap({ h, label, horizontal = false }: { h: number; label: string; horizontal?: boolean }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ ...hatch, ...(horizontal ? { width: h } : { height: h }) }}
    >
      <span className="absolute z-10 rounded bg-accent px-1 font-mono text-[9px] leading-[14px] text-onaccent">{label}</span>
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`absolute flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] text-accent-ink ${className}`}>{children}</span>
  );
}

const specs = [
  { k: "Card padding", v: "20" },
  { k: "Space between sections", v: "16" },
  { k: "Row padding", v: "12 / 10" },
  { k: "Button gap", v: "8" },
  { k: "Corner radius", v: "12 card, 8 rows" },
  { k: "Border", v: "1px line" },
  { k: "Type", v: "12 label, 16 title" },
];

export function SpecDrawing() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_220px]">
      <div className="relative px-10 py-10">
        <Tag className="left-10 top-3">
          <span className="h-3 w-3 rounded-tl-[12px] border-l border-t border-accent" /> r 12
        </Tag>
        <Tag className="right-10 top-3">stage card · 560 max</Tag>
        <div className="overflow-hidden rounded-xl border border-line-strong" style={hatch} aria-hidden>
          <div className="m-5 flex flex-col bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">Stage 3 of 4</p>
                <p className="mt-0.5 text-base font-semibold">Authorization rules</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" /> Waiting for you
              </span>
            </div>
            <Gap h={16} label="16" />
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="flex" style={hatch}>
                <Gap h={12} label="12" horizontal />
                <div className="flex flex-1 flex-col">
                  <div className="h-2.5" />
                  <div className="flex items-start justify-between gap-4 bg-surface">
                    <div>
                      <p className="text-xs text-muted">R2</p>
                      <p className="text-sm">Khalifa signs alone up to AED 10,000</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-sub">
                      <FileText className="h-3 w-3" /> SVS cl.2
                    </span>
                  </div>
                  <div className="h-2.5" />
                </div>
                <div className="w-3" />
              </div>
            </div>
            <Gap h={16} label="16" />
            <div className="flex">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-sm font-medium text-onaccent">
                <Check className="h-3.5 w-3.5" /> Approve stage 3
              </span>
              <Gap h={8} label="8" horizontal />
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-bad/30 px-3 text-sm font-medium text-bad-ink">
                <Undo2 className="h-3.5 w-3.5" /> Return to agent
              </span>
            </div>
          </div>
        </div>
        <Tag className="bottom-3 left-10">
          <span className="h-3 w-5" style={hatch} /> 20 padding all round
        </Tag>
      </div>
      <dl className="divide-y divide-line border-y border-line text-sm">
        {specs.map((s) => (
          <div key={s.k} className="flex justify-between gap-4 py-2">
            <dt className="text-sub">{s.k}</dt>
            <dd className="tnum font-mono text-xs leading-5 text-ink">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
