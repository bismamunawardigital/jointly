import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

type T = { eyebrow: string; title: string; sub: string; frame: string; heading: string; rows: [string, string, string, string, string, string][]; legend: [string, string]; cta: string; rtl?: boolean; font?: { name: string; data: ArrayBuffer } };

const tone: Record<string, [string, string]> = { ok: ["#E9F3EE", "#1F5E43"], warn: ["#FBF1E2", "#7A4E10"], bad: ["#FBEAE8", "#8E1B12"] };

export function renderOg(t: T) {
  const cell = (s: string) => {
    const [k, v] = s.split(":");
    const [bg, fg] = tone[k] ?? tone.ok;
    return (
      <div style={{ display: "flex", flex: 1, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 6, background: bg, color: fg, fontSize: 15, fontWeight: 600 }}>{v}</div>
    );
  };
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: t.rtl ? "row-reverse" : "row", width: "100%", height: "100%", background: "#F6F7F9", padding: 56, gap: 40, ...(t.font ? { fontFamily: t.font.name } : {}) }}>
        <div style={{ display: "flex", flexDirection: "column", width: 520, justifyContent: "center", alignItems: t.rtl ? "flex-end" : "flex-start", textAlign: t.rtl ? "right" : "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, border: "4px solid #C8892B" }} />
            <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, border: "4px solid #1F3A8A", marginLeft: -12 }} />
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#0F1B2D", marginLeft: 6 }}>Jointly</div>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 20, color: "#5B6676" }}>{t.eyebrow}</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 50, lineHeight: 1.08, fontWeight: 700, color: "#0F1B2D" }}>{t.title}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 22, lineHeight: 1.35, color: "#5B6676" }}>{t.sub}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #E3E7ED", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 32px rgba(15,27,45,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#EEF1F5", borderBottom: "1px solid #E3E7ED" }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ display: "flex", width: 9, height: 9, borderRadius: 5, background: "#C9D0DA" }} />)}
              <div style={{ display: "flex", marginLeft: 10, fontSize: 14, color: "#5B6676" }}>{t.frame}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: 20, gap: 10 }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#0F1B2D", marginBottom: 4 }}>{t.heading}</div>
              {t.rows.map(([name, color, ...cells]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", width: 120, alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600, color: "#0F1B2D" }}>
                    <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: color }} />
                    {name}
                  </div>
                  {cells.map((c, i) => <div key={i} style={{ display: "flex", flex: 1 }}>{cell(c)}</div>)}
                </div>
              ))}
              <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 14, color: "#5B6676" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ display: "flex", width: 10, height: 10, borderRadius: 3, background: "#2F7D5B" }} />{t.legend[0]}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ display: "flex", width: 10, height: 10, borderRadius: 3, background: "#B7791F" }} />{t.legend[1]}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: "1px solid #E3E7ED", background: "#FFFFFF" }}>
              <div style={{ display: "flex", padding: "8px 16px", borderRadius: 8, background: "#1F3A8A", color: "#FFFFFF", fontSize: 15, fontWeight: 600 }}>{t.cta}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: t.font ? [{ name: t.font.name, data: t.font.data }] : undefined },
  );
}

export const ogEn = {
  eyebrow: "Case study · Agentic AI for bank operations",
  title: "Sara sets up 3 signatories before lunch. The agent can't sign anything.",
  sub: "Bisma Munawar, Product Designer",
  frame: "jointly · Creekside · Review",
  heading: "1 thing needs your judgement",
  rows: [
    ["Mohammed", "#0E7C86", "ok:EID ok", "ok:Finacle ok", "ok:EFR valid", "ok:SVS ok"],
    ["Khalifa", "#4F46E5", "ok:EID ok", "ok:Finacle ok", "ok:EFR valid", "warn:25,000?"],
    ["Rashid", "#D9534F", "ok:EID ok", "ok:Finacle ok", "bad:EID expired", "ok:SVS ok"],
  ] as [string, string, string, string, string, string][],
  legend: ["Green = copied exactly", "Amber = Sara decides"] as [string, string],
  cta: "Check the letter",
};
