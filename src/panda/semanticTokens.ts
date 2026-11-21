import { defineSemanticTokens } from '@pandacss/dev'

// NOTE: What components use. Each token names a role, so a theme changes values here and nowhere else.
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      canvas: { value: '{colors.paper}' },
      field: { value: '{colors.paperLight}' },
      inverse: { value: '{colors.ink}' },
      accent: { value: '{colors.red}' },
      accentPressed: { value: '{colors.redDeep}' },
      tint: { value: 'color-mix(in oklab, {colors.ink} 6%, transparent)' },
      tintHover: {
        value: 'color-mix(in oklab, {colors.ink} 10%, transparent)',
      },
      inverseHover: {
        value: 'color-mix(in oklab, {colors.ink} 85%, {colors.paper})',
      },
    },
    fg: {
      default: { value: '{colors.ink}' },
      muted: { value: 'color-mix(in oklab, {colors.ink} 60%, {colors.paper})' },
      inverse: { value: '{colors.paper}' },
      accent: { value: '{colors.red}' },
      error: { value: '{colors.red}' },
    },
    border: {
      default: { value: '{colors.ink}' },
      subtle: { value: 'color-mix(in oklab, {colors.ink} 20%, transparent)' },
      error: { value: '{colors.red}' },
    },
    focus: {
      ring: { value: '{colors.red}' },
      glow: { value: 'color-mix(in oklab, {colors.red} 35%, transparent)' },
    },
    decor: {
      ghostCyan: { value: '{colors.cyan}' },
      ghostMagenta: { value: '{colors.magenta}' },
    },
  },
  shadows: {
    // NOTE: The soft glow under the focus underline.
    focusGlow: {
      value: '0 2px 10px 0 color-mix(in oklab, {colors.red} 55%, transparent)',
    },
  },
})
