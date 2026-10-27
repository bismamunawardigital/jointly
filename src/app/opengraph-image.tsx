import { renderOg, ogEn } from "@/lib/og";
export const dynamic = "force-static";

export const alt = "Jointly case study: headline on the left, the Review screen with the evidence grid on the right";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg(ogEn);
}
