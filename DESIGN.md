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

All colours are CSS variables in `src/app/globals.css`, with a dark set under `[data-theme="dark"]`. Light is the default, dark is a switch in the sidebar. The full brand guide lives at `public/brand/brand-guidelines.html`.

- **Neutrals** (ink, sub, muted, line, panel) carry 90% of the screen.
- **Accent blue** is for the primary action, focus, the active tour target and agent activity. Never decorative.
- **Green** means verified by rules or by a read-back. **Amber** means a person needs to decide. **Red** means blocked. These three never appear for anything else.
- No gradients, glows or glass.

## Typography

IBM Plex Sans for UI, IBM Plex Mono for system calls, references and source chips. Tabular numbers for amounts and times. Sentence case everywhere, including table headers. No uppercase tracked labels.

## Layout

- Labelled left sidebar (232px) with the product name, a neutral active state and the demo controls at the bottom.
- Case workspace: header, step rail, tabs, content, and a persistent right "Needs you" panel (320px) that always shows the single next human action.
- Best viewed on desktop. Below 1024px the workbench shows a clear desktop notice and links to the case study, which is fully responsive.

## Elevation & Depth

Flat. Borders separate surfaces. Only the evidence drawer and tour card get a soft shadow because they float over content.

## Shapes

6px for chips, 8px for buttons and inputs, 12px for cards, full for status pills and avatars.

## Components

- **Status pill**: dot plus short label, soft tone background.
- **Source chip**: mono, file icon, opens the evidence drawer with the cited text highlighted. Every agent claim and plan item has at least one.
- **Assumption chip**: dashed amber border. Used for anything that is a bank policy we have not validated (partial release, digital activation, precedence).
- **Timeline row**: time, actor, system call in mono, result, sources. Status icon on the left rail.
- **Approval gate**: stage card with an approval stamp that is tied to a hash of the stage content. If the content changes, the stamp is no longer valid.
- **Diff**: old value struck through in muted text, arrow, new value in ink.

## Motion

Ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, 150 to 220ms. New timeline rows fade up 4px. Buttons scale to 0.97 on press. Nothing loops except the small agent working spinner. `prefers-reduced-motion` reduces all of it to instant.

## Do's and Don'ts

- Do cite a source for every rule the agent writes.
- Do show what the agent did not search, not only what it found.
- Don't show, generate or send passwords anywhere.
- Don't use colour on navigation or decoration.
- Don't use em dashes in copy. Write short, plain sentences.
- Accessibility: visible focus ring, 4.5:1 text contrast, every icon-only button has a label, Escape closes the drawer.
