# Jointly brand and design system

Jointly is an agent workbench where an agent builds digital banking access for joint-signatory businesses and a CF checker approves it with every source in view. Version 1.0.

## Personality

Calm, exact, accountable, warm. The warmth comes from knowing the legacy-system day, not from jokes.

| We are | We are not | Reference |
|---|---|---|
| Plain and step by step | Jargon heavy | Wise |
| Hospitable and dignified in Arabic | Gold, luxe, ornamental | Emirates (type and tone only) |
| Locally warm | Cute or jokey | du |
| One clear next step per screen | Pushy nudges | Not Careem |
| Dense where it helps, quiet elsewhere | A wall of choices | Not Talabat |

## Logo

Two overlapping rings: blue is the agent, ink is the person. Clear space is one ring height on every side. Minimum mark width 16px, lockup 72px. In Arabic the mark sits to the right of the wordmark and is not mirrored. Never fill, gradient, rotate or recolour the ink ring.

## Colour

Neutrals carry about 90% of a screen. Blue means interactive. Green, amber and red mean data. A hue never does another hue's job.

### Creek blue

| Step | Hex | Use |
|---|---|---|
| 50 | #EEF3FC | Agent tint, selected row |
| 100 | #DCE6F9 | Selection |
| 200 | #B9CCF2 | Links on dark |
| 300 | #8EAAE8 | Logo ring on dark |
| 400 | #5F84DB | Charts only |
| 500 | #3A63CC | Charts only |
| 600 | #2449B4 | Accent: primary button, link, focus |
| 700 | #1C3A93 | Hover, pressed, accent text on tint |
| 800 | #182F75 | Rare |
| 900 | #13234F | Only dark brand surface |

### Semantic and neutral tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| canvas | #F6F7F9 | #0F1115 | App background |
| surface | #FFFFFF | #16191F | Cards, inputs |
| panel | #EEF1F5 | #1C2028 | Table heads, hover |
| line | #E3E7ED | #2A2F38 | Hairlines |
| line-strong | #CBD2DC | #3A404B | Input borders |
| ink | #16171A | #ECEDEF | Primary text |
| sub | #4A4C52 | #B4B8C0 | Secondary text |
| muted | #6E6F73 | #8B909A | Labels, meta |
| accent | #2449B4 | #7FA0F0 | Act here |
| accent-hover | #1C3A93 | #A3BCF5 | Hover |
| accent-soft | #EEF3FC | #1A2440 | Agent tint |
| accent-ink | #1C3A93 | #A3BCF5 | Blue text on tint |
| ok / ok-soft / ok-ink | #157A43 / #E6F4EC / #0F5C32 | #4CC27E / #12291D / #7AD9A1 | Verified, live |
| warn / warn-soft / warn-ink | #A65A0B / #FBF0E1 / #7F4407 | #E9A54B / #2E2112 / #F2C07E | A person must decide |
| bad / bad-soft / bad-ink | #B3261E / #FBEAE8 / #8A1C16 | #F07A70 / #321716 / #F5A39B | Blocked, destructive |

Known collision: agent tint and primary button share blue. Accepted because the agent always uses 50 and buttons always use solid 600.

## Typography

IBM Plex Sans for words, IBM Plex Mono for amounts, IDs, IBANs, times and API calls, IBM Plex Sans Arabic for Arabic.

| Token | Size / line | Weight | Tracking |
|---|---|---|---|
| display | 44 / 48 | 600 | -0.02em |
| h1 | 32 / 40 | 600 | -0.02em |
| h2 | 24 / 30 | 600 | -0.01em |
| h3 | 20 / 28 | 600 | -0.01em |
| title | 16 / 24 | 600 | 0 |
| body | 14 / 21 | 400 | 0 |
| small | 13 / 20 | 400 | 0 |
| label | 12 / 16 | 500, caps | 0.04em |
| mono | 12 / 18 | 400, tabular | 0 |
| arabic body | 15 / 26 | 400 | 0 |

Weights stop at 600. Arabic runs one size up with line height 1.75.

## Spacing, radius, elevation

| Token | Value |
|---|---|
| space-1, 2, 3, 4, 5, 6, 8, 10, 12, 16 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px |
| radius-xs, sm, md, lg, xl | 4, 6, 8, 12, 16px |
| shadow-sm | 0 1px 2px rgba(22,23,26,.04) |
| shadow-md | 0 1px 2px rgba(22,23,26,.04), 0 4px 12px rgba(22,23,26,.05) |
| shadow-lg | 0 2px 4px rgba(22,23,26,.04), 0 12px 32px rgba(22,23,26,.10) |

Layout: desktop only, 1280px minimum. Nav 232px, fluid work area with 32px padding, Needs you panel 320px. Cards pad 20px, sections 48 to 64px.

