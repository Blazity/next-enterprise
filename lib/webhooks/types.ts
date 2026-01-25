/**
 * Base webhook event types and interfaces for the unified API
 */

export type WebhookProvider = "shopify" | "godaddy" | "stripe" | "square" | "woocommerce"

export type WebhookEventType =
  | "order.created"
  | "order.updated"
  | "order.fulfilled"
  | "payment.success"
  | "payment.failed"
  | "payment.created"
  | "payment.updated"
  | "domain.registered"
  | "hosting.provisioned"
  | "product.created"
  | "product.updated"

export interface WebhookEvent {
  id: string
  provider: WebhookProvider
  eventType: WebhookEventType
  timestamp: string
  data: Record<string, unknown>
  rawPayload: unknown
}

export interface WebhookVerificationResult {
  isValid: boolean
  error?: string
}

export interface ProviderWebhookConfig {
  provider: WebhookProvider
  secret?: string
  apiKey?: string
  verifySignature: (payload: string, signature: string, secret: string) => Promise<boolean>
}
