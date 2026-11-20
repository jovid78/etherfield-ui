import { defineTextStyles } from '@pandacss/dev'

// NOTE: Field Manual headings: Chakra Petch semibold. h4 is also letter-spaced.
export const textStyles = defineTextStyles({
  heading: {
    h1: {
      value: {
        fontFamily: 'heading',
        fontSize: { base: 'h1Narrow', sm: 'h1' },
        fontWeight: 'semibold',
        lineHeight: 'tight',
        letterSpacing: 'slight',
      },
    },
    h2: {
      value: {
        fontFamily: 'heading',
        fontSize: 'h2',
        fontWeight: 'semibold',
        lineHeight: 'snug',
      },
    },
    h3: {
      value: {
        fontFamily: 'heading',
        fontSize: 'h3',
        fontWeight: 'semibold',
        lineHeight: 'snug',
      },
    },
    h4: {
      value: {
        fontFamily: 'heading',
        fontSize: 'h4',
        fontWeight: 'semibold',
        lineHeight: 'normal',
        letterSpacing: 'wide',
      },
    },
  },
})
