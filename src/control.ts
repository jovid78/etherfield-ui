// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
//
// NOTE: Styles Input and Textarea share. Internal: not exported from the package.
import { css, cva } from '@etherfield/ui/css'

export type Size = 'default' | 'compact'
/** Field Manual controls are sharp by default; rounded and pill are there when a design needs them. */
export type Radius = 'sharp' | 'rounded' | 'pill'

// NOTE: Field Manual focus: the same red underline Button uses. An <input> or <textarea> can't have an ::after box,
// so the control sits in this wrapper and the wrapper draws the underline while the control has focus.
export const wrapperClass = css({
  position: 'relative',
  display: 'block',
  width: 'full',
  minWidth: '0',
  _after: {
    content: '""',
    position: 'absolute',
    insetInline: '0',
    bottom: 'focusOffsetOuter',
    height: 'focusLine',
    bg: 'focus.ring',
    boxShadow: 'focusGlow',
    opacity: 'hidden',
    pointerEvents: 'none',
  },
  _focusWithin: { _after: { opacity: 'visible' } },
})

export const controlRecipe = cva({
  base: {
    boxSizing: 'border-box',
    display: 'block',
    width: 'full',
    minWidth: '0',
    margin: '0',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: 'border.default',
    bg: 'bg.field',
    color: 'fg.default',
    fontFamily: 'body',
    lineHeight: 'normal',
    outline: 'none',
    transitionProperty: 'background-color, border-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'out',
    _placeholder: { color: 'fg.muted', opacity: 'visible' },
    // NOTE: Hover dims the field back to paper; focus keeps it pale.
    _hover: { bg: 'bg.canvas' },
    _focus: { bg: 'bg.field' },
    '&[aria-invalid=true]': { borderColor: 'border.error' },
    _disabled: { opacity: 'disabled', pointerEvents: 'none' },
    '&[readonly]': { bg: 'bg.tint' },
  },
  variants: {
    size: {
      default: { fontSize: 'sm', paddingInline: '3' },
      compact: { fontSize: 'xs', paddingInline: '2' },
    },
    radius: {
      sharp: { borderRadius: 'none' },
      rounded: { borderRadius: 'md' },
      pill: { borderRadius: 'pill' },
    },
  },
  defaultVariants: { size: 'default', radius: 'sharp' },
})
