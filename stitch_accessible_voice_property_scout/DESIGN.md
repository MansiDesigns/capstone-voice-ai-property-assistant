---
name: Scout Universal Accessibility System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#45474c'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#001907'
  on-tertiary: '#ffffff'
  tertiary-container: '#003013'
  on-tertiary-container: '#559f67'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#a6f4b5'
  tertiary-fixed-dim: '#8bd79b'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  target-min: 44px
  touch-cushion: 8px
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
---

## Brand & Style

The design system is constructed for a voice-assisted, keyboard-first AI property discovery platform. The brand personality conveys rigorous authority, effortless clarity, and absolute dependability. Designed to surpass WCAG 2.2 AA mandates (targeting AAA across core reading paths), the UI eliminates ambiguous iconography, hidden affordances, and low-contrast ephemera.

The design movement combines **Accessible Functionalism** with **Modern Architectural Precision**:
- High visual structure with explicit spatial bounds and tactile boundaries.
- Multimodal clarity: state changes are communicated concurrently via clear iconography, explicit text strings, audible live regions, and distinct color indicators.
- Voice-enabled affordances: interactive elements display clear spoken-command targets and visual status triggers that eliminate hesitation for screen reader, speech control, and keyboard navigators.

## Colors

All color choices adhere strictly to WCAG 2.2 AA requirements, enforcing a minimum 4.5:1 contrast ratio for standard text, 3:1 for large text and non-text interactive components/borders, and upwards of 12:1 for core reading content. Pale grays and muted low-contrast fills are strictly forbidden.

### Core Canvas & Structure
- **Canvas Base:** `#F8FAFC` (Slate 50)
- **Surface Layer:** `#FFFFFF` (Pure White)
- **Elevated Surface:** `#FFFFFF` with structural border `#CBD5E1` (Slate 300, 3.2:1 against canvas)
- **Text Main:** `#0F172A` (Slate 900, 14.8:1 against `#FFFFFF`)
- **Text Secondary:** `#334155` (Slate 700, 7.8:1 against `#FFFFFF`)
- **Interactive Action / Primary Brand:** `#1E293B` (Slate 800) for structural anchors and solid buttons; `#1D4ED8` (Blue 700, 4.6:1 against background) for link actions and high-visibility triggers.

### Focus Indication
- **Global Focus Ring:** `3px solid #2563EB` with a `2px` offset (`outline: 3px solid #2563EB; outline-offset: 2px`). Guarantees immediate 3:1 focus appearance against white and slate backgrounds.

### Verification Status Tokens (Always paired with iconography)
- **Verified:** Text `#166534` (Green 800) | Background `#DCFCE7` (Green 100) | Border `#86EFAC` (Green 300) | Icon: Checkmark.
- **Estimated:** Text `#854D0E` (Yellow 800) | Background `#FEF9C3` (Yellow 100) | Border `#FDE047` (Yellow 300) | Icon: Approximate/Tilde badge.
- **Not Verified / Critical:** Text `#991B1B` (Red 800) | Background `#FEE2E2` (Red 100) | Border `#FCA5A5` (Red 300) | Icon: Question circle or Warning shield.

### Voice Engine States
- **Ready / Standby:** Text `#1E293B` | Border `#94A3B8` | Background `#F1F5F9` | Icon: Static Microphone.
- **Listening:** Text `#FFFFFF` | Background `#DC2626` (Red 600) | Icon: Audio waveform with pulsating high-contrast ring.
- **Processing:** Text `#1E40AF` | Background `#DBEAFE` | Icon: High-contrast rotational spinner.
- **Speaking / Responding:** Text `#0F172A` | Background `#E2E8F0` | Icon: Sound wave broadcast.
- **Voice Error:** Text `#991B1B` | Background `#FEE2E2` | Border `#B91C1C` | Icon: Crossed microphone alert.

## Typography

Typography prioritizes continuous readability, scan-ability, and adherence to WCAG 2.2 reflow criteria up to 400% zoom without truncation or horizontal scrolling:
- All body text maintains a minimum line height of 1.6x base size to prevent line-collision during text scaling.
- Paragraph spacing is enforced at a minimum of 1.5x the line height.
- Letter spacing and word spacing respect user-applied accessibility stylesheets (`text-spacing` override support).
- No critical data or property details may be embedded into imagery. All metadata exists as semantic HTML elements.
- Strict anti-aliasing (`-webkit-font-smoothing: antialiased`) is coupled with distinct semi-bold and bold weights to avoid thin strokes degrading on lower-DPI monitors.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid governed by rigid safe zones and strict minimum hit areas:
- **Strict Target Sizing:** Every interactive element (voice triggers, search bars, filter buttons, breadcrumb links, pagination items) possesses a hard visual or padded target boundary of at least 44x44 CSS pixels.
- **Adjacent Target Separation:** Minimum 8px spacing cushion between active targets to eliminate unintended clicks or voice disambiguation errors.
- **Breakpoints:**
  - Mobile: `< 640px` (4 fluid columns, 16px margins, 16px gutters).
  - Tablet: `640px - 1023px` (8 fluid columns, 24px margins, 16px gutters).
  - Desktop: `1024px+` (12 fluid columns, max-width 1280px, 32px margins, 24px gutters).
