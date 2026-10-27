import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Fraunces } from "next/font/google";
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
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Jointly: joint signatories live in hours",
  description:
    "An agentic operations workbench that gets joint-signatory businesses onto digital banking in hours, on top of Finacle and SVS. Portfolio demo by Bisma Munawar.",
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
