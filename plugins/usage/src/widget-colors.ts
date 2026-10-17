import type { RgbColorValue } from '@earendil-works/pi-tui'

export function hexToRgbColor(hex: string): RgbColorValue {
  const value = hex.replace(/^#/, '')
  return {
    kind: 'rgb',
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

export const PROVIDER_COLORS: Partial<
  Record<'claude' | 'codex' | 'zai' | 'zai-coding-cn', RgbColorValue>
> = {
  claude: hexToRgbColor('#D97757'),
  codex: hexToRgbColor('#5FB3F6'),
}
