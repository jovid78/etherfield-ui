import type { Attribute, ChildAttribute, Html, HtmlBuilder } from 'foldkit/html'

// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { css, sva } from '@etherfield/ui/css'

import * as Icon from './icon'

// NOTE: The original links its description and error to the control with a MutationObserver at mount. Here Field
// knows both ids when it renders and hands them to the control, so the link is in the prerendered HTML too.

export type Size = 'default' | 'compact'
/** Vertical: label above the control. Horizontal: the control first, its label and description beside it (for
 * checkboxes and switches). */
export type Orientation = 'vertical' | 'horizontal'

const fieldRecipe = sva({
  slots: ['root', 'content', 'label', 'description', 'error'],
  base: {
    root: { display: 'flex', width: 'full', minWidth: '0' },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      flex: '1',
      minWidth: '0',
    },
    label: {
      width: 'fit',
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'normal',
      color: 'fg.default',
      cursor: 'pointer',
      // NOTE: Inside a disabled fieldset the browser disables the control; dim its label to match.
      'fieldset:disabled &': { opacity: 'disabled', cursor: 'default' },
    },
    description: {
      margin: '0',
      fontFamily: 'caption',
      fontStyle: 'italic',
      lineHeight: 'snug',
      color: 'fg.muted',
      textWrap: 'pretty',
      'fieldset:disabled &': { opacity: 'disabled' },
    },
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
    orientation: {
      vertical: { root: { flexDirection: 'column', gap: '2' } },
      horizontal: {
        root: { flexDirection: 'row', alignItems: 'flex-start', gap: '3' },
      },
    },
    size: {
      default: {
        label: { fontSize: 'sm' },
        description: { fontSize: 'sm' },
        error: { fontSize: 'sm' },
      },
      compact: {
        label: { fontSize: 'xs' },
        description: { fontSize: 'xs' },
        error: { fontSize: 'xs' },
      },
    },
    invalid: {
      true: { label: { color: 'fg.error' } },
      false: {},
    },
    disabled: {
      true: {
        label: { opacity: 'disabled', cursor: 'default' },
        description: { opacity: 'disabled' },
      },
      false: {},
    },
  },
  compoundVariants: [
    // NOTE: A checkbox's or switch's label stays ink when invalid, as in the original. The error says what's wrong.
    {
      orientation: 'horizontal',
      invalid: true,
      css: { label: { color: 'fg.default' } },
    },
  ],
  defaultVariants: {
    orientation: 'vertical',
    size: 'default',
    invalid: false,
    disabled: false,
  },
})

export const descriptionId = (id: string): string => `${id}-description`
export const errorId = (id: string): string => `${id}-error`

/** What Field hands to its control. The keys match Input's and Textarea's props, so they can be spread in. */
export type Control = Readonly<{
  id: string
  describedBy?: string
  invalid: boolean
  disabled: boolean
  size: Size
}>

export type Props<Message> = Readonly<{
  /** The control's id. The label, description and error ids derive from it. */
  id: string
  label: string
  description?: string
  /** Shown when set; also marks the control invalid. */
  error?: string
  disabled?: boolean
  size?: Size
  orientation?: Orientation
  control: (control: Control) => Html
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const invalid = props.error !== undefined
  const disabled = props.disabled ?? false
  const size = props.size ?? 'default'
  const orientation = props.orientation ?? 'vertical'
  const describedBy = [
    ...(props.description === undefined ? [] : [descriptionId(props.id)]),
    ...(invalid ? [errorId(props.id)] : []),
  ].join(' ')
  const classes = fieldRecipe({ orientation, size, invalid, disabled })

  const label = h.label(
    [h.Class(classes.label), h.For(props.id), h.Id(`${props.id}-label`)],
    [props.label],
  )
  const control = props.control({
    id: props.id,
    ...(describedBy === '' ? {} : { describedBy }),
    invalid,
    disabled,
    size,
  })
  const description =
    props.description === undefined
      ? null
      : h.p(
          [h.Class(classes.description), h.Id(descriptionId(props.id))],
          [props.description],
        )
  const error =
    props.error === undefined
      ? null
      : h.p(
          [h.Class(classes.error), h.Id(errorId(props.id)), h.Role('alert')],
          [
            Icon.view(
              {
                name: 'warning-circle',
                size: size === 'compact' ? 'sm' : 'md',
              },
              h,
            ),
            props.error,
          ],
        )

  return h.div(
    [
      h.Class(classes.root),
      h.DataAttribute('slot', 'field'),
      h.DataAttribute('orientation', orientation),
      ...(invalid ? [h.DataAttribute('invalid', '')] : []),
      ...(disabled ? [h.DataAttribute('disabled', '')] : []),
      ...(props.attributes ?? []),
    ],
    orientation === 'horizontal'
      ? [
          control,
          h.div([h.Class(classes.content)], [label, description, error]),
        ]
      : [label, control, description, error],
  )
}

const groupClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
  width: 'full',
  minWidth: '0',
})

export type GroupProps<Message> = Readonly<{
  children: ReadonlyArray<Html>
  attributes?: ReadonlyArray<Attribute<Message>>
}>

/** Stacks fields with even spacing. */
export const group = <Message>(
  props: GroupProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(groupClass),
      h.DataAttribute('slot', 'field-group'),
      ...(props.attributes ?? []),
    ],
    props.children,
  )

const setRecipe = sva({
  slots: ['root', 'legend', 'content', 'description'],
  base: {
    // NOTE: A <legend> doesn't take part in its fieldset's flex or grid layout, so the fieldset is a plain block and
    // the rest of its content sits in a flex column after the legend.
    root: { minWidth: '0', margin: '0', padding: '0', border: 'none' },
    legend: {
      padding: '0',
      marginBottom: '1',
      fontFamily: 'heading',
      color: 'fg.default',
    },
    content: { display: 'flex', flexDirection: 'column', gap: '4' },
    description: {
      margin: '0',
      fontFamily: 'caption',
      fontSize: 'sm',
      fontStyle: 'italic',
      lineHeight: 'snug',
      color: 'fg.muted',
      textWrap: 'pretty',
    },
  },
  variants: {
    // NOTE: legend titles a section of a form; label names a group of choices, like a radio group's question.
    legend: {
      legend: {
        legend: { fontSize: 'md', fontWeight: 'semibold', lineHeight: 'snug' },
      },
      label: {
        legend: { fontSize: 'sm', fontWeight: 'medium', lineHeight: 'normal' },
      },
    },
    disabled: {
      true: {
        legend: { opacity: 'disabled' },
        description: { opacity: 'disabled' },
      },
      false: {},
    },
  },
  defaultVariants: { legend: 'legend', disabled: false },
})

export type SetProps<Message> = Readonly<{
  /** Used for the description's id. */
  id: string
  legend: string
  /** legend (default) titles a section of a form; label is smaller, for a group of choices. */
  legendStyle?: 'legend' | 'label'
  description?: string
  /** Disables every control inside, natively. */
  disabled?: boolean
  children: ReadonlyArray<Html>
  /** Also takes a Foldkit UI primitive's group attributes, so RadioGroup can make the fieldset its radiogroup. */
  attributes?: ReadonlyArray<Attribute<Message> | ChildAttribute>
}>

/** A <fieldset> with its <legend>: groups related fields under one title. */
export const set = <Message>(
  props: SetProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const disabled = props.disabled ?? false
  const classes = setRecipe({ legend: props.legendStyle ?? 'legend', disabled })
  return h.fieldset(
    [
      h.Class(classes.root),
      h.DataAttribute('slot', 'field-set'),
      h.Disabled(disabled),
      ...(props.description === undefined
        ? []
        : [h.AriaDescribedBy(descriptionId(props.id))]),
      ...(props.attributes ?? []),
    ],
    [
      h.legend([h.Class(classes.legend)], [props.legend]),
      h.div(
        [h.Class(classes.content)],
        [
          props.description === undefined
            ? null
            : h.p(
                [h.Class(classes.description), h.Id(descriptionId(props.id))],
                [props.description],
              ),
          ...props.children,
        ],
      ),
    ],
  )
}

const separatorRecipe = sva({
  slots: ['root', 'line', 'text'],
  base: {
    root: { display: 'flex', alignItems: 'center', gap: '2', width: 'full' },
    line: {
      flex: '1',
      borderTopWidth: 'thin',
      borderTopStyle: 'solid',
      borderColor: 'border.subtle',
    },
    text: {
      fontFamily: 'mono',
      fontSize: 'xs',
      color: 'fg.muted',
    },
  },
})

export type SeparatorProps<Message> = Readonly<{
  /** Short text in the middle of the line, like "or". */
  text?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

/** A thin line between fields, with optional text. */
export const separator = <Message>(
  props: SeparatorProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const classes = separatorRecipe()
  return h.div(
    [
      h.Class(classes.root),
      h.DataAttribute('slot', 'field-separator'),
      h.Role('separator'),
      ...(props.attributes ?? []),
    ],
    [
      h.div([h.Class(classes.line), h.AriaHidden(true)], []),
      ...(props.text === undefined
        ? []
        : [
            h.span([h.Class(classes.text)], [props.text]),
            h.div([h.Class(classes.line), h.AriaHidden(true)], []),
          ]),
    ],
  )
}
