import { defineConfig } from '@pandacss/dev'

import { etherfieldPreset } from './src/panda/preset.ts'

// NOTE: strictTokens makes any raw color, space or size a type error: everything comes from the preset.
export default defineConfig({
  preflight: true,
  strictTokens: true,
  strictPropertyValues: true,
  presets: ['@pandacss/preset-base', etherfieldPreset],
  include: ['./src/**/*.ts'],
  exclude: ['./src/panda/**'],
  outdir: 'styled-system',
  importMap: '@etherfield/ui',
  outExtension: 'js',
})
