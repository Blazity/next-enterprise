/**
 * Square provider configuration and webhook verification
 */

import crypto from "crypto"
import type { ProviderWebhookConfig } from "../webhooks/types"

export const squareConfig: ProviderWebhookConfig = {
  provider: "square",
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      const hmac = crypto.createHmac("sha256", secret)
      const digest = hmac.update(payload).digest("base64")
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    } catch (error) {
      console.error("Square signature verification error:", error)
      return false
    }
  },
}

/**
 * Square API client for outbound calls
 */
export class SquareClient {
  private accessToken: string
  private baseUrl: string

  constructor(config: { accessToken: string; isProduction?: boolean }) {
    this.accessToken = config.accessToken
    this.baseUrl = config.isProduction ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com"
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-18",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async createPayment(data: {
    source_id: string
    amount_money: { amount: number; currency: string }
    idempotency_key: string
  }) {
    return this.request<{ payment: { id: string; status: string } }>("/v2/payments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPayment(paymentId: string) {
    return this.request<{ payment: { id: string; status: string } }>(`/v2/payments/${paymentId}`)
  }

  async listPayments(params?: { begin_time?: string; end_time?: string; location_id?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.begin_time) queryParams.set("begin_time", params.begin_time)
    if (params?.end_time) queryParams.set("end_time", params.end_time)
    if (params?.location_id) queryParams.set("location_id", params.location_id)

    return this.request<{ payments: Array<{ id: string; status: string }> }>(
      `/v2/payments?${queryParams.toString()}`
    )
  }

  async createOrder(data: { location_id: string; line_items: Array<Record<string, unknown>> }) {
    return this.request<{ order: { id: string; state: string } }>("/v2/orders", {
      method: "POST",
      body: JSON.stringify({ order: data }),
    })
  }

  async getOrder(orderId: string) {
    return this.request<{ order: { id: string; state: string } }>(`/v2/orders/${orderId}`)
  }

  async updateOrder(orderId: string, orderData: Record<string, unknown>) {
    return this.request<{ order: { id: string; state: string } }>(`/v2/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ order: orderData }),
    })
  }

  async createRefund(data: { payment_id: string; amount_money: { amount: number; currency: string }; reason: string }) {
    return this.request<{ refund: { id: string; status: string } }>("/v2/refunds", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async listLocations() {
    return this.request<{ locations: Array<{ id: string; name: string; status: string }> }>("/v2/locations")
  }

  async getLocation(locationId: string) {
    return this.request<{ location: { id: string; name: string; status: string } }>(`/v2/locations/${locationId}`)
  }
}
