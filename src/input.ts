import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cva, cx } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Input as Primitive } from '@foldkit/ui'

import { controlRecipe, type Radius, type Size, wrapperClass } from './control'
import * as Icon from './icon'

const inputRecipe = cva({
  base: {},
  variants: {
    size: {
      default: { height: 'control' },
      compact: { height: 'controlCompact' },
    },
    icon: { true: {}, false: {} },
    stepper: {
      // NOTE: Hide the browser's own spin buttons; the + and - buttons replace them.
      true: {
        appearance: 'textfield',
        '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
          appearance: 'none',
        },
      },
      false: {},
    },
    file: {
      true: {
        color: 'fg.muted',
        cursor: 'pointer',
        _file: {
          marginInlineEnd: '2',
          padding: '0',
          border: 'none',
          bg: 'transparent',
          color: 'fg.default',
          fontFamily: 'heading',
          fontSize: 'xs',
          fontWeight: 'medium',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          cursor: 'pointer',
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    { size: 'default', icon: true, css: { paddingInlineStart: 'iconInset' } },
    {
      size: 'compact',
      icon: true,
      css: { paddingInlineStart: 'iconInsetCompact' },
    },
    {
      size: 'default',
      stepper: true,
      css: { paddingInlineEnd: 'stepperInset' },
    },
    {
      size: 'compact',
      stepper: true,
      css: { paddingInlineEnd: 'stepperInsetCompact' },
    },
    { size: 'default', file: true, css: { paddingBlock: 'fileInset' } },
    { size: 'compact', file: true, css: { paddingBlock: '1' } },
  ],
})

const leadingIconRecipe = cva({
  base: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
    color: 'fg.muted',
    pointerEvents: 'none',
  },
  variants: {
    size: { default: { left: '3' }, compact: { left: '2' } },
  },
})

const stepperRecipe = cva({
  base: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
  },
  variants: {
    size: { default: { right: '1' }, compact: { right: '0.5' } },
  },
})

const stepButtonRecipe = cva({
  base: {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    border: 'none',
    bg: 'transparent',
    color: 'fg.muted',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'out',
    _hover: { color: 'fg.default', bg: 'bg.tint' },
    _disabled: { opacity: 'disabled', pointerEvents: 'none' },
  },
  variants: {
    size: {
      default: { width: 'stepButton', height: 'stepButton' },
      compact: { width: 'stepButtonCompact', height: 'stepButtonCompact' },
    },
    radius: {
      sharp: { borderRadius: 'none' },
      rounded: { borderRadius: 'sm' },
      pill: { borderRadius: 'pill' },
    },
  },
})

export type Limits = Readonly<{ min?: number; max?: number; step?: number }>

const decimals = (step: number): number =>
  (String(step).split('.')[1] ?? '').length

/** The value one step up or down, kept within min and max. An empty or non-numeric value counts as 0. */
export const stepValue = (
  value: string,
  direction: 1 | -1,
  limits: Limits,
): string => {
  const step = limits.step ?? 1
  const current = Number(value)
  const base = value.trim() === '' || Number.isNaN(current) ? 0 : current
  const next = Math.min(
    limits.max ?? Infinity,
    Math.max(limits.min ?? -Infinity, base + direction * step),
  )
  return String(Number(next.toFixed(decimals(step))))
}

const atLimit = (value: string, direction: 1 | -1, limits: Limits): boolean => {
  const current = Number(value)
  if (value.trim() === '' || Number.isNaN(current)) return false
  return direction === 1
    ? limits.max !== undefined && current >= limits.max
    : limits.min !== undefined && current <= limits.min
}

