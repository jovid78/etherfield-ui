import { defineTokens } from '@pandacss/dev'

// NOTE: Primitive tokens. Components never use these directly: they go through the semantic tokens.
export const tokens = defineTokens({
  colors: {
    paper: { value: '#F4F1EA' },
    ink: { value: '#17130E' },
    red: { value: '#C2321D' },
    redDeep: { value: '#9A2614' },
    cyan: { value: 'oklch(0.72 0.11 210)' },
    magenta: { value: 'oklch(0.72 0.11 340)' },
    transparent: { value: 'transparent' },
    currentColor: { value: 'currentColor' },
  },
  fonts: {
    logo: { value: "'Michroma', sans-serif" },
    heading: { value: "'Chakra Petch', sans-serif" },
    body: { value: "'Atkinson Hyperlegible', sans-serif" },
    mono: { value: "'Space Mono', monospace" },
    caption: { value: "'Bitter', serif" },
  },
  fontSizes: {
    xs: { value: '0.75rem' },
    sm: { value: '0.875rem' },
    md: { value: '1rem' },
    lg: { value: '1.25rem' },
    xl: { value: '1.75rem' },
    '2xl': { value: '2.5rem' },
    // NOTE: Heading sizes, used by the heading text styles. h1 has a smaller size for narrow screens.
    h1: { value: '2.125rem' },
    h1Narrow: { value: '1.625rem' },
    h2: { value: '1.375rem' },
    h3: { value: '1.0625rem' },
    h4: { value: '0.9375rem' },
  },
  fontWeights: {
    regular: { value: '400' },
    medium: { value: '500' },
    semibold: { value: '600' },
    bold: { value: '700' },
  },
  lineHeights: {
    tight: { value: '1.1' },
    snug: { value: '1.25' },
    normal: { value: '1.5' },
  },
  letterSpacings: {
    normal: { value: '0' },
    slight: { value: '0.01em' },
    wide: { value: '0.06em' },
  },
  spacing: {
    // NOTE: Where the focus underline sits: its bottom edge, measured from the element's padding box. 1px border +
    // 2px gap + 2px line.
    focusOffset: { value: '-5px' },
    // NOTE: Misregister: how far the cyan and magenta copies of a heading are shifted. Magenta goes the opposite way.
    misregisterX: { value: '0.5px' },
    misregisterY: { value: '1.2px' },
    misregisterXReverse: { value: '-0.5px' },
    misregisterYReverse: { value: '-1.2px' },
    0: { value: '0' },
    1: { value: '0.25rem' },
    2: { value: '0.5rem' },
    3: { value: '0.75rem' },
    4: { value: '1rem' },
    6: { value: '1.5rem' },
    8: { value: '2rem' },
    12: { value: '3rem' },
    16: { value: '4rem' },
  },
  sizes: {
    focusLine: { value: '2px' },
    control: { value: '2.25rem' },
    controlCompact: { value: '1.75rem' },
    prose: { value: '48rem' },
    full: { value: '100%' },
    fit: { value: 'fit-content' },
  },
  radii: {
    none: { value: '0' },
    sm: { value: '2px' },
  },
  borderWidths: {
    thin: { value: '1px' },
    thick: { value: '2px' },
  },
  durations: {
    fast: { value: '80ms' },
    normal: { value: '180ms' },
  },
  easings: {
    out: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  },
  opacity: {
    hidden: { value: '0' },
    visible: { value: '1' },
    disabled: { value: '0.5' },
    misregister: { value: '0.5' },
  },
  zIndex: {
    behind: { value: '-1' },
  },
})
