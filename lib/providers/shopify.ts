/**
 * Shopify provider configuration and webhook verification
 */

import crypto from "crypto"
import type { ProviderWebhookConfig } from "../webhooks/types"

export const shopifyConfig: ProviderWebhookConfig = {
  provider: "shopify",
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      const hmac = crypto.createHmac("sha256", secret)
      const digest = hmac.update(payload).digest("base64")
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    } catch (error) {
      console.error("Shopify signature verification error:", error)
      return false
    }
  },
}

/**
 * Shopify API client for outbound calls
 */
export class ShopifyClient {
  private apiKey: string
  private apiSecret: string
  private shopDomain: string
  private accessToken: string

  constructor(config: { apiKey: string; apiSecret: string; shopDomain: string; accessToken: string }) {
    this.apiKey = config.apiKey
    this.apiSecret = config.apiSecret
    this.shopDomain = config.shopDomain
    this.accessToken = config.accessToken
  }

  private getBaseUrl(): string {
    return `https://${this.shopDomain}/admin/api/2024-01/`
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async getOrder(orderId: string) {
    return this.request<{ order: unknown }>(`orders/${orderId}.json`)
  }

  async createOrder(orderData: Record<string, unknown>) {
    return this.request<{ order: unknown }>("orders.json", {
      method: "POST",
      body: JSON.stringify({ order: orderData }),
    })
  }

  async updateOrder(orderId: string, orderData: Record<string, unknown>) {
    return this.request<{ order: unknown }>(`orders/${orderId}.json`, {
      method: "PUT",
      body: JSON.stringify({ order: orderData }),
    })
  }

  async createFulfillment(orderId: string, fulfillmentData: Record<string, unknown>) {
    return this.request<{ fulfillment: unknown }>(`orders/${orderId}/fulfillments.json`, {
      method: "POST",
      body: JSON.stringify({ fulfillment: fulfillmentData }),
    })
  }

  async getProducts(params?: { limit?: number; page?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set("limit", params.limit.toString())
    if (params?.page) queryParams.set("page", params.page.toString())

    return this.request<{ products: unknown[] }>(`products.json?${queryParams.toString()}`)
  }

  async getProduct(productId: string) {
    return this.request<{ product: unknown }>(`products/${productId}.json`)
  }

  async createProduct(productData: Record<string, unknown>) {
    return this.request<{ product: unknown }>("products.json", {
      method: "POST",
      body: JSON.stringify({ product: productData }),
    })
  }

  async updateProduct(productId: string, productData: Record<string, unknown>) {
    return this.request<{ product: unknown }>(`products/${productId}.json`, {
      method: "PUT",
      body: JSON.stringify({ product: productData }),
    })
  }
}