export type Props<Message> = Readonly<{
  id: string
  value?: string
  onInput?: (value: string) => Message
  /** text (default), email, search, password, number or file. number adds + and - buttons; file adds a page icon. */
  type?: string
  placeholder?: string
  name?: string
  /** Space-separated ids of the elements that describe the input. Field sets this. */
  describedBy?: string
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  required?: boolean
  maxLength?: number
  autoComplete?: string
  size?: Size
  radius?: Radius
  /** An icon inside the input, before the text. */
  icon?: Icon.Name
  /** For type number. The + and - buttons send onInput with the next value. */
  min?: number
  max?: number
  step?: number
  /** For type file. */
  onFiles?: (files: ReadonlyArray<File>) => Message
  accept?: string
  multiple?: boolean
  /** For an input without a visible label. Inside a Field, the label names it. */
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const type = props.type ?? 'text'
  const size = props.size ?? 'default'
  const radius = props.radius ?? 'sharp'
  const file = type === 'file'
  const stepper = type === 'number'
  const icon = props.icon ?? (file ? 'page' : undefined)
  const limits: Limits = {
    ...(props.min === undefined ? {} : { min: props.min }),
    ...(props.max === undefined ? {} : { max: props.max }),
    ...(props.step === undefined ? {} : { step: props.step }),
  }
  const value = props.value ?? ''

  const stepButton = (direction: 1 | -1) =>
    h.button(
      [
        h.Type('button'),
        // NOTE: Not in the tab order: the arrow keys already step a focused number input.
        h.Tabindex(-1),
        h.Class(stepButtonRecipe({ size, radius })),
        h.AriaLabel(direction === 1 ? 'Increase' : 'Decrease'),
        h.Disabled(
          (props.disabled ?? false) ||
            (props.readOnly ?? false) ||
            props.onInput === undefined ||
            atLimit(value, direction, limits),
        ),
        ...(props.onInput === undefined
          ? []
          : [h.OnClick(props.onInput(stepValue(value, direction, limits)))]),
      ],
      [
        Icon.view(
          {
            name: direction === 1 ? 'plus' : 'minus',
            size: size === 'compact' ? 'sm' : 'md',
          },
          h,
        ),
      ],
    )

  return Primitive.view(
    {
      id: props.id,
      ...(file || props.value === undefined ? {} : { value: props.value }),
      ...(file || props.onInput === undefined
        ? {}
        : { onInput: props.onInput }),
      ...(props.placeholder === undefined
        ? {}
        : { placeholder: props.placeholder }),
      ...(props.name === undefined ? {} : { name: props.name }),
      type,
      isDisabled: props.disabled ?? false,
      isReadOnly: props.readOnly ?? false,
      isInvalid: props.invalid ?? false,
      toView: ({ input }) =>
        h.span(
          [h.Class(wrapperClass)],
          [
            icon === undefined
              ? null
              : h.span(
                  [h.Class(leadingIconRecipe({ size })), h.AriaHidden(true)],
                  [
                    Icon.view(
                      { name: icon, size: size === 'compact' ? 'sm' : 'md' },
                      h,
                    ),
                  ],
                ),
            h.input([
              ...input,
              h.Class(
                cx(
                  controlRecipe({ size, radius }),
                  inputRecipe({
                    size,
                    icon: icon !== undefined,
                    stepper,
                    file,
                  }),
                ),
              ),
              h.DataAttribute('slot', 'input'),
              ...(props.describedBy
                ? [h.AriaDescribedBy(props.describedBy)]
                : []),
              ...(props.required ? [h.Required(true)] : []),
              ...(props.maxLength === undefined
                ? []
                : [h.Maxlength(props.maxLength)]),
              ...(props.autoComplete
                ? [h.Autocomplete(props.autoComplete)]
                : []),
              ...(props.min === undefined ? [] : [h.Min(String(props.min))]),
              ...(props.max === undefined ? [] : [h.Max(String(props.max))]),
              ...(props.step === undefined ? [] : [h.Step(String(props.step))]),
              ...(props.accept === undefined ? [] : [h.Accept(props.accept)]),
              ...(props.multiple ? [h.Multiple(true)] : []),
              ...(props.onFiles === undefined
                ? []
                : [h.OnFileChange(props.onFiles)]),
              ...(props.label === undefined ? [] : [h.AriaLabel(props.label)]),
              ...(props.attributes ?? []),
            ]),
            stepper
              ? h.span(
                  [h.Class(stepperRecipe({ size }))],
                  [stepButton(-1), stepButton(1)],
                )
              : null,
          ],
        ),
    },
    h,
  )
}
