import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { sva } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Switch as Primitive } from '@foldkit/ui'

import { alignRecipe, type Size } from './choice'

// NOTE: The original animates the thumb with a spring (motion) and lets you drag it across. Here it slides with a
// CSS transition and toggles on click, Space or its label; dragging isn't ported.

const switchRecipe = sva({
  slots: ['track', 'thumb'],
  base: {
    // NOTE: The button is the track: sharp, ink-bordered, the pale field fill. On, it turns red.
    track: {
      position: 'relative',
      display: 'inline-block',
      flexShrink: '0',
      boxSizing: 'border-box',
      padding: '0',
      margin: '0',
      borderWidth: 'thin',
      borderStyle: 'solid',
      borderColor: 'border.default',
      borderRadius: 'none',
      bg: 'bg.field',
      cursor: 'pointer',
      outline: 'none',
      transitionProperty: 'background-color, border-color',
      transitionDuration: 'fast',
      transitionTimingFunction: 'out',
      _hover: { bg: 'bg.canvas' },
      '[data-slot=field]:hover &': { bg: 'bg.canvas' },
      '&[aria-invalid=true]': { borderColor: 'border.error' },
      _checked: {
        bg: 'bg.accent',
        borderColor: 'bg.accent',
        _hover: { bg: 'bg.accentPressed', borderColor: 'bg.accentPressed' },
        '[data-slot=field]:hover &': {
          bg: 'bg.accentPressed',
          borderColor: 'bg.accentPressed',
        },
      },
      // NOTE: Field Manual focus: the red underline Button uses, 2px below the track.
      _after: {
        content: '""',
        position: 'absolute',
        insetInline: '0',
        bottom: 'focusOffset',
        height: 'focusLine',
        bg: 'focus.ring',
        boxShadow: 'focusGlow',
        opacity: 'hidden',
        pointerEvents: 'none',
      },
      _focusVisible: { _after: { opacity: 'visible' } },
      _disabled: { opacity: 'disabled', pointerEvents: 'none' },
      '&[data-readonly]': { cursor: 'default' },
    },
    // NOTE: An ink square when off; paper on red when on.
    thumb: {
      position: 'absolute',
      top: '0.5',
      left: '0.5',
      display: 'block',
      bg: 'fg.default',
      transitionProperty: 'transform, background-color',
      transitionDuration: 'normal',
      transitionTimingFunction: 'out',
      _motionReduce: { transitionDuration: 'instant' },
      '[aria-checked=true] > &': { bg: 'fg.inverse' },
    },
  },
  variants: {
    size: {
      default: {
        track: { width: 'switchWidth', height: 'switchHeight' },
        thumb: {
          width: 'switchThumb',
          height: 'switchThumb',
          '[aria-checked=true] > &': {
            transform: 'translateX({spacing.switchTravel})',
          },
        },
      },
      compact: {
        track: { width: 'switchWidthCompact', height: 'switchHeightCompact' },
        thumb: {
          width: 'switchThumbCompact',
          height: 'switchThumbCompact',
          '[aria-checked=true] > &': {
            transform: 'translateX({spacing.switchTravelCompact})',
          },
        },
      },
    },
  },
  defaultVariants: { size: 'default' },
})

export type Props<Message> = Readonly<{
  id: string
  checked: boolean
  onToggle: (checked: boolean) => Message
  /** Space-separated ids of the elements that describe the switch. Field sets this. */
  describedBy?: string
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  size?: Size
  /** With a name, a hidden input sends `value` (default "on") with a form while on. */
  name?: string
  value?: string
  /** For a switch without a visible label. Inside a Field, the label names it. */
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

/** A switch on its own. Put it in a Field with `orientation: 'horizontal'` to give it a label and description. */
export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? 'default'
  const disabled = props.disabled ?? false
  const classes = switchRecipe({ size })
  return Primitive.view(
    {
      id: props.id,
      isChecked: props.checked,
      onToggle: props.onToggle,
      isDisabled: disabled,
      isReadOnly: props.readOnly ?? false,
      ...(props.name === undefined ? {} : { name: props.name }),
      ...(props.value === undefined ? {} : { value: props.value }),
      toView: ({ button, hiddenInput }) =>
        h.span(
          [h.Class(alignRecipe({ size }))],
          [
            h.button(
              [
                ...button,
                h.Id(props.id),
                h.Class(classes.track),
                h.DataAttribute('slot', 'switch'),
                h.Disabled(disabled),
                ...(props.describedBy
                  ? [h.AriaDescribedBy(props.describedBy)]
                  : []),
                ...(props.invalid ? [h.AriaInvalid(true)] : []),
                ...(props.label === undefined
                  ? []
                  : [h.AriaLabel(props.label)]),
                ...(props.attributes ?? []),
              ],
              [h.span([h.Class(classes.thumb), h.AriaHidden(true)], [])],
            ),
            props.name === undefined
              ? null
              : h.input([
                  ...hiddenInput,
                  h.Disabled(disabled || !props.checked),
                ]),
          ],
        ),
    },
    h,
  )
}
