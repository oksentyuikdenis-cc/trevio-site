# Trevio — landing page

Marketing site for Trevio, a feedback intelligence platform for B2B SaaS product teams.

```bash
npm install
npm run dev      # http://localhost:5177
npm run build    # -> dist/
npm run preview  # serves dist/
```

The build is fully self-contained: fonts, the component library and every asset
are local, and the page makes **zero external network requests**. It opens from
a laptop with no internet, which is a delivery requirement, not a nice-to-have.

## How the page is put together

**One dataset drives everything.** `src/data/` holds the fictional workspace the
page describes — nine channels, 2,847 messages, six themes, three surfaced
insights. The copy, the counter, the ledger and the 3D scene all read from it,
so the numbers on the page can never disagree with the picture behind them.
Changing the scenario is a one-file edit.

**The scene is an argument, not a background.** `src/engine/` renders one
particle per piece of feedback and moves it between three positions as you
scroll the first three sections:

| Phase | What it shows |
|---|---|
| `scatter` | Nine channels, no structure — the inbox nobody reads |
| `cluster` | Six themes forming, duplicates merging |
| `resolve` | Three insights kept, the rest dimmed but not deleted |

Scroll progress is mapped to a 0–2 `phase` in `useScrollPhase.ts`, held in a ref
so scrolling never triggers a React render, and damped in `SignalEngine.tsx` so
trackpad jitter does not reach the field.

**Surfaces switch mid-page.** Sections 1–3 and 6–8 are dark; the two sections
carrying the product's output and its proof are light (`.surface-light`).
`src/styles/meridian-overrides.css` re-points the component library's tokens at
the page's contextual ones, so a component dropped into a light section flips
with the section instead of staying dark on paper.

## Things that will bite you if you change them

- **`.reveal` is gated behind `html.js-anim`.** The CSS only hides an element
  once JS has confirmed it can un-hide it, and `useReveal` has a 2s failsafe.
  Observers do not fire in a background tab, so without this a page opened in a
  new tab renders blank. Do not move the hidden state out of the gate.
- **The sticky scene pin has `height: 0`.** A full-height sticky element
  overlapped by a negative-margin sibling stops painting once the pin engages.
  The zero-height pin plus an absolutely positioned inner element avoids it.
- **`min-height`, not `height`, on flex children.** `.cta__input` collapsed to
  26px on mobile when the row stacked, because a `flex-basis` of 0 on the
  vertical main axis overrides a fixed height.
- **Contrast is tuned per surface.** `--text-tertiary` and `--accent-on-surface`
  have different values in dark and light; the same grey fails AA on one or the
  other. Re-check both if you touch them.

## Development helpers

- `?nowebgl` — forces the static fallback so the no-WebGL path can be tested.
  Dev-only; stripped from production builds.
- `og-gen.html` — regenerates `public/og.png` (1200×630). Open it on the dev
  server and run `fetch('/__save-og', {method:'POST', body: window.__og()})`.
  The endpoint lives in `vite.config.ts` and never ships.

## Known gaps

- The email form composes a `mailto:` — there is no backend. Deliberate: a fake
  "thanks, we'll be in touch" on a page arguing for evidence would be the wrong
  first impression.
- All figures are sample data from a fictional workspace, labelled as such on
  every surface that quotes a number.
- `prefers-reduced-motion` handling is implemented (CSS plus `useReducedMotion`
  feeding the shader) but was not verifiable in the build environment, which
  cannot toggle the OS setting. Worth a manual check before it ships.
