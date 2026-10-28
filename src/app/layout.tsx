import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
});
const display = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const desc = "An AI agent sets up joint-signatory online banking across 4 legacy systems. A person still approves every decision.";
const ogTitle = "Jointly · Agentic AI for bank operations · Bisma Munawar";

export const metadata: Metadata = {
  metadataBase: new URL("https://jointly-banking.vercel.app"),
  title: "Jointly · Agentic AI case study by Bisma Munawar",
  description: desc,
  openGraph: { title: ogTitle, description: desc, url: "/", siteName: "Jointly", type: "website" },
  twitter: { card: "summary_large_image", title: ogTitle, description: desc },
};

const themeScript = `try{if(localStorage.getItem("jointly-theme")==="dark")document.documentElement.dataset.theme="dark";if(localStorage.getItem("jointly-density")==="compact")document.documentElement.dataset.density="compact"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${arabic.variable} ${mono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
