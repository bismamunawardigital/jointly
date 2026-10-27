---
name: Jointly
description: Agentic operations workbench for onboarding joint-signatory businesses to digital banking on top of Finacle and SVS.
colors:
  ink: "#16171A"
  sub: "#4A4C52"
  muted: "#6E6F73"
  line: "#E7E4DE"
  panel: "#F4F2EE"
  surface: "#FFFFFF"
  canvas: "#FBFAF7"
  accent: "#2449B4"
  accent-soft: "#EEF3FC"
  accent-ink: "#1C3A93"
  ok: "#157A43"
  ok-soft: "#E6F4EC"
  warn: "#A65A0B"
  warn-soft: "#FBF0E1"
  bad: "#B3261E"
  bad-soft: "#FBEAE8"
typography:
  body:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    lineHeight: 1.5
  label:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 500
  title:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: 600
  code:
    fontFamily: IBM Plex Mono
    fontSize: 11px
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    height: 36px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  source-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.sub}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
---

# Jointly design system

## Overview

Jointly is an Operate-mode tool. A Customer Fulfillment checker uses it all day to move cases forward, so scanability and trust beat expression. The interface should feel like a calm, precise instrument: a warm canvas with white surfaces, hairline borders, one blue accent, and colour only where it carries meaning.

The product story is always visible in the UI: the agent proposes, rules verify, a human approves, the agent executes, the system verifies.

## Colors

All colours are CSS variables in `src/app/globals.css`, with a dark set under `[data-theme="dark"]`. Light is the default. Live reference: `/demo/styleguide`.

- **Ink** `#0F1B2D`, **canvas** `#FAF7F2` (dark `#0E1420`), **surface** `#FFFFFF` (dark `#151D2B`), **border** `#E9E3D8` (dark `#243044`).
- **Saffron** `#C8892B` is the brand accent. Only for the logo, the landing hero and the active step.
- **Ink blue** `#1F3A8A` is the primary action and focus.
- **Status only**: verified `#2F7D5B`, needs you `#B7791F`, blocked `#B42318`, held `#6B7280`. Never decorative.
- **People keep one colour everywhere**: Mohammed teal `#0E7C86`, Khalifa indigo `#4F46E5`, Rashid coral `#D9534F`, Sara ink, the agent graphite with a spark. Avatars, signing map, workflow lanes, audit rows and SMS previews all use them. Held people switch to the held grey with a dashed ring.
- No gradients, glows or glass.

## Typography

IBM Plex Sans for UI, IBM Plex Sans Arabic for Arabic, Instrument Sans 500/600 for display (its 1 and l stay distinct, which matters for "v1" and amounts). No serif in the product. Scale 12 / 14 / 16 / 20 / 28 / 40 / 56 / 72. Product display is 28px, landing display 40 to 72px. Body 14 to 15px, never below 12px. Mono only inside Technical details. Tabular numbers for amounts and times. Sentence case everywhere.

Every product screen starts with a small eyebrow (the case name) and one display sentence that says the situation, like "2 of 3 signatories can go live today."

## Layout

- Labelled left sidebar (232px) with the product name, a neutral active state and the demo controls at the bottom.
- Case workspace: header, step rail, tabs, content, and a persistent right "Needs you" panel (320px) that always shows the single next human action.
- Best viewed on desktop. Below 1024px the workbench shows a clear desktop notice and links to the case study, which is fully responsive.

## Elevation & Depth

Flat. Borders separate surfaces. Only the evidence drawer and tour card get a soft shadow because they float over content.

## Shapes

8px spacing grid. 6px for chips, 12px for buttons and inputs, 16px for cards with 24px padding, full for pills and avatars. One primary button per screen region, everything else ghost or secondary.

## Components

- **Status pill**: dot plus short label, soft tone background.
- **Source chip**: mono, file icon, opens the evidence drawer with the cited text highlighted. Every agent claim and plan item has at least one.
- **Assumption chip**: dashed amber border. Used for anything that is a bank policy we have not validated (partial release, digital activation, precedence).
- **Timeline row**: time, actor, system call in mono, result, sources. Status icon on the left rail.
- **Approval gate**: stage card with an approval stamp that is tied to a hash of the stage content. If the content changes, the stamp is no longer valid.
- **Diff**: old value struck through in muted text, arrow, new value in ink.

## Motion

Ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. Agent progress steps fade and slide in over 150ms. Signing rings link over 300ms when a combination becomes valid. Diff amounts tween from the old value to the new one. Buttons scale to 0.97 on press. Nothing loops except the small agent working spinner. `prefers-reduced-motion` reduces all of it to instant.

## Do's and Don'ts

- Do cite a source for every rule the agent writes.
- Do show what the agent did not search, not only what it found.
- Don't show, generate or send passwords anywhere.
- Don't use colour on navigation or decoration.
- Don't use em dashes in copy. Write short, plain sentences.
- Accessibility: visible focus ring, 4.5:1 text contrast, every icon-only button has a label, Escape closes the drawer.
