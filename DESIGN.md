# Rethoriq design contract

## 0. Research log

- Live reference: `https://benji.org/`, inspected at 375, 768, and 1280px on 2026-07-11.
- Runtime extraction used computed styles and full-page captures in `.reference/`.
- Borrowed only the layout grammar, typography, spacing, color, and link behavior. All copy and identity remain Thoriq's.

## 1. Brief

A quiet personal page for Thoriq that reads like a concise, well-typeset note: biography first, compact work index second, contact last.

## 2. People and constraints

- A recruiter or collaborator should understand Thoriq's range in under 20 seconds.
- A peer should find current work and contact information without navigation.
- The page must remain legible under zoom, keyboard navigation, and narrow screens.

## 3. Visual language

- Near-white canvas (`#fdfdfc`) and near-black text (`#111111`).
- One 550px reading column centered on desktop.
- Small Inter-like sans-serif typography: 14px text, 20px reading line.
- No cards, borders, shadows, icons, decorative assets, or display typography.

## 4. Tokens

- Color: `canvas` #fdfdfc, `ink` #111111, `muted` rgba(0, 0, 0, 0.4).
- Type: 14px body and headings; 13px footer; 20px paragraph line-height; weights 460 and 500.
- Tracking: -0.09px body, -0.04px footer.
- Space: 4px base; key values 8, 12, 16, 24, 32, 40, 48, 80px.
- Measure: 550px desktop; viewport minus 48px on mobile/tablet.

## 5. Primitives

- Favicon: transparent `tabler:letter-t` mark from Better Icons, drawn in `ink` at its native 24px view box.
- Inline link: ink text, no resting underline, 0.2s opacity transition; underline on hover/focus.
- Section label: muted 14px text with 8px bottom padding.
- Work row: 48/108px leading indent by viewport, title and summary at left, date aligned right.

## 6. Responsive behavior

- At 1280px: 550px column, 80px top padding, 108px work-row indent.
- At 768px: viewport minus 228px column, 32px top padding, 108px indent.
- At 375px: 24px gutters, 32px top padding, 48px work-row indent.
- Work dates stay right-aligned and may split into two lines on narrow screens.

## 7. Interaction and motion

- Links transition opacity over 0.2s and underline on hover/focus.
- Work titles transition opacity over 0.14s; no decorative animation.
- Focus is a visible 2px outline with 2px offset.

## 8. Accessibility and accepted debt

- Semantic article, headings, list, time, footer, and navigation landmarks.
- Muted text is supplementary; essential content uses full-contrast ink.
- No portrait, writing archive, or live local-time widget in this intentionally compact version.
