// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
//
// NOTE: The floating surface Select opens, kept apart so Dropdown, Tooltip and Dialog can reuse it. Internal: not
// exported from the package. The Foldkit UI primitive that opens the popup owns its semantics, positioning,
// portal, dismissal, keyboard navigation and enter/leave timing; this file only draws it.
//
// The original adds a fluid hover highlight, a sliding selection background, an animated check, a custom
// scrollbar and a scroll shield, all driven from the DOM at mount. Here the highlight and the selection are plain
// CSS on the attributes the primitive sets (data-active, aria-selected), so the popup works in prerendered HTML
// and needs no runtime of its own.
import type { Html, HtmlBuilder } from 'foldkit/html'

import { css, cva, sva } from '@etherfield/ui/css'

import * as Icon from './icon'

export type Size = 'default' | 'compact'
/** A popup has no pill shape: a pill control opens a rounded popup. */
export type Radius = 'sharp' | 'rounded'

/** Where a popup sits relative to the control it opens from. Gap and padding are in px, as Foldkit's anchor takes
 * them. */
export const anchor = { gap: 4, padding: 8, portal: true } as const

// NOTE: The surface: paper with an ink border and a hard offset shadow. It fades and slides in from the side it
// opens on. Foldkit's primitives set data-transition while animating, data-closed at the start of enter and the
// end of leave, and data-placement once positioned.
export const surfaceRecipe = cva({
  base: {
    zIndex: 'popup',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    // NOTE: At least as wide as the control it opens from: Foldkit's anchor sets --button-width on the popup itself.
    // A token can't carry it (token variables resolve at :root, where it's unset), hence the escape hatch.
    minWidth: '[var(--button-width, 10rem)]',
    maxWidth: 'popupMax',
    overflow: 'hidden',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: 'border.default',
    bg: 'bg.canvas',
    color: 'fg.default',
    boxShadow: 'popup',
    outline: 'none',
    userSelect: 'none',
    opacity: 'visible',
    transform: 'translateY(0)',
    '&[data-transition]': {
      transitionProperty: 'opacity, transform',
      transitionDuration: 'fast',
      transitionTimingFunction: 'out',
    },
    '&[data-closed]': { opacity: 'hidden', transform: 'translateY(-4px)' },
    '&[data-closed][data-placement=top]': { transform: 'translateY(4px)' },
    '&[data-leave]': { pointerEvents: 'none' },
    _motionReduce: { '&[data-transition]': { transitionProperty: 'none' } },
  },
  variants: {
    radius: {
      sharp: { borderRadius: 'none' },
      rounded: { borderRadius: 'md' },
    },
  },
  defaultVariants: { radius: 'sharp' },
})

// NOTE: Catches the click outside an open popup that closes it. Transparent: the page stays visible and live.
export const backdropClass = css({
  position: 'fixed',
  inset: '0',
  zIndex: 'popupBackdrop',
  bg: 'transparent',
})

// NOTE: A list of rows inside the surface (Select's options; later a Dropdown's items). The highlighted row is
// inverted, ink with paper text, so it reads at a glance whichever way it was reached. The selected row carries a
// red check; highlighted and selected, it turns red.
export const listRecipe = sva({
  slots: [
    'viewport',
    'row',
    'content',
    'label',
    'icon',
    'check',
    'heading',
    'separator',
  ],
  base: {
    viewport: {
      boxSizing: 'border-box',
      minHeight: '0',
      maxHeight: 'popupListMax',
      padding: '1',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
    row: {
      position: 'relative',
      display: 'flex',
      flexShrink: '0',
      alignItems: 'center',
      boxSizing: 'border-box',
      color: 'fg.default',
      fontFamily: 'body',
      lineHeight: 'normal',
      cursor: 'pointer',
      outline: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: 'fast',
      transitionTimingFunction: 'out',
      '&[data-active]': { bg: 'bg.inverse', color: 'fg.inverse' },
      '&[data-active][aria-selected=true]': {
        bg: 'bg.accent',
        color: 'fg.inverse',
      },
      '&[aria-disabled=true]': { opacity: 'disabled', cursor: 'default' },
      _motionReduce: { transitionProperty: 'none' },
    },
    // NOTE: display: contents, so the icon, label and check lay out in the row's own flex box.
    content: { display: 'contents' },
    label: {
      flex: '1',
      minWidth: '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    icon: { display: 'flex', flexShrink: '0' },
    check: {
      display: 'flex',
      flexShrink: '0',
      color: 'fg.accent',
      opacity: 'hidden',
      '[aria-selected=true] &': { opacity: 'visible' },
      '[data-active] &': { color: 'fg.inverse' },
    },
    heading: {
      display: 'block',
      fontFamily: 'mono',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
      color: 'fg.muted',
    },
    separator: {
      height: '0',
      marginBlock: '1',
      borderTopWidth: 'thin',
      borderTopStyle: 'solid',
      borderColor: 'border.subtle',
    },
  },
  variants: {
    size: {
      default: {
        row: {
          height: 'control',
          gap: '2',
          paddingInline: '2',
          fontSize: 'sm',
        },
        heading: {
          paddingInline: '2',
          paddingTop: '2',
          paddingBottom: '1',
          fontSize: 'xs',
        },
      },
      compact: {
        row: {
          height: 'controlCompact',
          gap: '1',
          paddingInline: '1',
          fontSize: 'xs',
        },
        heading: {
          paddingInline: '1',
          paddingTop: '1',
          paddingBottom: '0.5',
          fontSize: 'xs',
        },
      },
    },
    radius: {
      sharp: { row: { borderRadius: 'none' } },
      rounded: { row: { borderRadius: 'sm' } },
    },
  },
  defaultVariants: { size: 'default', radius: 'sharp' },
})

export type RowProps = Readonly<{
  label: string
  icon?: Icon.Name
  /** Reserve room for a check mark, shown when the row is selected (aria-selected). */
  check?: boolean
  size: Size
  radius: Radius
}>

/** What goes inside a row. The primitive renders the row element itself, with its role and state. */
export const rowContent = <Message>(
  props: RowProps,
  h: HtmlBuilder<Message>,
): Html => {
  const classes = listRecipe({ size: props.size, radius: props.radius })
  const iconSize = props.size === 'compact' ? 'sm' : 'md'
  return h.span(
    [h.Class(classes.content)],
    [
      props.icon === undefined
        ? null
        : h.span(
            [h.Class(classes.icon), h.AriaHidden(true)],
            [Icon.view({ name: props.icon, size: iconSize }, h)],
          ),
      h.span([h.Class(classes.label)], [props.label]),
      props.check
        ? h.span(
            [h.Class(classes.check), h.AriaHidden(true)],
            [Icon.view({ name: 'check', size: iconSize }, h)],
          )
        : null,
    ],
  )
}
