// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
//
// NOTE: Pieces Checkbox, Switch, CheckboxGroup and RadioGroup share. Internal: not exported from the package.
import type { Html, HtmlBuilder } from 'foldkit/html'

import { cva, sva } from '@etherfield/ui/css'

import * as Icon from './icon'

export type Size = 'default' | 'compact'

// NOTE: Holds a checkbox, radio or switch beside its label. It is one line of the label's text tall (the zero-width
// character sets the height), so the control sits centred on the label's first line at either size.
export const alignRecipe = cva({
  base: {
    display: 'inline-flex',
    flexShrink: '0',
    alignItems: 'center',
    lineHeight: 'normal',
    _before: { content: '"\\200B"', width: '0' },
  },
  variants: {
    size: { default: { fontSize: 'sm' }, compact: { fontSize: 'xs' } },
  },
  defaultVariants: { size: 'default' },
})

const groupRecipe = sva({
  slots: ['items', 'error'],
  base: {
    items: { display: 'flex', flexDirection: 'column' },
    // NOTE: Matches Field's error: a warning icon and red text.
    error: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      margin: '0',
      fontFamily: 'body',
      lineHeight: 'snug',
      color: 'fg.error',
    },
  },
  variants: {
    size: {
      default: { items: { gap: '3' }, error: { fontSize: 'sm' } },
      compact: { items: { gap: '2' }, error: { fontSize: 'xs' } },
    },
  },
  defaultVariants: { size: 'default' },
})

export const groupErrorId = (id: string): string => `${id}-error`

/** A group's options, stacked, then its error when there is one. */
export const groupView = <Message>(
  props: Readonly<{
    id: string
    size: Size
    error?: string
    items: ReadonlyArray<Html>
  }>,
  h: HtmlBuilder<Message>,
): ReadonlyArray<Html> => {
  const classes = groupRecipe({ size: props.size })
  return [
    h.div([h.Class(classes.items)], props.items),
    props.error === undefined
      ? null
      : h.p(
          [
            h.Class(classes.error),
            h.Id(groupErrorId(props.id)),
            h.Role('alert'),
          ],
          [
            Icon.view(
              {
                name: 'warning-circle',
                size: props.size === 'compact' ? 'sm' : 'md',
              },
              h,
            ),
            props.error,
          ],
        ),
  ]
}
