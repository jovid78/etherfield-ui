import { Option } from 'effect'
import {
  type Attribute,
  childAttributes,
  type Html,
  type HtmlBuilder,
} from 'foldkit/html'

import { css, cva, cx } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Listbox as Primitive } from '@foldkit/ui'

import { controlRecipe, type Radius, type Size } from './control'
import * as Icon from './icon'
import * as Popup from './popup'

// NOTE: Foldkit's Listbox owns the behaviour: the trigger button with aria-haspopup and aria-expanded, the
// role=listbox panel with aria-activedescendant, arrow keys, Home and End, typeahead, Escape, outside clicks, focus
// return and anchoring. Select only styles it and fills it in. The original wraps the Listbox model to keep the
// list open for a moment after a pick and to reset it on unmount; here the Listbox model is used as it is, so a
// pick closes the list straight away.

const primitive = Primitive.create<Item, string>()

export const Model = Primitive.Model
export type Model = Primitive.Model
export const Message = Primitive.Message
export type Message = Primitive.Message
export const OutMessage = Primitive.OutMessage
/** Selected({ value }) when a row is picked. The parent stores the value and passes it back in as `value`. */
export type OutMessage = Primitive.OutMessage

export type InitConfig = Readonly<{ id: string }>

export const init = (config: InitConfig): Model =>
  Primitive.init({ id: config.id, isAnimated: true })

/** Run it from the parent's update: `Update.foldChild` or by hand, then store the `Selected` OutMessage's value. */
export const update = primitive.update

/** The trigger button's id. Use it as the Field's id, so the Field's label points at the button. */
export const triggerId = (model: Model): string => Primitive.buttonId(model.id)

export type Item = Readonly<{
  value: string
  label: string
  icon?: Icon.Name
  disabled?: boolean
  /** Rows with the same group sit together under it as a heading. Keep a group's rows next to each other. */
  group?: string
}>

const triggerRecipe = cva({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'start',
    cursor: 'pointer',
    userSelect: 'none',
    // NOTE: Field Manual focus: the same red underline Button draws. The trigger is a <button>, so it draws the
    // line itself; its border is inside the box, as Button's is.
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
    '&[data-invalid]': { borderColor: 'border.error' },
    '&[data-readonly]': { bg: 'bg.tint', cursor: 'default' },
  },
  variants: {
    size: {
      default: { height: 'control', minWidth: 'selectMin', gap: '2' },
      compact: {
        height: 'controlCompact',
        minWidth: 'selectMinCompact',
        gap: '1',
      },
    },
  },
  defaultVariants: { size: 'default' },
})

const valueClass = css({
  flex: '1',
  minWidth: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '[data-placeholder] &': { color: 'fg.muted' },
})

const adornmentClass = css({
  display: 'flex',
  flexShrink: '0',
  color: 'fg.muted',
})

const chevronClass = css({
  display: 'flex',
  flexShrink: '0',
  color: 'fg.default',
  transitionProperty: 'transform',
  transitionDuration: 'fast',
  transitionTimingFunction: 'out',
  '[data-open] &': { transform: 'rotate(180deg)' },
  _motionReduce: { transitionProperty: 'none' },
})

const rootClass = css({
  position: 'relative',
  display: 'block',
  width: 'full',
  minWidth: '0',
})

export type Props<ParentMessage> = Readonly<{
  items: ReadonlyArray<Item>
  /** The selected value. The parent owns it: store the `Selected` OutMessage's value and pass it back. */
  value?: string
  toMessage: (message: Message) => ParentMessage
  /** Shown while nothing is selected. */
  placeholder?: string
  /** An icon inside the trigger, before the value. */
  icon?: Icon.Name
  /** The Field's id, which Field hands to its control. Give the Field `Select.triggerId(model)` as its id: the label
   * then points at the trigger, and the label and the value together name it for screen readers. */
  id?: string
  /** Space-separated ids of the elements that describe the select. Field sets this. */
  describedBy?: string
  disabled?: boolean
  /** Opens and lets you look, but not pick. */
  readOnly?: boolean
  invalid?: boolean
  size?: Size
  radius?: Radius
  /** Submits the value in a form under this name. */
  name?: string
  form?: string
  placement?: NonNullable<Primitive.AnchorConfig['placement']>
  /** For a select without a visible label. Inside a Field, the label names it. */
  label?: string
}>

const groupKey = (group: string | undefined): string =>
  group === undefined
    ? ''
    : group
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

// NOTE: Field's label id, `${id}-label` (see field.ts).
const fieldLabelId = (id: string): string => `${id}-label`

