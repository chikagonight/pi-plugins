import assert from 'node:assert/strict'
import { test } from 'node:test'
import { textWidth } from '../../../tooling/shared/src/statusline.ts'

test('ANSI truecolor styling does not change visible segment width', () => {
  const plain = 'Claude 42%'
  const styled = '\u001b[38;2;217;119;87mClaude 42%\u001b[39m'
  assert.equal(textWidth(styled), textWidth(plain))
  assert.equal(textWidth(styled), 10)
})
