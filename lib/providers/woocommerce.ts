/**
 * WooCommerce provider configuration and webhook verification
 */

import crypto from "crypto"
import type { ProviderWebhookConfig } from "../webhooks/types"

export const woocommerceConfig: ProviderWebhookConfig = {
  provider: "woocommerce",
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      const hmac = crypto.createHmac("sha256", secret)
      const digest = hmac.update(payload).digest("base64")
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    } catch (error) {
      console.error("WooCommerce signature verification error:", error)
      return false
    }
  },
}

/**
 * WooCommerce API client for outbound calls
 */
export class WooCommerceClient {
  private consumerKey: string
  private consumerSecret: string
  private storeUrl: string

  constructor(config: { consumerKey: string; consumerSecret: string; storeUrl: string }) {
    this.consumerKey = config.consumerKey
    this.consumerSecret = config.consumerSecret
    this.storeUrl = config.storeUrl.replace(/\/$/, "") // Remove trailing slash
  }

  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64")
    return `Basic ${auth}`
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.storeUrl}/wp-json/wc/v3${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async getOrders(params?: { status?: string; page?: number; per_page?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.set("status", params.status)
    if (params?.page) queryParams.set("page", params.page.toString())
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString())

    return this.request<Array<{ id: number; status: string }>>(`/orders?${queryParams.toString()}`)
  }

  async getOrder(orderId: string) {
    return this.request<{ id: number; status: string }>(`/orders/${orderId}`)
  }

  async createOrder(orderData: Record<string, unknown>) {
    return this.request<{ id: number; status: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async updateOrder(orderId: string, orderData: Record<string, unknown>) {
    return this.request<{ id: number; status: string }>(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    })
  }

  async getProducts(params?: { page?: number; per_page?: number; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set("page", params.page.toString())
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString())
    if (params?.search) queryParams.set("search", params.search)

    return this.request<Array<{ id: number; name: string; price: string }>>(`/products?${queryParams.toString()}`)
  }

  async getProduct(productId: string) {
    return this.request<{ id: number; name: string; price: string }>(`/products/${productId}`)
  }

  async createProduct(productData: Record<string, unknown>) {
    return this.request<{ id: number; name: string; price: string }>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(productId: string, productData: Record<string, unknown>) {
    return this.request<{ id: number; name: string; price: string }>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  async getCustomers(params?: { page?: number; per_page?: number; email?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set("page", params.page.toString())
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString())
    if (params?.email) queryParams.set("email", params.email)

    return this.request<Array<{ id: number; email: string }>>(`/customers?${queryParams.toString()}`)
  }

  async getCustomer(customerId: string) {
    return this.request<{ id: number; email: string }>(`/customers/${customerId}`)
  }
}
