import type { Attribute, Html, HtmlBuilder } from 'foldkit/html'

import { cva, type RecipeVariantProps } from '@etherfield/ui/css'
// Ported from fluid-functionalism-foldkit (https://github.com/timhanlon/fluid-functionalism-foldkit), MIT,
// restyled with Panda tokens. See LICENSE for the original copyright notice.
import { Button as Primitive } from '@foldkit/ui'

const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    height: 'control',
    paddingInline: '4',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: 'border.default',
    borderRadius: 'none',
    fontFamily: 'heading',
    fontSize: 'sm',
    fontWeight: 'medium',
    letterSpacing: 'wide',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    transitionProperty: 'background-color, color',
    transitionDuration: 'fast',
    transitionTimingFunction: 'out',
    position: 'relative',
    // NOTE: Field Manual focus: a red underline 2px below the element, with a soft glow. It's a separate box, so the
    // gap is transparent.
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
  },
  variants: {
    variant: {
      primary: {
        bg: 'bg.inverse',
        color: 'fg.inverse',
        _hover: { bg: 'bg.inverseHover' },
      },
      accent: {
        bg: 'bg.accent',
        color: 'fg.inverse',
        borderColor: 'bg.accent',
        _hover: { bg: 'bg.accentPressed', borderColor: 'bg.accentPressed' },
      },
      secondary: {
        bg: 'bg.tint',
        color: 'fg.default',
        _hover: { bg: 'bg.tintHover' },
      },
      ghost: {
        bg: 'transparent',
        color: 'fg.default',
        borderColor: 'transparent',
        _hover: { bg: 'bg.tint' },
      },
    },
    size: {
      default: {},
      compact: {
        height: 'controlCompact',
        paddingInline: '3',
        fontSize: 'xs',
        gap: '1',
      },
    },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
})

export type Variant = NonNullable<
  NonNullable<RecipeVariantProps<typeof buttonRecipe>>['variant']
>
export type Size = NonNullable<
  NonNullable<RecipeVariantProps<typeof buttonRecipe>>['size']
>

export type Props<Message> = Readonly<{
  children: ReadonlyArray<Html | string>
  onClick?: Message
  variant?: Variant
  size?: Size
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  label?: string
  attributes?: ReadonlyArray<Attribute<Message>>
}>

export const view = <Message>(
  props: Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  Primitive.view(
    {
      ...(props.onClick === undefined ? {} : { onClick: props.onClick }),
      isDisabled: props.disabled ?? false,
      type: props.type ?? 'button',
      toView: ({ button }) =>
        h.button(
          [
            ...button,
            h.Class(
              buttonRecipe({
                variant: props.variant ?? 'primary',
                size: props.size ?? 'default',
              }),
            ),
            ...(props.label === undefined ? [] : [h.AriaLabel(props.label)]),
            ...(props.attributes ?? []),
          ],
          props.children,
        ),
    },
    h,
  )
