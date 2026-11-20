import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { css, cx } from '@etherfield/ui/css'

export type Level = 1 | 2 | 3 | 4

export type Props<Message> = Readonly<{
  level: Level
  text: string
  /** Field Manual misregister: cyan and magenta copies of the text, slightly offset behind it, like a misaligned print. */
  misregister?: boolean
  attributes?: ReadonlyArray<Attribute<Message>>
}>

const levelClass: Record<Level, string> = {
  1: css({ textStyle: 'heading.h1' }),
  2: css({ textStyle: 'heading.h2' }),
  3: css({ textStyle: 'heading.h3' }),
  4: css({ textStyle: 'heading.h4' }),
}

// NOTE: Each copy is the heading's own text, read from data-text. It keeps the heading's box (all four insets move
// together), so it wraps exactly like the real text.
const misregisterClass = css({
  position: 'relative',
  isolation: 'isolate',
  _before: {
    content: 'attr(data-text)',
    position: 'absolute',
    zIndex: 'behind',
    top: 'misregisterY',
    bottom: 'misregisterYReverse',
    left: 'misregisterX',
    right: 'misregisterXReverse',
    color: 'decor.ghostCyan',
    opacity: 'misregister',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  _after: {
    content: 'attr(data-text)',
    position: 'absolute',
    zIndex: 'behind',
    top: 'misregisterYReverse',
    bottom: 'misregisterY',
    left: 'misregisterXReverse',
    right: 'misregisterX',
    color: 'decor.ghostMagenta',
    opacity: 'misregister',
    pointerEvents: 'none',
    userSelect: 'none',
  },
})

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const attributes = [
    h.Class(
      cx(
        levelClass[props.level],
        props.misregister === true ? misregisterClass : undefined,
      ),
    ),
    ...(props.misregister === true
      ? [h.DataAttribute('text', props.text)]
      : []),
    ...(props.attributes ?? []),
  ]
  switch (props.level) {
    case 1:
      return h.h1(attributes, [props.text])
    case 2:
      return h.h2(attributes, [props.text])
    case 3:
      return h.h3(attributes, [props.text])
    case 4:
      return h.h4(attributes, [props.text])
  }
}
