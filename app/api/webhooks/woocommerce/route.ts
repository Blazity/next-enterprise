/**
 * WooCommerce webhook endpoint
 * Handles incoming webhooks from WooCommerce
 */

import { NextRequest } from "next/server"
import { woocommerceConfig } from "@/lib/providers/woocommerce"
import { processWebhookEvent } from "@/lib/webhooks/processor"
import type { WebhookEvent } from "@/lib/webhooks/types"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-wc-webhook-signature")
    const topic = request.headers.get("x-wc-webhook-topic")

    if (!signature || !topic) {
      return Response.json({ error: "Missing required headers" }, { status: 400 })
    }

    const payload = await request.text()
    const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET || ""

    // Verify webhook signature
    const isValid = await woocommerceConfig.verifySignature(payload, signature, secret)
    if (!isValid) {
      console.error("Invalid WooCommerce webhook signature")
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const data = JSON.parse(payload) as { id?: number; date_created?: string }

    // Map WooCommerce topic to our event type
    const eventTypeMap: Record<string, string> = {
      "order.created": "order.created",
      "order.updated": "order.updated",
      "product.created": "product.created",
      "product.updated": "product.updated",
    }

    const mappedEventType = eventTypeMap[topic] || topic

    // Create webhook event
    const webhookEvent: WebhookEvent = {
      id: String(data.id || Date.now()),
      provider: "woocommerce",
      eventType: mappedEventType as WebhookEvent["eventType"],
      timestamp: data.date_created || new Date().toISOString(),
      data,
      rawPayload: data,
    }

    // Process the webhook event
    const result = await processWebhookEvent(webhookEvent)

    if (!result.success) {
      console.error("Failed to process WooCommerce webhook:", result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error handling WooCommerce webhook:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
