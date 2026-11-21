import type { Html, HtmlBuilder, TextareaAttribute } from 'foldkit/html'

import { css, cx } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Textarea as Primitive } from '@foldkit/ui'

import { controlClass, wrapperClass } from './control'

// NOTE: Grows with its content between textareaMin and textareaMax, then scrolls.
const textareaClass = cx(
  controlClass,
  css({
    fieldSizing: 'content',
    resize: 'none',
    minHeight: 'textareaMin',
    maxHeight: 'textareaMax',
    paddingBlock: '2',
  }),
)

export type Props<Message> = Readonly<{
  id: string
  value?: string
  onInput?: (value: string) => Message
  placeholder?: string
  name?: string
  rows?: number
  /** Space-separated ids of the elements that describe the textarea. Field sets this. */
  describedBy?: string
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  required?: boolean
  maxLength?: number
  /** For a textarea without a visible label. Inside a Field, the label names it. */
  label?: string
  attributes?: ReadonlyArray<TextareaAttribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  Primitive.view(
    {
      id: props.id,
      ...(props.value === undefined ? {} : { value: props.value }),
      ...(props.onInput === undefined ? {} : { onInput: props.onInput }),
      ...(props.placeholder === undefined
        ? {}
        : { placeholder: props.placeholder }),
      ...(props.name === undefined ? {} : { name: props.name }),
      ...(props.rows === undefined ? {} : { rows: props.rows }),
      isDisabled: props.disabled ?? false,
      isReadOnly: props.readOnly ?? false,
      isInvalid: props.invalid ?? false,
      toView: ({ textarea }) =>
        h.span(
          [h.Class(wrapperClass)],
          [
            h.textarea([
              ...textarea,
              h.Class(textareaClass),
              h.DataAttribute('slot', 'textarea'),
              ...(props.describedBy
                ? [h.AriaDescribedBy(props.describedBy)]
                : []),
              ...(props.required ? [h.Required(true)] : []),
              ...(props.maxLength === undefined
                ? []
                : [h.Maxlength(props.maxLength)]),
              ...(props.label === undefined ? [] : [h.AriaLabel(props.label)]),
              ...(props.attributes ?? []),
            ]),
          ],
        ),
    },
    h,
  )
