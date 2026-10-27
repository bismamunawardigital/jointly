import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-arabic)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        canvas: v("canvas"),
        brand: { DEFAULT: v("brand"), soft: v("brand-soft") },
        held: { DEFAULT: v("held"), soft: v("held-soft") },
        person: { mohammed: v("p-mohammed"), khalifa: v("p-khalifa"), rashid: v("p-rashid"), sara: v("p-sara"), agent: v("p-agent") },
        surface: v("surface"),
        panel: v("panel"),
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        ink: v("ink"),
        sub: v("sub"),
        muted: v("muted"),
        onaccent: v("onaccent"),
        accent: { DEFAULT: v("accent"), hover: v("accent-hover"), soft: v("accent-soft"), ink: v("accent-ink") },
        ok: { DEFAULT: v("ok"), soft: v("ok-soft"), ink: v("ok-ink") },
        warn: { DEFAULT: v("warn"), soft: v("warn-soft"), ink: v("warn-ink") },
        bad: { DEFAULT: v("bad"), soft: v("bad-soft"), ink: v("bad-ink") },
      },
      borderRadius: { card: "16px" },
      boxShadow: {
        sm: "0 1px 2px rgb(var(--shadow) / 0.04)",
        md: "0 1px 2px rgb(var(--shadow) / 0.04), 0 4px 12px rgb(var(--shadow) / 0.05)",
        lg: "0 2px 4px rgb(var(--shadow) / 0.04), 0 12px 32px rgb(var(--shadow) / 0.10)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      keyframes: {
        enter: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        step: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        enter: "enter 220ms cubic-bezier(0.23, 1, 0.32, 1) both",
        step: "step 150ms cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
