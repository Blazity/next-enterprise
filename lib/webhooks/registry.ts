/**
 * Provider registry for managing webhook configurations
 */

import type { ProviderWebhookConfig, WebhookProvider } from "./types"

class ProviderRegistry {
  private providers: Map<WebhookProvider, ProviderWebhookConfig> = new Map()

  register(config: ProviderWebhookConfig): void {
    this.providers.set(config.provider, config)
  }

  get(provider: WebhookProvider): ProviderWebhookConfig | undefined {
    return this.providers.get(provider)
  }

  has(provider: WebhookProvider): boolean {
    return this.providers.has(provider)
  }

  getAll(): ProviderWebhookConfig[] {
    return Array.from(this.providers.values())
  }
}

export const providerRegistry = new ProviderRegistry()