## Motion

| Token | Value | Use |
|---|---|---|
| dur-fast | 120ms | Hover, press, focus |
| dur-base | 200ms | Tab, pill, toggle |
| dur-slow | 320ms | Drawer, modal, new agent step |
| ease-out | cubic-bezier(0.23, 1, 0.32, 1) | All transitions |
| ease-in-out | cubic-bezier(0.65, 0, 0.35, 1) | Looping skeletons only |

Enter: fade and move up 4px. Press: scale 0.97. Reduced motion disables all of it.

## Components

- Button: primary (accent fill), secondary (surface, line-strong border), ghost, danger (bad-ink text, tinted border). Height 36, small 30, radius md. One primary per area. Label is verb plus object.
- Pill: radius full, 12px 500, dot plus label. Tones neutral, accent, ok, warn, bad.
- Source chip: mono 11px, line border, radius sm, opens the evidence drawer.
- Assumption chip: dashed amber border, 11px.
- Input: 36px, line-strong border, focus ring accent at 18%. Errors use bad border and bad-ink help text.
- Table: panel head, 12px muted labels, numbers right-aligned in mono.
- Alert: soft fill, 25% border, ink text. Title in 500.
- Modal: radius xl, shadow-lg, one primary on the right.
- Toast: ink fill, canvas text, optional Undo.
- Tabs: active tab ink text with 2px ink underline. Amber dot means it needs you.

## Patterns

- Approval card: state pill, then lines with a source on each, then coverage line, then actions.
- Diffs mark only changed words: removed on bad-soft, added on ok-soft.
- Agent timeline: mono call and time above a plain-language result. Dot colour follows status.
- Empty states say what happens next. No spinners unless something is running.

## Voice and content

| Thing | Rule | Example |
|---|---|---|
| Money | Code, space, grouped digits | AED 25,000 |
| Dates | DD-Mon-YYYY in records, "14 Aug" in sentences | 14-Aug-2026 |
| Durations | Hours and minutes | 1h 34m |
| IDs | Mono, with system name | RCIF 100587 |
| Errors | What happened, what's safe, what's next | Admin timed out. Nothing was half-written. Retrying once. |
| Agent | First person, honest about gaps | I didn't read 1 Letter. |
| Punctuation | No em dashes | |

## Arabic and RTL

- Modern Standard Arabic for UI, rules and legal text. Emirati Khaleeji for SMS, empty states and nudges. A native Emirati speaker reviews before shipping.
- Mirror the layout. Keep digits 0 to 9 in both languages. IDs, IBANs and chips stay LTR inside RTL text.
- Mirror arrows, chevrons and progress. Don't mirror the logo, checkmarks or time axes.
- Use logical CSS properties.

## Rules

- ✅ Put a source next to every agent claim. ❌ Ask Sara to remember what the system could show.
- ✅ Show what the agent didn't search where she decides. ❌ Hide gaps in another tab.
- ✅ Amber only when a person must decide. ❌ Colour harmless differences as warnings.
- ✅ Mono, tabular digits for anything compared across systems. ❌ Gradients, glows, glass or gold.
- ✅ Confirm once before anything reaches a customer. ❌ The same button twice on one screen.

## Setup

```bash
npm install
npm run dev
npm run typecheck && npm run lint && npm test
```

```ts
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-arabic" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
```

```ts
// tailwind.config.ts
darkMode: ["class", '[data-theme="dark"]'],
colors: {
  canvas: "var(--canvas)", surface: "var(--surface)", panel: "var(--panel)",
  line: { DEFAULT: "var(--line)", strong: "var(--line-strong)" },
  ink: "var(--ink)", sub: "var(--sub)", muted: "var(--muted)",
  accent: { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", soft: "var(--accent-soft)", ink: "var(--accent-ink)" },
  ok: { DEFAULT: "var(--ok)", soft: "var(--ok-soft)", ink: "var(--ok-ink)" },
  warn: { DEFAULT: "var(--warn)", soft: "var(--warn-soft)", ink: "var(--warn-ink)" },
  bad: { DEFAULT: "var(--bad)", soft: "var(--bad-soft)", ink: "var(--bad-ink)" },
}
```

## Component mapping

| Component | Code |
|---|---|
| Button | src/components/ui.tsx · Button |
| Pill | src/components/ui.tsx · Pill |
| Source chip | src/components/ui.tsx · SourceChip, Sources |
| Assumption chip | src/components/ui.tsx · AssumptionChip |
| Approval card | src/components/case/ReviewView.tsx |
| Evidence drawer | src/components/EvidenceDrawer.tsx |
| Agent timeline | src/components/case/RunView.tsx |
