import assert from 'node:assert/strict'
import { test } from 'node:test'
import { selectWidgetProviders } from '../src/widget-providers.ts'

test('ignores unknown widget providers without dropping valid ones', () => {
  assert.deepEqual(
    selectWidgetProviders([
      'unknown',
      'claude',
      null,
      '',
      42,
      'zai',
      'codex',
      'zai-coding-cn',
    ]),
    ['claude', 'zai', 'codex', 'zai-coding-cn'],
  )
})

test('defaults to Claude and Codex when widgetProviders is absent', () => {
  assert.deepEqual(selectWidgetProviders(undefined), ['claude', 'codex'])
})

test('deduplicates selected providers', () => {
  assert.deepEqual(selectWidgetProviders(['claude', 'claude', 'codex']), [
    'claude',
    'codex',
  ])
})