- **Reflow & Layout Discipline:** The container adapts fluidly without fixed vertical heights. Text reflow rules enforce `overflow-wrap: break-word` across all property cards and metadata chips.

## Elevation & Depth

To avoid optical ambiguity and poor visibility for users with reduced contrast sensitivity, depth is communicated primarily through structural borders paired with subtle ambient diffusion:

- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC` without borders. Used for background scaffolding.
- **Level 1 (Cards, Content Panes):** Surface `#FFFFFF`, border `1px solid #CBD5E1`. Used for standard property cards, property overview modules, and voice conversation feeds.
- **Level 2 (Dropdowns, Floating Voice Mic, Active Panels):** Surface `#FFFFFF`, border `1.5px solid #94A3B8`, ambient shadow `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, High-Priority Alerts):** Surface `#FFFFFF`, border `2px solid #64748B`, modal backdrop `#0F172A` at `65%` opacity with backdrop filter `blur(4px)` for cognitive isolation, shadow `0 20px 25px -5px rgba(15, 23, 42, 0.16)`.

## Shapes

The shape philosophy uses intentional, controlled softness (Level 1: 0.25rem - 0.5rem) to ensure crisp layout boundaries and clean reading axes:
- Structural elements, input controls, chips, and property summary cards use a standard corner radius of `0.375rem` (6px) with an upper cap of `0.5rem` (8px).
- Status badges and voice indicator containers use `0.25rem` (4px) to retain an authoritative, legible architectural look.
- Rounded pill styles are restricted exclusively to the primary floating voice command button to signal its unique, multimodal input method.

## Components

### 1. Buttons
- **Touch Target:** Minimum dimension `44px` height and `44px` width.
- **Primary Button:** Background `#1E293B`, text `#FFFFFF`, radius `6px`. Focus: `3px solid #2563EB`, offset `2px`. Hover: Background `#0F172A`.
- **Secondary / Action Button:** Background `#FFFFFF`, border `2px solid #1D4ED8`, text `#1D4ED8`. Hover: Background `#EFF6FF`.
- **Labeling Rule:** Always use explicit labels (e.g., "Schedule In-Person Tour", "Search Properties", "Clear All Filters"). Never use vague phrasing like "Click here" or icon-only buttons without an `aria-label`.

### 2. Voice Input Component (Scout Assistant)
- **Visual Design:** Floating or docked interaction bar (height: `56px`), border `2px solid #CBD5E1`, background `#FFFFFF`.
- **Microphone Action Button:** 48x48px circle button within the container.
- **Listening State:** Crimson badge background `#DC2626`, white microphone icon, with a high-contrast static status label: "Listening... (Press Escape to cancel)".
- **Screen Reader Support:** Bound directly to an `aria-live="polite"` region that announces: "Microphone active. Scouting properties via voice. Speak your criteria now."

### 3. Verification & Metadata Chips
- **Sizing:** Height `32px` (wrapped within a 44px clickable target when interactive), padding `4px 10px`.
- **Composition:** Icon (16x16px) + Trailing text (font size 13px, weight 600).
- **Tokens Applied:**
  - *Verified:* Green icon + "Verified Property" + `#DCFCE7` background + `#166534` text.
  - *Estimated:* Estimator icon + "Estimated Value" + `#FEF9C3` background + `#854D0E` text.
  - *Not Verified:* Alert icon + "Unverified Info" + `#FEE2E2` background + `#991B1B` text.

### 4. Input Fields & Form Controls
- **Geometry:** Height `48px`, border `1.5px solid #64748B`, background `#FFFFFF`, text `#0F172A`.
- **Placeholder Rule:** Placeholders must never replace permanent `<label>` elements. Labels remain visible above the field at all times with `#0F172A` 14px bold text.
- **Focus State:** Border `#2563EB`, outline `3px solid #2563EB`, outline offset `2px`.
- **Error State:** Border `2px solid #B91C1C`, accompanied by an error icon and descriptive text placed below the input with `role="alert"`.

### 5. Checkboxes & Radio Buttons
- **Geometry:** Size `22x22px` within an explicit `44x44px` click zone.
- **Border:** `2px solid #334155`.
- **Checked State:** Fill `#1D4ED8`, contrasting white inner checkmark (3px thickness) or solid inner circle (10px).

### 6. Accessible Tabs & Breadcrumbs
- **Tabs:** Set within `<div role="tablist">`. Active tab features a 3px bottom border in `#1D4ED8` and bold text `#0F172A`. Selected state communicated via `aria-selected="true"`. Target height `44px`.
- **Breadcrumbs:** Wrapped in `<nav aria-label="Breadcrumb">`, connected with clear chevron separators that are marked `aria-hidden="true"`. The active page uses `aria-current="page"` with font weight 600.

### 7. Property Discovery Cards
- **Structure:** Level 1 elevation (White surface, `#CBD5E1` border). Focusable as a single keyboard unit with inner focus stops for actionable sub-buttons (e.g., "Save to favorites", "View Details").
- **Accessibility:** Voice shortcut key badges (e.g., "Say: 'Select 104 Highland'") rendered in high-contrast slate pills adjacent to the card title.