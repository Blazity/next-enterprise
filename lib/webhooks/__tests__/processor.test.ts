/**
 * Tests for webhook processor
 */

import { describe, expect, it } from "vitest"
import { processWebhookEvent } from "../processor"
import type { WebhookEvent } from "../types"

describe("Webhook Processor", () => {
  it("processes order.created event successfully", async () => {
    const event: WebhookEvent = {
      id: "test-123",
      provider: "shopify",
      eventType: "order.created",
      timestamp: new Date().toISOString(),
      data: { orderId: "123", total: 100 },
      rawPayload: {},
    }

    const result = await processWebhookEvent(event)

    expect(result.success).toBe(true)
    expect(result.message).toContain("processed successfully")
  })

  it("processes payment.success event successfully", async () => {
    const event: WebhookEvent = {
      id: "test-456",
      provider: "stripe",
      eventType: "payment.success",
      timestamp: new Date().toISOString(),
      data: { amount: 5000, currency: "usd" },
      rawPayload: {},
    }

    const result = await processWebhookEvent(event)

    expect(result.success).toBe(true)
    expect(result.message).toContain("processed successfully")
  })

  it("processes domain.registered event successfully", async () => {
    const event: WebhookEvent = {
      id: "test-789",
      provider: "godaddy",
      eventType: "domain.registered",
      timestamp: new Date().toISOString(),
      data: { domain: "example.com" },
      rawPayload: {},
    }

    const result = await processWebhookEvent(event)

    expect(result.success).toBe(true)
    expect(result.message).toContain("processed successfully")
  })

  it("handles unknown event types gracefully", async () => {
    const event: WebhookEvent = {
      id: "test-999",
      provider: "shopify",
      // @ts-expect-error - Testing with intentionally invalid event type
      eventType: "unknown.event.type",
      timestamp: new Date().toISOString(),
      data: {},
      rawPayload: {},
    }

    const result = await processWebhookEvent(event)

    // Should return error for unknown event types
    expect(result.success).toBe(false)
    expect(result.error).toContain("Unknown event type")
  })
})
