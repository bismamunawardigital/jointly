import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#17181C",
        sub: "#4B4F58",
        muted: "#6B6F78",
        line: "#E6E7EA",
        panel: "#F6F7F8",
        accent: { DEFAULT: "#1E5BD8", soft: "#EAF0FD", ink: "#16449F" },
        ok: { DEFAULT: "#17803D", soft: "#E8F5EC", ink: "#11612E" },
        warn: { DEFAULT: "#B25A07", soft: "#FDF1E3", ink: "#8A4505" },
        bad: { DEFAULT: "#B42323", soft: "#FCEBEB", ink: "#8D1A1A" },
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      keyframes: {
        enter: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        enter: "enter 220ms cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
