import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { css, cx } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Input as Primitive } from '@foldkit/ui'

import { controlClass, wrapperClass } from './control'

const inputClass = cx(controlClass, css({ height: 'control' }))

export type Props<Message> = Readonly<{
  id: string
  value?: string
  onInput?: (value: string) => Message
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
  /** For an input without a visible label. Inside a Field, the label names it. */
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
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
      type: props.type ?? 'text',
      isDisabled: props.disabled ?? false,
      isReadOnly: props.readOnly ?? false,
      isInvalid: props.invalid ?? false,
      toView: ({ input }) =>
        h.span(
          [h.Class(wrapperClass)],
          [
            h.input([
              ...input,
              h.Class(inputClass),
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
              ...(props.label === undefined ? [] : [h.AriaLabel(props.label)]),
              ...(props.attributes ?? []),
            ]),
          ],
        ),
    },
    h,
  )
