import { Option } from 'effect'
import { Submodel } from 'foldkit'

import { cva } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { RadioGroup as Primitive } from '@foldkit/ui'

import { alignRecipe, groupErrorId, groupView, type Size } from './choice'
import * as Field from './field'

// NOTE: The original slides a shared selection background between rows and springs the dot in (motion), with a
// shared hover highlight and Left/Right as extra arrow keys. Here the group is a Field.set (its <legend> asks the
// question, and the <fieldset> itself is the radiogroup) of horizontal Fields, and the selected radio fills red.
// Up and Down (and Home, End) move and select, as the primitive provides; the animations aren't ported.

const radioRecipe = cva({
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
    // NOTE: Radios stay round, even in Field Manual: the circle is what tells them from checkboxes.
    borderRadius: 'pill',
    bg: 'bg.field',
    cursor: 'pointer',
    outline: 'none',
    transitionProperty: 'background-color, border-color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'out',
    _hover: { bg: 'bg.canvas' },
    '[data-slot=field]:hover &': { bg: 'bg.canvas' },
    '[aria-invalid=true] &': { borderColor: 'border.error' },
    // NOTE: The dot, paper on red, shows only on the selected radio.
    _before: {
      content: '""',
      display: 'block',
      borderRadius: 'pill',
      bg: 'fg.inverse',
      opacity: 'hidden',
    },
    _checked: {
      bg: 'bg.accent',
      borderColor: 'bg.accent',
      _before: { opacity: 'visible' },
      _hover: { bg: 'bg.accentPressed', borderColor: 'bg.accentPressed' },
      '[data-slot=field]:hover &': {
        bg: 'bg.accentPressed',
        borderColor: 'bg.accentPressed',
      },
    },
    // NOTE: Field Manual focus: the red underline Button uses, 2px below the radio.
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
      default: {
        width: 'choice',
        height: 'choice',
        _before: { width: 'radioDot', height: 'radioDot' },
      },
      compact: {
        width: 'choiceCompact',
        height: 'choiceCompact',
        _before: { width: 'radioDotCompact', height: 'radioDotCompact' },
      },
    },
  },
  defaultVariants: { size: 'default' },
})

const behavior = Primitive.create()

export const Model = Primitive.Model
export type Model = Primitive.Model
export const Message = Primitive.Message
export type Message = Primitive.Message
export const OutMessage = Primitive.OutMessage
export type OutMessage = Primitive.OutMessage
/** The Command an update issues to move focus to the chosen option. Scene tests resolve it with
 * `Message.CompletedFocusOption()`. */
export const FocusOption = Primitive.FocusOption
/** The model holds only focus state; the parent owns the selected value. `id` also names every option's id. */
export const init = Primitive.init
/** Fold with `Update.foldChild`; its `Selected` OutMessage carries the newly chosen value. */
export const update = behavior.update

export type Item = Readonly<{
  value: string
  label: string
  description?: string
  disabled?: boolean
}>

export type Props = Readonly<{
  /** The question the group answers. Also names the radiogroup. */
  legend: string
  description?: string
  items: ReadonlyArray<Item>
  /** The selected item's value. None selected when undefined. */
  value?: string
  /** Shown under the options when set; also marks the group invalid. */
  error?: string
  disabled?: boolean
  size?: Size
  /** With a name, a hidden input sends the selected value with a form. */
  name?: string
}>

export const view = Submodel.defineView<Model, Message, Props>(
  (model, props, h) => {
    const size = props.size ?? 'default'
    const invalid = props.error !== undefined
    return h.submodel({
      slotId: 'behavior',
      model,
      view: behavior.view,
      toParentMessage: message => message,
      viewInputs: {
        options: props.items.map(item => item.value),
        selectedValue: Option.fromUndefinedOr(props.value),
        ariaLabel: props.legend,
        orientation: 'Vertical',
        ...(props.name === undefined ? {} : { name: props.name }),
        isDisabled: props.disabled ?? false,
        isOptionDisabled: (_, index) => props.items[index]?.disabled ?? false,
        hasOptionDescription: (_, index) =>
          props.items[index]?.description !== undefined,
        toView: ({ group, options, hiddenInput }) =>
          Field.set(
            {
              id: model.id,
              legend: props.legend,
              legendStyle: 'label',
              ...(props.description === undefined
                ? {}
                : { description: props.description }),
              disabled: props.disabled ?? false,
              attributes: [
                ...group,
                h.DataAttribute('slot', 'radio-group'),
                ...(invalid
                  ? [
                      h.AriaInvalid(true),
                      // NOTE: Replaces the fieldset's own aria-describedby, so the error is read after the
                      // description.
                      h.AriaDescribedBy(
                        [
                          ...(props.description === undefined
                            ? []
                            : [Field.descriptionId(model.id)]),
                          groupErrorId(model.id),
                        ].join(' '),
                      ),
                    ]
                  : []),
              ],
              children: [
                ...groupView(
                  {
                    id: model.id,
                    size,
                    ...(props.error === undefined
                      ? {}
                      : { error: props.error }),
                    items: options.map(option => {
                      const item = props.items[option.index]
                      return Field.view(
                        {
                          // NOTE: The primitive's option id. Field derives the label and description ids from it,
                          // and they match the ids the option's aria-labelledby and aria-describedby point at.
                          id: `${model.id}-option-${option.index}`,
                          label: item?.label ?? option.value,
                          ...(item?.description === undefined
                            ? {}
                            : { description: item.description }),
                          orientation: 'horizontal',
                          size,
                          disabled: option.isDisabled,
                          control: () =>
                            h.span(
                              [h.Class(alignRecipe({ size }))],
                              [
                                h.button(
                                  [
                                    ...option.option,
                                    h.Class(radioRecipe({ size })),
                                    h.DataAttribute('slot', 'radio'),
                                    h.Disabled(option.isDisabled),
                                  ],
                                  [],
                                ),
                              ],
                            ),
                        },
                        h,
                      )
                    }),
                  },
                  h,
                ),
                props.name === undefined ? null : h.input(hiddenInput),
              ],
            },
            h,
          ),
      },
    })
  },
)
