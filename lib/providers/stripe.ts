/**
 * Stripe provider configuration and webhook verification
 */

import crypto from "crypto"
import type { ProviderWebhookConfig } from "../webhooks/types"

export const stripeConfig: ProviderWebhookConfig = {
  provider: "stripe",
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      // Stripe signature format: t=timestamp,v1=signature
      const elements = signature.split(",")
      const timestamp = elements.find((e) => e.startsWith("t="))?.split("=")[1]
      const v1Signature = elements.find((e) => e.startsWith("v1="))?.split("=")[1]

      if (!timestamp || !v1Signature) {
        return false
      }

      const signedPayload = `${timestamp}.${payload}`
      const expectedSignature = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex")

      return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(v1Signature))
    } catch (error) {
      console.error("Stripe signature verification error:", error)
      return false
    }
  },
}

/**
 * Stripe API client for outbound calls
 */
export class StripeClient {
  private apiKey: string
  private baseUrl: string

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey
    this.baseUrl = "https://api.stripe.com/v1"
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  private encodeFormData(data: Record<string, unknown>): string {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&")
  }

  async createPaymentIntent(data: { amount: number; currency: string; metadata?: Record<string, string> }) {
    return this.request<{ id: string; client_secret: string; status: string }>("/payment_intents", {
      method: "POST",
      body: this.encodeFormData(data),
    })
  }

  async getPaymentIntent(paymentIntentId: string) {
    return this.request<{ id: string; amount: number; status: string }>(`/payment_intents/${paymentIntentId}`)
  }

  async capturePaymentIntent(paymentIntentId: string) {
    return this.request<{ id: string; status: string }>(`/payment_intents/${paymentIntentId}/capture`, {
      method: "POST",
    })
  }

  async createCustomer(data: { email: string; name?: string; metadata?: Record<string, string> }) {
    return this.request<{ id: string; email: string }>("/customers", {
      method: "POST",
      body: this.encodeFormData(data),
    })
  }

  async getCustomer(customerId: string) {
    return this.request<{ id: string; email: string }>(`/customers/${customerId}`)
  }

  async createCharge(data: { amount: number; currency: string; source: string; description?: string }) {
    return this.request<{ id: string; status: string }>("/charges", {
      method: "POST",
      body: this.encodeFormData(data),
    })
  }

  async createRefund(data: { charge: string; amount?: number; reason?: string }) {
    return this.request<{ id: string; status: string }>("/refunds", {
      method: "POST",
      body: this.encodeFormData(data),
    })
  }
}
