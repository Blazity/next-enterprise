/**
 * Shopify webhook endpoint
 * Handles incoming webhooks from Shopify
 */

import { NextRequest } from "next/server"
import { shopifyConfig } from "@/lib/providers/shopify"
import { processWebhookEvent } from "@/lib/webhooks/processor"
import type { WebhookEvent } from "@/lib/webhooks/types"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-shopify-hmac-sha256")
    const topic = request.headers.get("x-shopify-topic")
    const shopDomain = request.headers.get("x-shopify-shop-domain")

    if (!signature || !topic) {
      return Response.json({ error: "Missing required headers" }, { status: 400 })
    }

    const payload = await request.text()
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET || ""

    // Verify webhook signature
    const isValid = await shopifyConfig.verifySignature(payload, signature, secret)
    if (!isValid) {
      console.error("Invalid Shopify webhook signature")
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const data = JSON.parse(payload) as Record<string, unknown>

    // Map Shopify topic to our event type
    const eventTypeMap: Record<string, string> = {
      "orders/create": "order.created",
      "orders/updated": "order.updated",
      "orders/fulfilled": "order.fulfilled",
      "products/create": "product.created",
      "products/update": "product.updated",
    }

    const eventType = eventTypeMap[topic] || topic

    // Create webhook event
    const webhookEvent: WebhookEvent = {
      id: String(data.id || Date.now()),
      provider: "shopify",
      eventType: eventType as WebhookEvent["eventType"],
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        shopDomain,
      },
      rawPayload: data,
    }

    // Process the webhook event
    const result = await processWebhookEvent(webhookEvent)

    if (!result.success) {
      console.error("Failed to process Shopify webhook:", result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error handling Shopify webhook:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