export const view = <ParentMessage>(
  model: Model,
  props: Props<ParentMessage>,
  h: HtmlBuilder<ParentMessage>,
): Html => {
  const size = props.size ?? 'default'
  const radius = props.radius ?? 'sharp'
  const popupRadius: Popup.Radius = radius === 'sharp' ? 'sharp' : 'rounded'
  const disabled = props.disabled ?? false
  const invalid = props.invalid ?? false
  const iconSize = size === 'compact' ? 'sm' : 'md'
  const selected = props.items.find(item => item.value === props.value)
  const list = Popup.listRecipe({ size, radius: popupRadius })
  const buttonId = triggerId(model)
  const groups = new Map(
    props.items.flatMap(item =>
      item.group === undefined ? [] : [[groupKey(item.group), item.group]],
    ),
  )

  const name =
    props.label === undefined
      ? props.id === undefined
        ? {}
        : { ariaLabelledBy: `${fieldLabelId(props.id)} ${buttonId}` }
      : { ariaLabel: props.label }

  const listName: ReadonlyArray<Attribute<ParentMessage>> =
    props.label === undefined
      ? props.id === undefined
        ? []
        : [h.AriaLabelledBy(fieldLabelId(props.id))]
      : [h.AriaLabel(props.label)]

  return h.div(
    [h.Class(rootClass), h.DataAttribute('slot', 'select')],
    [
      h.submodel({
        slotId: model.id,
        model,
        view: primitive.view,
        toParentMessage: props.toMessage,
        viewInputs: {
          items: props.items,
          itemToValue: item => item.value,
          maybeSelectedValue: Option.fromUndefinedOr(props.value),
          isItemDisabled: item => item.disabled ?? false,
          itemToSearchText: item => item.label,
          isDisabled: disabled,
          isReadOnly: props.readOnly ?? false,
          isInvalid: invalid,
          ...name,
          anchor: {
            ...Popup.anchor,
            placement: props.placement ?? 'bottom-start',
          },
          buttonClassName: cx(
            controlRecipe({ size, radius }),
            triggerRecipe({ size }),
          ),
          buttonAttributes: childAttributes([
            // NOTE: The primitive marks a disabled trigger aria-disabled and drops its handlers. Disable it natively
            // too, so it leaves the tab order like a disabled Input.
            ...(disabled ? [h.Disabled(true)] : []),
            ...(invalid ? [h.AriaInvalid(true)] : []),
            ...(props.describedBy
              ? [h.AriaDescribedBy(props.describedBy)]
              : []),
            ...(selected === undefined
              ? [h.DataAttribute('placeholder', '')]
              : []),
          ]),
          buttonContent: h.span(
            [h.Class(list.content)],
            [
              props.icon === undefined
                ? null
                : h.span(
                    [h.Class(adornmentClass), h.AriaHidden(true)],
                    [Icon.view({ name: props.icon, size: iconSize }, h)],
                  ),
              h.span(
                [h.Class(valueClass)],
                [selected?.label ?? props.placeholder ?? 'Select…'],
              ),
              h.span(
                [h.Class(chevronClass), h.AriaHidden(true)],
                [Icon.view({ name: 'nav-arrow-down', size: iconSize }, h)],
              ),
            ],
          ),
          itemsClassName: Popup.surfaceRecipe({ radius: popupRadius }),
          // NOTE: The primitive names the list by its trigger, whose content is only the value. Name it by the
          // label instead, as the original does.
          itemsAttributes: childAttributes(listName),
          itemsScrollClassName: list.viewport,
          backdropClassName: Popup.backdropClass,
          backdropAttributes: childAttributes([h.AriaHidden(true)]),
          // NOTE: The primitive builds the heading's id from the group key, and aria-labelledby splits ids on
          // spaces, so the key is a slug of the group's name.
          itemGroupKey: item => groupKey(item.group),
          groupToHeading: key => {
            const group = groups.get(key)
            return group === undefined
              ? undefined
              : { content: h.span([], [group]), className: list.heading }
          },
          separatorClassName: list.separator,
          itemToConfig: item => ({
            className: list.row,
            content: Popup.rowContent(
              {
                label: item.label,
                ...(item.icon === undefined ? {} : { icon: item.icon }),
                check: true,
                size,
                radius: popupRadius,
              },
              h,
            ),
          }),
        },
      }),
      // NOTE: The primitive's own hidden input ignores isDisabled. Render it here, so a disabled Select isn't
      // submitted, as a disabled native control isn't.
      props.name === undefined
        ? null
        : h.input([
            h.Type('hidden'),
            h.Name(props.name),
            h.Value(props.value ?? ''),
            h.Disabled(disabled),
            ...(props.form === undefined
              ? []
              : [h.Attribute('form', props.form)]),
          ]),
    ],
  )
}
