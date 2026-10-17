export type WidgetProvider = 'claude' | 'codex' | 'zai' | 'zai-coding-cn'

export const DEFAULT_WIDGET_PROVIDERS = ['claude', 'codex'] as const

function isWidgetProvider(provider: unknown): provider is WidgetProvider {
  return (
    provider === 'claude' ||
    provider === 'codex' ||
    provider === 'zai' ||
    provider === 'zai-coding-cn'
  )
}

export function selectWidgetProviders(
  configured: readonly unknown[] | undefined,
): WidgetProvider[] {
  return [
    ...new Set((configured ?? DEFAULT_WIDGET_PROVIDERS).filter(isWidgetProvider)),
  ]
}
