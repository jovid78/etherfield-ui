// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
//
// NOTE: Styles Input and Textarea share. Internal: not exported from the package.
import { css } from '@etherfield/ui/css'

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

export const controlClass = css({
  boxSizing: 'border-box',
  display: 'block',
  width: 'full',
  minWidth: '0',
  margin: '0',
  paddingInline: '3',
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'border.default',
  borderRadius: 'none',
  bg: 'transparent',
  color: 'fg.default',
  fontFamily: 'body',
  fontSize: 'sm',
  lineHeight: 'normal',
  outline: 'none',
  transitionProperty: 'background-color, border-color',
  transitionDuration: 'fast',
  transitionTimingFunction: 'out',
  _placeholder: { color: 'fg.muted', opacity: 'visible' },
  _hover: { bg: 'bg.tint' },
  _focus: { bg: 'transparent' },
  '&[aria-invalid=true]': { borderColor: 'border.error' },
  _disabled: { opacity: 'disabled', pointerEvents: 'none' },
  '&[readonly]': { bg: 'bg.tint' },
})
