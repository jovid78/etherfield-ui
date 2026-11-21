import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cva } from '@etherfield/ui/css'

// NOTE: Icons come from Iconoir (MIT, https://iconoir.com). Only the ones listed in scripts/icons.ts are shipped:
// add a name there and run `pnpm icons`.
import { icons } from './icon-data'

export type Name = keyof typeof icons
/** Every icon the library ships, in the order scripts/icons.ts lists them. */
export const names = Object.keys(icons) as ReadonlyArray<Name>
export type Size = 'sm' | 'md' | 'lg' | 'xl'

const iconRecipe = cva({
  base: { display: 'inline-block', flexShrink: '0', verticalAlign: 'middle' },
  variants: {
    size: {
      sm: { width: 'iconSm', height: 'iconSm' },
      md: { width: 'iconMd', height: 'iconMd' },
      lg: { width: 'iconLg', height: 'iconLg' },
      xl: { width: 'iconXl', height: 'iconXl' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type Props<Message> = Readonly<{
  name: Name
  size?: Size
  /** Names the icon for screen readers. Without it the icon is decorative and hidden from them. */
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const shapes = { path: h.path, circle: h.circle, rect: h.rect }
  return h.svg(
    [
      h.Class(iconRecipe({ size: props.size ?? 'md' })),
      h.Attribute('viewBox', '0 0 24 24'),
      h.Attribute('fill', 'none'),
      h.Attribute('stroke', 'currentColor'),
      h.Attribute('stroke-width', '1.5'),
      h.Attribute('stroke-linecap', 'round'),
      h.Attribute('stroke-linejoin', 'round'),
      ...(props.label === undefined
        ? [h.AriaHidden(true)]
        : [h.Role('img'), h.AriaLabel(props.label)]),
      ...(props.attributes ?? []),
    ],
    icons[props.name].map(([tag, attributes]) =>
      shapes[tag](
        Object.entries(attributes).map(([key, value]) =>
          h.Attribute(key, value),
        ),
        [],
      ),
    ),
  )
}
