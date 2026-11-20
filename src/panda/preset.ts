import { definePreset } from '@pandacss/dev'

import { semanticTokens } from './semanticTokens.ts'
import { textStyles } from './textStyles.ts'
import { tokens } from './tokens.ts'

export const etherfieldPreset = definePreset({
  name: '@etherfield/ui',
  theme: {
    breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    tokens,
    semanticTokens,
    textStyles,
  },
  globalCss: {
    'html, body': {
      bg: 'bg.canvas',
      color: 'fg.default',
      fontFamily: 'body',
      lineHeight: 'normal',
    },
  },
})
