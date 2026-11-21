import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import * as Checkbox from './checkbox'
import { groupErrorId, groupView, type Size } from './choice'
import * as Field from './field'

// NOTE: The original is a list of rows named by aria-label, with arrow keys moving between rows and a shared hover
// highlight (the "fluid hover" engine). Here the group is a Field.set (a <fieldset> whose <legend> asks the
// question) of horizontal Fields, each with a Checkbox. Tab moves between the checkboxes, as with native ones; the
// arrow keys and the shared hover highlight aren't ported.

export type Item = Readonly<{
  value: string
  label: string
  description?: string
  disabled?: boolean
}>

export type Props<Message> = Readonly<{
  /** Used for the ids of the group and of each checkbox (`<id>-<value>`). */
  id: string
  /** The question the group answers. */
  legend: string
  description?: string
  items: ReadonlyArray<Item>
  /** The checked items' values. */
  values: ReadonlyArray<string>
  onToggle: (value: string, checked: boolean) => Message
  /** Shown under the options when set; also marks every checkbox invalid. */
  error?: string
  /** Disables every checkbox, natively, through the fieldset. */
  disabled?: boolean
  size?: Size
  /** With a name, each checked item sends its value with a form. */
  name?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const itemId = (id: string, value: string): string => `${id}-${value}`

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? 'default'
  const disabled = props.disabled ?? false
  const invalid = props.error !== undefined
  return Field.set(
    {
      id: props.id,
      legend: props.legend,
      legendStyle: 'label',
      ...(props.description === undefined
        ? {}
        : { description: props.description }),
      disabled,
      attributes: [
        h.DataAttribute('slot', 'checkbox-group'),
        ...(props.attributes ?? []),
      ],
      children: groupView(
        {
          id: props.id,
          size,
          ...(props.error === undefined ? {} : { error: props.error }),
          items: props.items.map(item =>
            Field.view(
              {
                id: itemId(props.id, item.value),
                label: item.label,
                orientation: 'horizontal',
                size,
                ...(item.description === undefined
                  ? {}
                  : { description: item.description }),
                disabled: disabled || (item.disabled ?? false),
                control: control =>
                  Checkbox.view(
                    {
                      id: control.id,
                      size: control.size,
                      disabled: control.disabled,
                      invalid,
                      // NOTE: The group's error describes every checkbox, after the item's own description.
                      ...(control.describedBy === undefined && !invalid
                        ? {}
                        : {
                            describedBy: [
                              control.describedBy,
                              invalid ? groupErrorId(props.id) : undefined,
                            ]
                              .filter(id => id !== undefined)
                              .join(' '),
                          }),
                      checked: props.values.includes(item.value),
                      onToggle: checked => props.onToggle(item.value, checked),
                      ...(props.name === undefined
                        ? {}
                        : { name: props.name, value: item.value }),
                    },
                    h,
                  ),
              },
              h,
            ),
          ),
        },
        h,
      ),
    },
    h,
  )
}
