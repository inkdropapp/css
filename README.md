# @inkdropapp/css

The common stylesheets and design tokens for [Inkdrop](https://www.inkdrop.app).

This package ships Inkdrop's design system in two parallel forms:

- **CSS files** — native [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) (`@layer`) for the reset, design tokens, utilities, and themes.
- **TypeScript modules** — the same token values exported as typed objects, for use in JS/TS (inline styles, component props, computed colors).

It ships source only (raw `.css` and `.ts`) with no build step — consume it through a bundler.

## Install

```sh
pnpm add @inkdropapp/css
```

## Usage

### CSS

Import `layers.css` **first** — it declares the cascade-layer order that everything else relies on for correct precedence — then pull in the layers you need:

```css
@import '@inkdropapp/css/layers.css'; /* declares @layer order — must come first */
@import '@inkdropapp/css/reset.css';
@import '@inkdropapp/css/tokens.css';
@import '@inkdropapp/css/utilities.css';
@import '@inkdropapp/css/status.css';
@import '@inkdropapp/css/task-progress.css';
@import '@inkdropapp/css/tags.css';
@import '@inkdropapp/css/markdown.css';
```

Or, from a JS bundler:

```ts
import '@inkdropapp/css/layers.css'
import '@inkdropapp/css/tokens.css'
// ...
```

`tokens.css` exposes the design tokens as CSS custom properties:

```css
.note-tag {
  color: hsl(var(--hsl-slate-500));
  font-weight: var(--font-weights-semibold);
}
```

### TypeScript

The same values are available as typed objects:

```ts
import { hsl, colors, fontWeights } from '@inkdropapp/css/tokens'
import { tags, tagsDark } from '@inkdropapp/css/tags'
import { status } from '@inkdropapp/css/status'

const activeColor = `hsl(${hsl.slate400})` // "hsl(215 16% 47%)"
const weight = fontWeights.semibold // 600
```

## Cascade layers

`layers.css` declares the order (lowest → highest precedence):

```
reset, base, tokens, recipes, utilities, theme, theme.ui, theme.preview, theme.syntax
```

| Layer           | File                | Contents                                                                        |
| --------------- | ------------------- | ------------------------------------------------------------------------------- |
| `reset`         | `reset.css`         | CSS reset / normalize                                                           |
| `tokens`        | `tokens.css`        | Design tokens as custom properties (`--hsl-*`, `--color-*`, `--font-weights-*`) |
| `utilities`     | `utilities.css`     | Utility classes and base sizing variables                                       |
| `theme.ui`      | `status.css`        | Note status colors (`--note-status-*`)                                          |
| `theme`         | `task-progress.css` | Task progress view colors (light + dark)                                        |
| `theme.preview` | `markdown.css`      | GFM markdown preview, alert colors, and syntax theme                            |
| —               | `tags.css`          | Tag color palettes                                                              |

## TypeScript exports

| Module             | Exports                            | Description                                        |
| ------------------ | ---------------------------------- | -------------------------------------------------- |
| `tokens.ts`        | `hsl`, `colors`, `fontWeights`     | Color channel triplets, named colors, font weights |
| `tags.ts`          | `tags`, `tagsDark`                 | Per-color tag style objects (light + dark)         |
| `status.ts`        | `status`                           | Note status colors keyed by `NOTE_STATUS`          |
| `markdown.ts`      | `markdown`                         | GFM alert colors                                   |
| `task-progress.ts` | `taskProgress`, `taskProgressDark` | Task progress view colors (light + dark)           |

`status.ts` keys its map by `NOTE_STATUS` from [`inkdrop-model`](https://www.npmjs.com/package/inkdrop-model) (an optional dependency).

## Preview

`tags.html` is a standalone page for previewing the tag color styles — open it in a browser after referencing the CSS.

## Development

```sh
pnpm install
pnpm lint      # oxlint
pnpm format    # oxfmt — formats **/*.{js,ts,json}
```

Linting and formatting use the [oxc](https://oxc.rs) toolchain (oxlint + oxfmt); config lives in `.oxlintrc.json` and `.oxfmtrc.json`.

## License

[MIT](./LICENSE) © Takuya Matsuyama
