import type { ExtensionContext, Theme } from '@earendil-works/pi-coding-agent'
import { sliceByColumn, visibleWidth, type Color } from '@earendil-works/pi-tui'
import { Array, Number, Order, pipe, String } from 'effect'

export interface Segment {
  /** Plain text: dim by default, or rendered in the specified color. */
  readonly text: string
  readonly align: 'left' | 'right'
  readonly color?: Color
}

const WIDGET_KEY = 'pi-plugins:statusline'

// Each plugin bundles its own copy of this module, so `Symbol.for` on
// `globalThis` gives them all the same registry inside one pi process. A native
// Map, since those copies don't share Effect's data structures.
const REGISTRY_KEY = Symbol.for('@pi-plugins/statusline-registry')

type Registry = Map<string, Segment>

function side(segments: Registry, align: Segment['align'], theme: Theme): string {
  return pipe(
    Array.fromIterable(segments),
    Array.filter(([, segment]) => segment.align === align),
    Array.sortBy(
      Order.mapInput(Order.String, ([key]: readonly [string, Segment]) => key),
    ),
    Array.map(([, segment]) =>
      segment.color === undefined
        ? theme.fg('dim', segment.text)
        : theme.style(segment.text, { fg: segment.color }),
    ),
    Array.join(theme.fg('dim', ' · ')),
  )
}

export function setSegment(
  ctx: ExtensionContext,
  key: string,
  segment: Segment | undefined,
): void {
  const store = globalThis as { [REGISTRY_KEY]?: Registry }
  store[REGISTRY_KEY] ??= new Map()
  const segments = store[REGISTRY_KEY]
  if (segment === undefined) {
    segments.delete(key)
  } else {
    segments.set(key, segment)
  }

  if (!ctx.hasUI) {
    return
  }

  if (segments.size === 0) {
    ctx.ui.setWidget(WIDGET_KEY, undefined)
    return
  }

  ctx.ui.setWidget(WIDGET_KEY, (_tui, theme) => ({
    invalidate: () => {},
    render: (width: number) => {
      const left = side(segments, 'left', theme)
      const right = side(segments, 'right', theme)

      // Left indented one column like pi's widget rows, right flush like pi's footer.
      const margin = Number.min(width, 1)
      const inner = width - margin
      const gap = inner - visibleWidth(left) - visibleWidth(right)
      const minGap = String.isNonEmpty(left) && String.isNonEmpty(right) ? 2 : 0

      const line =
        String.isNonEmpty(right) && gap >= minGap
          ? `${left}${String.repeat(gap)(' ')}${right}`
          : pipe(
              [left, right],
              Array.filter(String.isNonEmpty),
              Array.join(theme.fg('dim', ' · ')),
              (text) => sliceByColumn(text, 0, Number.max(inner, 0)),
            )

      return [String.repeat(margin)(' ') + line]
    },
  }))
}
