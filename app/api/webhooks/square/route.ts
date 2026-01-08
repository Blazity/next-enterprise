/**
 * Square webhook endpoint
 * Handles incoming webhooks from Square
 */

import { NextRequest } from "next/server"
import { squareConfig } from "@/lib/providers/square"
import { processWebhookEvent } from "@/lib/webhooks/processor"
import type { WebhookEvent } from "@/lib/webhooks/types"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-square-signature")

    if (!signature) {
      return Response.json({ error: "Missing Square signature" }, { status: 400 })
    }

    const payload = await request.text()
    const secret = process.env.SQUARE_WEBHOOK_SECRET || ""

    // Verify webhook signature
    const isValid = await squareConfig.verifySignature(payload, signature, secret)
    if (!isValid) {
      console.error("Invalid Square webhook signature")
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const event = JSON.parse(payload)

    // Map Square event type to our event type
    const eventTypeMap: Record<string, string> = {
      "payment.created": "payment.created",
      "payment.updated": "payment.updated",
      "order.created": "order.created",
      "order.updated": "order.updated",
    }

    const mappedEventType = eventTypeMap[event.type] || event.type

    // Create webhook event
    const webhookEvent: WebhookEvent = {
      id: event.event_id || `${Date.now()}`,
      provider: "square",
      eventType: mappedEventType as WebhookEvent["eventType"],
      timestamp: event.created_at || new Date().toISOString(),
      data: event.data,
      rawPayload: event,
    }

    // Process the webhook event
    const result = await processWebhookEvent(webhookEvent)

    if (!result.success) {
      console.error("Failed to process Square webhook:", result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error handling Square webhook:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
