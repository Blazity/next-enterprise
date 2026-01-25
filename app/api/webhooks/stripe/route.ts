/**
 * Stripe webhook endpoint
 * Handles incoming webhooks from Stripe
 */

import { NextRequest } from "next/server"
import { stripeConfig } from "@/lib/providers/stripe"
import { processWebhookEvent } from "@/lib/webhooks/processor"
import type { WebhookEvent } from "@/lib/webhooks/types"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return Response.json({ error: "Missing Stripe signature" }, { status: 400 })
    }

    const payload = await request.text()
    const secret = process.env.STRIPE_WEBHOOK_SECRET || ""

    // Verify webhook signature
    const isValid = await stripeConfig.verifySignature(payload, signature, secret)
    if (!isValid) {
      console.error("Invalid Stripe webhook signature")
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const event = JSON.parse(payload) as { id: string; created: number; type: string; data: { object: Record<string, unknown> } }

    // Map Stripe event type to our event type
    const eventTypeMap: Record<string, string> = {
      "payment_intent.succeeded": "payment.success",
      "payment_intent.payment_failed": "payment.failed",
      "payment_intent.created": "payment.created",
      "charge.succeeded": "payment.success",
      "charge.failed": "payment.failed",
    }

    const mappedEventType = eventTypeMap[event.type] || event.type

    // Create webhook event
    const webhookEvent: WebhookEvent = {
      id: event.id,
      provider: "stripe",
      eventType: mappedEventType as WebhookEvent["eventType"],
      timestamp: new Date(event.created * 1000).toISOString(),
      data: event.data.object,
      rawPayload: event,
    }

    // Process the webhook event
    const result = await processWebhookEvent(webhookEvent)

    if (!result.success) {
      console.error("Failed to process Stripe webhook:", result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error handling Stripe webhook:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
