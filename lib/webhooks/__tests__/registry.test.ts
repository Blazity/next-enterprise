/**
 * Tests for provider registry
 */

import { beforeEach, describe, expect, it } from "vitest"
import { providerRegistry } from "../registry"
import type { ProviderWebhookConfig } from "../types"

describe("Provider Registry", () => {
  const mockConfig: ProviderWebhookConfig = {
    provider: "shopify",
    secret: "test-secret",
    verifySignature: async () => true,
  }

  beforeEach(() => {
    // Clear registry before each test
    providerRegistry.getAll().forEach(() => {
      // Note: We don't have a delete method, but in a real scenario you might want one
    })
  })

  it("registers a provider configuration", () => {
    providerRegistry.register(mockConfig)
    expect(providerRegistry.has("shopify")).toBe(true)
  })

  it("retrieves a registered provider", () => {
    providerRegistry.register(mockConfig)
    const config = providerRegistry.get("shopify")
    expect(config).toBeDefined()
    expect(config?.provider).toBe("shopify")
  })

  it("returns undefined for unregistered provider", () => {
    const config = providerRegistry.get("stripe")
    expect(config).toBeUndefined()
  })

  it("lists all registered providers", () => {
    providerRegistry.register(mockConfig)
    providerRegistry.register({
      provider: "stripe",
      verifySignature: async () => true,
    })

    const allProviders = providerRegistry.getAll()
    expect(allProviders.length).toBeGreaterThanOrEqual(2)
  })
})
