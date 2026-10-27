import { FileText } from "lucide-react";
import type { PersonId } from "@/data/seed";
import { Avatar } from "@/components/ui";

const ids: PersonId[] = ["mohammed", "khalifa", "rashid"];
const held = { background: "rgb(var(--held-soft))", color: "rgb(var(--held))" };

export function HeroScene() {
  return (
    <div aria-hidden className="relative h-[300px] overflow-hidden rounded-card border border-line bg-surface shadow-sm md:h-[400px]">
      <div className="absolute inset-x-0 top-8 flex justify-center gap-10 md:top-12 md:gap-16">
        {ids.map((id) => (
          <div key={id} className="relative flex h-14 w-14 items-center justify-center">
            <div className="hs hs-forms absolute flex h-16 w-12 flex-col gap-1 rounded-md border border-line bg-canvas p-2 shadow-sm">
              <FileText className="h-3.5 w-3.5 text-muted" />
              <span className="h-1 w-full rounded bg-line" />
              <span className="h-1 w-3/4 rounded bg-line" />
              <span className="mt-auto h-1 w-1/2 rounded bg-ink/40" />
            </div>
            {id === "rashid" ? (
              <>
                <span className="hs hs-r-on absolute">
                  <Avatar id="rashid" size={56} />
                </span>
                <span className="hs hs-r-held absolute">
                  <Avatar id="rashid" size={56} held />
                </span>
                <span className="hs hs-r-held absolute -bottom-8 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium" style={held}>
                  On hold
                </span>
              </>
            ) : (
              <span className="hs hs-people absolute">
                <Avatar id={id} size={56} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="hs hs-ladder absolute inset-x-8 top-[130px] md:inset-x-14 md:top-[175px]">
        <div className="flex h-9 overflow-hidden rounded-lg border border-line text-[11px] text-sub">
          <div className="flex w-1/2 items-center px-3" style={{ background: "rgb(var(--brand-soft))" }}>
            AED 1 to 25,000
          </div>
          <div className="flex flex-1 items-center border-l border-dashed border-line bg-canvas px-3">Above 25,000</div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[192px] flex justify-center md:top-[248px]">
        <span className="hs hs-link-l relative z-10">
          <Avatar id="mohammed" size={44} />
        </span>
        <span className="hs hs-link-r -ml-3">
          <Avatar id="khalifa" size={44} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex justify-center md:bottom-10">
        <span className="hs hs-live inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok-soft px-4 py-1.5 text-sm font-semibold text-ok-ink">
          <span className="h-2 w-2 rounded-full bg-ok" /> Live
        </span>
      </div>
    </div>
  );
}
