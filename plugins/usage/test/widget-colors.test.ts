import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hexToRgbColor } from '../src/widget-colors.ts'

test('converts a hex brand color to a pi-tui RGB value', () => {
  assert.deepEqual(hexToRgbColor('#D97757'), {
    kind: 'rgb',
    r: 217,
    g: 119,
    b: 87,
  })
  assert.deepEqual(hexToRgbColor('#5FB3F6'), {
    kind: 'rgb',
    r: 95,
    g: 179,
    b: 246,
  })
})
