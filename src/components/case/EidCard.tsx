import { people } from "@/data/seed";
import { cn } from "@/components/ui";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const slash = (d: string) => {
  const [day, mon, year] = d.split("-");
  return `${day}/${String(months.indexOf(mon) + 1).padStart(2, "0")}/${year}`;
};

export function EidCard({ id, expired }: { id: string; expired?: boolean }) {
  const p = people.find((x) => x.id === id)!;
  return (
    <figure className="mb-2">
      <div className="relative" style={{ containerType: "inline-size" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sources/emirates-id.png" alt={`Illustrated Emirates ID for ${p.name}`} className="block w-full" />
        <span className="absolute flex items-center truncate px-[1.5cqw] font-semibold text-white" style={{ left: "40.2%", top: "41.2%", width: "56.4%", height: "7.1%", fontSize: "3.2cqw" }}>{p.name}</span>
        <span className="absolute flex items-center bg-[#dcdde4] font-bold text-black" style={{ left: "30.6%", top: "89%", width: "19%", height: "7.5%", fontSize: "3.4cqw" }}>{slash(p.eidExpiry)}</span>
        {expired && (
          <span className={cn("absolute rounded-full bg-warn-soft px-[1.5cqw] py-[0.4cqw] font-semibold text-warn-ink ring-1 ring-warn")} style={{ left: "51%", top: "89.6%", fontSize: "3cqw" }}>Expired</span>
        )}
      </div>
      <figcaption className="mt-1 text-[11px] text-muted">Illustrated ID. EFR checks the real one is valid and the face matches.</figcaption>
    </figure>
  );
}
