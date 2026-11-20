# @etherfield/ui

Etherfield's component library: Foldkit views styled with Panda CSS design tokens ("Field Manual"). Components
only: no app and no pages. The kitchen sink lives in `etherfield-site` at `/ui`.

Components are ported from [fluid-functionalism-foldkit](https://github.com/timhanlon/fluid-functionalism-foldkit)
one at a time, restyled from Tailwind/CSS to Panda.

## Build

```sh
pnpm install
pnpm build       # panda codegen + panda lib: writes styled-system/ and dist/panda/
pnpm typecheck
```

`panda lib` publishes the preset, tokens and extracted styles under `dist/panda/` and keeps the `package.json`
exports in sync. A consuming app sets `designSystem: '@etherfield/ui'` in its Panda config.

## Layout

| Path             | What                                                               |
| ---------------- | ------------------------------------------------------------------ |
| `src/panda/`     | Tokens, semantic tokens (what components use), text styles, preset |
| `src/fonts.css`  | Field Manual fonts                                                 |
| `src/button.ts`  | Button                                                             |
| `src/heading.ts` | Heading (h1–h4), with an optional cyan/magenta misregister         |

`strictTokens` is on: a raw color, space or size is a type error. Add a token instead.
