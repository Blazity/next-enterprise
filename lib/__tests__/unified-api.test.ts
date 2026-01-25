/**
 * Tests for Unified API Client
 */

import { describe, expect, it } from "vitest"
import { UnifiedAPIClient } from "../unified-api"

describe("UnifiedAPIClient", () => {
  it("can be instantiated with empty config", () => {
    const client = new UnifiedAPIClient({})
    expect(client).toBeDefined()
  })

  it("throws error when accessing unconfigured provider", () => {
    const client = new UnifiedAPIClient({})
    
    expect(() => client.getShopifyClient()).toThrow("Shopify client not configured")
    expect(() => client.getStripeClient()).toThrow("Stripe client not configured")
    expect(() => client.getGoDaddyClient()).toThrow("GoDaddy client not configured")
  })

  it("provides access to configured Shopify client", () => {
    const client = new UnifiedAPIClient({
      shopify: {
        apiKey: "test-key",
        apiSecret: "test-secret",
        shopDomain: "test.myshopify.com",
        accessToken: "test-token",
      },
    })

    expect(() => client.getShopifyClient()).not.toThrow()
    const shopifyClient = client.getShopifyClient()
    expect(shopifyClient).toBeDefined()
  })

  it("provides access to configured Stripe client", () => {
    const client = new UnifiedAPIClient({
      stripe: {
        apiKey: "test-key",
      },
    })

    expect(() => client.getStripeClient()).not.toThrow()
    const stripeClient = client.getStripeClient()
    expect(stripeClient).toBeDefined()
  })

  it("supports multiple providers simultaneously", () => {
    const client = new UnifiedAPIClient({
      shopify: {
        apiKey: "test-key",
        apiSecret: "test-secret",
        shopDomain: "test.myshopify.com",
        accessToken: "test-token",
      },
      stripe: {
        apiKey: "test-stripe-key",
      },
      godaddy: {
        apiKey: "test-godaddy-key",
        apiSecret: "test-godaddy-secret",
      },
    })

    expect(() => client.getShopifyClient()).not.toThrow()
    expect(() => client.getStripeClient()).not.toThrow()
    expect(() => client.getGoDaddyClient()).not.toThrow()
  })
})
