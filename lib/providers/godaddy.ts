/**
 * GoDaddy provider configuration and webhook verification
 */

import crypto from "crypto"
import type { ProviderWebhookConfig } from "../webhooks/types"

export const godaddyConfig: ProviderWebhookConfig = {
  provider: "godaddy",
  verifySignature: async (payload: string, signature: string, secret: string): Promise<boolean> => {
    try {
      const hmac = crypto.createHmac("sha256", secret)
      const digest = hmac.update(payload).digest("hex")
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    } catch (error) {
      console.error("GoDaddy signature verification error:", error)
      return false
    }
  },
}

/**
 * GoDaddy API client for outbound calls
 */
export class GoDaddyClient {
  private apiKey: string
  private apiSecret: string
  private baseUrl: string

  constructor(config: { apiKey: string; apiSecret: string; isProduction?: boolean }) {
    this.apiKey = config.apiKey
    this.apiSecret = config.apiSecret
    this.baseUrl = config.isProduction ? "https://api.godaddy.com" : "https://api.ote-godaddy.com"
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `sso-key ${this.apiKey}:${this.apiSecret}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GoDaddy API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async getDomains() {
    return this.request<Array<{ domain: string; status: string }>>("/v1/domains")
  }

  async getDomain(domain: string) {
    return this.request<{ domain: string; status: string; expires: string }>(`/v1/domains/${domain}`)
  }

  async checkDomainAvailability(domain: string) {
    return this.request<{ available: boolean; domain: string; price: number }>(
      `/v1/domains/available?domain=${domain}`
    )
  }

  async purchaseDomain(domainData: Record<string, unknown>) {
    return this.request<{ orderId: string; total: number }>("/v1/domains/purchase", {
      method: "POST",
      body: JSON.stringify(domainData),
    })
  }

  async getDNSRecords(domain: string, type?: string) {
    const endpoint = type ? `/v1/domains/${domain}/records/${type}` : `/v1/domains/${domain}/records`
    return this.request<Array<{ type: string; name: string; data: string; ttl: number }>>(endpoint)
  }

  async updateDNSRecords(domain: string, records: Array<Record<string, unknown>>) {
    return this.request(`/v1/domains/${domain}/records`, {
      method: "PUT",
      body: JSON.stringify(records),
    })
  }

  async getHostingAccounts() {
    return this.request<Array<{ accountId: string; status: string }>>("/v1/hosting/accounts")
  }

  async provisionHosting(hostingData: Record<string, unknown>) {
    return this.request<{ accountId: string; status: string }>("/v1/hosting/accounts", {
      method: "POST",
      body: JSON.stringify(hostingData),
    })
  }
}
