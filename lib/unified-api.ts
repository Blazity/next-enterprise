/**
 * Unified API client for accessing all providers through a single interface
 */

import { GoDaddyClient } from "./providers/godaddy"
import { ShopifyClient } from "./providers/shopify"
import { SquareClient } from "./providers/square"
import { StripeClient } from "./providers/stripe"
import { WooCommerceClient } from "./providers/woocommerce"

export interface UnifiedConfig {
  shopify?: {
    apiKey: string
    apiSecret: string
    shopDomain: string
    accessToken: string
  }
  godaddy?: {
    apiKey: string
    apiSecret: string
    isProduction?: boolean
  }
  stripe?: {
    apiKey: string
  }
  square?: {
    accessToken: string
    isProduction?: boolean
  }
  woocommerce?: {
    consumerKey: string
    consumerSecret: string
    storeUrl: string
  }
}

/**
 * UnifiedAPIClient provides a single interface to interact with multiple e-commerce
 * and payment providers, making it easy to switch between providers or use multiple
 * providers in parallel.
 */
export class UnifiedAPIClient {
  private shopify?: ShopifyClient
  private godaddy?: GoDaddyClient
  private stripe?: StripeClient
  private square?: SquareClient
  private woocommerce?: WooCommerceClient

  constructor(config: UnifiedConfig) {
    if (config.shopify) {
      this.shopify = new ShopifyClient(config.shopify)
    }
    if (config.godaddy) {
      this.godaddy = new GoDaddyClient(config.godaddy)
    }
    if (config.stripe) {
      this.stripe = new StripeClient(config.stripe)
    }
    if (config.square) {
      this.square = new SquareClient(config.square)
    }
    if (config.woocommerce) {
      this.woocommerce = new WooCommerceClient(config.woocommerce)
    }
  }

  // Shopify methods
  getShopifyClient(): ShopifyClient {
    if (!this.shopify) {
      throw new Error("Shopify client not configured")
    }
    return this.shopify
  }

  // GoDaddy methods
  getGoDaddyClient(): GoDaddyClient {
    if (!this.godaddy) {
      throw new Error("GoDaddy client not configured")
    }
    return this.godaddy
  }

  // Stripe methods
  getStripeClient(): StripeClient {
    if (!this.stripe) {
      throw new Error("Stripe client not configured")
    }
    return this.stripe
  }

  // Square methods
  getSquareClient(): SquareClient {
    if (!this.square) {
      throw new Error("Square client not configured")
    }
    return this.square
  }

  // WooCommerce methods
  getWooCommerceClient(): WooCommerceClient {
    if (!this.woocommerce) {
      throw new Error("WooCommerce client not configured")
    }
    return this.woocommerce
  }

  // Unified order operations
  async getOrder(provider: "shopify" | "woocommerce" | "square", orderId: string) {
    switch (provider) {
      case "shopify":
        return this.getShopifyClient().getOrder(orderId)
      case "woocommerce":
        return this.getWooCommerceClient().getOrder(orderId)
      case "square":
        return this.getSquareClient().getOrder(orderId)
      default:
        throw new Error(`Order operations not supported for provider: ${provider}`)
    }
  }

  async createOrder(provider: "shopify" | "woocommerce" | "square", orderData: Record<string, unknown>) {
    switch (provider) {
      case "shopify":
        return this.getShopifyClient().createOrder(orderData)
      case "woocommerce":
        return this.getWooCommerceClient().createOrder(orderData)
      case "square":
        return this.getSquareClient().createOrder(orderData as { location_id: string; line_items: Array<Record<string, unknown>> })
      default:
        throw new Error(`Order operations not supported for provider: ${provider}`)
    }
  }

  // Unified payment operations
  async createPayment(
    provider: "stripe" | "square",
    data: { amount: number; currency: string; metadata?: Record<string, unknown> }
  ) {
    switch (provider) {
      case "stripe":
        return this.getStripeClient().createPaymentIntent({
          amount: data.amount,
          currency: data.currency,
          metadata: data.metadata as Record<string, string>,
        })
      case "square":
        return this.getSquareClient().createPayment({
          source_id: (data.metadata?.source_id as string) || "",
          amount_money: { amount: data.amount, currency: data.currency },
          idempotency_key: (data.metadata?.idempotency_key as string) || `${Date.now()}`,
        })
      default:
        throw new Error(`Payment operations not supported for provider: ${provider}`)
    }
  }

  // Unified product operations
  async getProducts(provider: "shopify" | "woocommerce", params?: Record<string, unknown>) {
    switch (provider) {
      case "shopify":
        return this.getShopifyClient().getProducts(params as { limit?: number; page?: number })
      case "woocommerce":
        return this.getWooCommerceClient().getProducts(params as { page?: number; per_page?: number; search?: string })
      default:
        throw new Error(`Product operations not supported for provider: ${provider}`)
    }
  }

  // Domain and hosting operations (GoDaddy)
  async getDomains() {
    return this.getGoDaddyClient().getDomains()
  }

  async checkDomainAvailability(domain: string) {
    return this.getGoDaddyClient().checkDomainAvailability(domain)
  }

  async provisionHosting(hostingData: Record<string, unknown>) {
    return this.getGoDaddyClient().provisionHosting(hostingData)
  }
}
