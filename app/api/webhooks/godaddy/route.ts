/**
 * GoDaddy webhook endpoint
 * Handles incoming webhooks from GoDaddy
 */

import { NextRequest } from "next/server"
import { godaddyConfig } from "@/lib/providers/godaddy"
import { processWebhookEvent } from "@/lib/webhooks/processor"
import type { WebhookEvent } from "@/lib/webhooks/types"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-godaddy-signature")
    const eventType = request.headers.get("x-godaddy-event")

    if (!signature || !eventType) {
      return Response.json({ error: "Missing required headers" }, { status: 400 })
    }

    const payload = await request.text()
    const secret = process.env.GODADDY_WEBHOOK_SECRET || ""

    // Verify webhook signature
    const isValid = await godaddyConfig.verifySignature(payload, signature, secret)
    if (!isValid) {
      console.error("Invalid GoDaddy webhook signature")
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const data = JSON.parse(payload)

    // Map GoDaddy event to our event type
    const eventTypeMap: Record<string, string> = {
      "domain.registered": "domain.registered",
      "hosting.provisioned": "hosting.provisioned",
    }

    const mappedEventType = eventTypeMap[eventType] || eventType

    // Create webhook event
    const webhookEvent: WebhookEvent = {
      id: data.eventId?.toString() || `${Date.now()}`,
      provider: "godaddy",
      eventType: mappedEventType as WebhookEvent["eventType"],
      timestamp: data.timestamp || new Date().toISOString(),
      data,
      rawPayload: data,
    }

    // Process the webhook event
    const result = await processWebhookEvent(webhookEvent)

    if (!result.success) {
      console.error("Failed to process GoDaddy webhook:", result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error handling GoDaddy webhook:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
