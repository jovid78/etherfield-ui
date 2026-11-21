import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { sva } from '@etherfield/ui/css'

// NOTE: The original links its description and error to the control with a MutationObserver at mount. Here Field
// knows both ids when it renders and hands them to the control, so the link is in the prerendered HTML too.

const fieldRecipe = sva({
  slots: ['root', 'label', 'description', 'error'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      width: 'full',
      minWidth: '0',
    },
    label: {
      width: 'fit',
      fontFamily: 'heading',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'normal',
      color: 'fg.default',
      cursor: 'pointer',
    },
    description: {
      margin: '0',
      fontFamily: 'caption',
      fontSize: 'sm',
      fontStyle: 'italic',
      lineHeight: 'snug',
      color: 'fg.muted',
      textWrap: 'pretty',
    },
    error: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '2',
      margin: '0',
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: 'snug',
      color: 'fg.error',
      // NOTE: A small red square stands in for the original's alert icon.
      _before: {
        content: '""',
        flexShrink: '0',
        width: 'errorMarker',
        height: 'errorMarker',
        bg: 'fg.error',
      },
    },
  },
  variants: {
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
  defaultVariants: { invalid: false, disabled: false },
})

export const descriptionId = (id: string): string => `${id}-description`
export const errorId = (id: string): string => `${id}-error`

/** What Field hands to its control. The keys match Input's and Textarea's props, so they can be spread in. */
export type Control = Readonly<{
  id: string
  describedBy?: string
  invalid: boolean
  disabled: boolean
}>

export type Props<Message> = Readonly<{
  /** The control's id. The label, description and error ids derive from it. */
  id: string
  label: string
  description?: string
  /** Shown when set; also marks the control invalid. */
  error?: string
  disabled?: boolean
  control: (control: Control) => Html
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const invalid = props.error !== undefined
  const disabled = props.disabled ?? false
  const describedBy = [
    ...(props.description === undefined ? [] : [descriptionId(props.id)]),
    ...(invalid ? [errorId(props.id)] : []),
  ].join(' ')
  const classes = fieldRecipe({ invalid, disabled })

  return h.div(
    [
      h.Class(classes.root),
      h.DataAttribute('slot', 'field'),
      ...(invalid ? [h.DataAttribute('invalid', '')] : []),
      ...(disabled ? [h.DataAttribute('disabled', '')] : []),
      ...(props.attributes ?? []),
    ],
    [
      h.label(
        [h.Class(classes.label), h.For(props.id), h.Id(`${props.id}-label`)],
        [props.label],
      ),
      props.control({
        id: props.id,
        ...(describedBy === '' ? {} : { describedBy }),
        invalid,
        disabled,
      }),
      props.description === undefined
        ? null
        : h.p(
            [h.Class(classes.description), h.Id(descriptionId(props.id))],
            [props.description],
          ),
      props.error === undefined
        ? null
        : h.p(
            [h.Class(classes.error), h.Id(errorId(props.id)), h.Role('alert')],
            [props.error],
          ),
    ],
  )
}
