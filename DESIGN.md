# Rethoriq design contract

## 0. Research log

- Source: the original rethoriq site. Kept its direct first-person voice and compressed its career history.
- Direction: intentionally bare, editorial, and personal. No cards, pills, icons, gradients, decorative motion, or product-marketing sections.

## 1. Brief

A single personal page for Thoriq. It says who he is, the work he does, where he has worked, and how to reach him.

## 2. People and constraints

- A recruiter or collaborator should understand Thoriq's range in under 20 seconds.
- A returning peer should find the email immediately.
- The page must remain legible under zoom, keyboard navigation, reduced motion, and narrow screens.

## 3. Visual language

- Warm paper background with near-black text and one quiet gray.
- System sans-serif only; no webfont request.
- One narrow reading column, generous whitespace, hairline rules.
- Depth model: flat document. No shadows and no surface decoration.

## 4. Tokens

- Color: `paper` #f4f2ed, `ink` #171716, `quiet` #706e68, `line` #d8d5ce.
- Type: 16px body, 14px label, 40px display; display becomes 34px on narrow screens.
- Space: 4px base; use 8, 12, 16, 24, 32, 48, 64, and 96px.
- Measure: 640px maximum.

## 5. Primitives

- Text link: underlined only on hover/focus, with a visible focus outline.
- Work row: year range, company, and one short contribution sentence.
- Rule: one-pixel divider using `line`.

## 6. Responsive behavior

- Desktop uses a two-column work row with fixed dates.
- Below 560px, each work row stacks date above the description.
- Page padding is 24px on narrow screens and 40px otherwise.

## 7. Accessibility

- Semantic landmarks and headings.
- Minimum body contrast exceeds WCAG AA.
- Links remain identifiable without color alone.
- No motion is required to understand or use the page.

## 8. Accepted debt

- No portrait or social graph metadata yet; neither is required for this deliberately bare first release.
