/**
 * Webhook registry endpoint
 * Lists all available webhook endpoints and their configuration
 */

import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin

  const webhooks = {
    shopify: {
      url: `${baseUrl}/api/webhooks/shopify`,
      events: ["orders/create", "orders/updated", "orders/fulfilled", "products/create", "products/update"],
      headers: {
        required: ["x-shopify-hmac-sha256", "x-shopify-topic"],
        optional: ["x-shopify-shop-domain"],
      },
    },
    godaddy: {
      url: `${baseUrl}/api/webhooks/godaddy`,
      events: ["domain.registered", "hosting.provisioned"],
      headers: {
        required: ["x-godaddy-signature", "x-godaddy-event"],
        optional: [],
      },
    },
    stripe: {
      url: `${baseUrl}/api/webhooks/stripe`,
      events: [
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "payment_intent.created",
        "charge.succeeded",
        "charge.failed",
      ],
      headers: {
        required: ["stripe-signature"],
        optional: [],
      },
    },
    square: {
      url: `${baseUrl}/api/webhooks/square`,
      events: ["payment.created", "payment.updated", "order.created", "order.updated"],
      headers: {
        required: ["x-square-signature"],
        optional: [],
      },
    },
    woocommerce: {
      url: `${baseUrl}/api/webhooks/woocommerce`,
      events: ["order.created", "order.updated", "product.created", "product.updated"],
      headers: {
        required: ["x-wc-webhook-signature", "x-wc-webhook-topic"],
        optional: [],
      },
    },
  }

  return Response.json({
    version: "1.0.0",
    totalProviders: Object.keys(webhooks).length,
    webhooks,
    documentation: `${baseUrl}/docs/webhooks`,
  })
}
