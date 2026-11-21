import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cva } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Checkbox as Primitive } from '@foldkit/ui'

import { alignRecipe, type Size } from './choice'
import * as Icon from './icon'

// NOTE: The original draws the tick with an animated stroke; here the Iconoir check or minus simply appears.
// The original also moves Enter to choice cards and mirrors the state into a hidden checkbox for `required`. Not
// ported: there are no choice cards yet, and the hidden input below carries the value for forms.

const checkboxRecipe = cva({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    boxSizing: 'border-box',
    padding: '0',
    margin: '0',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: 'border.default',
    borderRadius: 'none',
    bg: 'bg.field',
    color: 'fg.inverse',
    cursor: 'pointer',
    outline: 'none',
    transitionProperty: 'background-color, border-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'out',
    // NOTE: Hover dims the box back to paper, also when the pointer is over its label.
    _hover: { bg: 'bg.canvas' },
    '[data-slot=field]:hover &': { bg: 'bg.canvas' },
    '&[aria-invalid=true]': { borderColor: 'border.error' },
    // NOTE: Checked and indeterminate fill the box with red; the mark is paper on red.
    '&:is([aria-checked=true], [aria-checked=mixed])': {
      bg: 'bg.accent',
      borderColor: 'bg.accent',
      _hover: { bg: 'bg.accentPressed', borderColor: 'bg.accentPressed' },
      '[data-slot=field]:hover &': {
        bg: 'bg.accentPressed',
        borderColor: 'bg.accentPressed',
      },
    },
    // NOTE: Field Manual focus: the red underline Button uses, 2px below the box.
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
  variants: {
    size: {
      default: { width: 'choice', height: 'choice' },
      compact: { width: 'choiceCompact', height: 'choiceCompact' },
    },
  },
  defaultVariants: { size: 'default' },
})

export type Props<Message> = Readonly<{
  id: string
  checked: boolean
  /** Shows a dash instead of the tick, for a parent of a partly checked group. Announced as "mixed". */
  indeterminate?: boolean
  onToggle: (checked: boolean) => Message
  /** Space-separated ids of the elements that describe the checkbox. Field sets this. */
  describedBy?: string
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  size?: Size
  /** With a name, a hidden input sends `value` (default "on") with a form while checked. */
  name?: string
  value?: string
  /** For a checkbox without a visible label. Inside a Field, the label names it. */
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

/** A checkbox on its own. Put it in a Field with `orientation: 'horizontal'` to give it a label and description. */
export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? 'default'
  const disabled = props.disabled ?? false
  const indeterminate = props.indeterminate ?? false
  return Primitive.view(
    {
      id: props.id,
      isChecked: props.checked,
      isIndeterminate: indeterminate,
      onToggle: props.onToggle,
      isDisabled: disabled,
      isReadOnly: props.readOnly ?? false,
      ...(props.name === undefined ? {} : { name: props.name }),
      ...(props.value === undefined ? {} : { value: props.value }),
      toView: ({ checkbox, hiddenInput }) =>
        h.span(
          [h.Class(alignRecipe({ size }))],
          [
            h.button(
              [
                ...checkbox,
                h.Id(props.id),
                h.Class(checkboxRecipe({ size })),
                h.DataAttribute('slot', 'checkbox'),
                // NOTE: The primitive keeps a disabled checkbox focusable; like the original, take it out of the
                // tab order. Inside a disabled fieldset the browser disables the button natively too.
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
              props.checked || indeterminate
                ? [
                    Icon.view(
                      {
                        name: indeterminate ? 'minus' : 'check',
                        size: size === 'compact' ? 'sm' : 'md',
                        // NOTE: A heavier stroke than Iconoir's 1.5, so the mark holds up at this size.
                        attributes: [h.Attribute('stroke-width', '2')],
                      },
                      h,
                    ),
                  ]
                : [],
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
