# Unified API & Webhooks Documentation

## Overview

This project provides a comprehensive unified API access layer for integrating with multiple e-commerce and payment providers. The system includes webhook endpoints for receiving real-time events and API clients for making outbound calls to various providers.

## Supported Providers

### E-commerce Platforms
- **Shopify** - Full order, product, and fulfillment management
- **WooCommerce** - WordPress-based e-commerce integration
- **Square** - Point of sale and e-commerce platform

### Payment Processors
- **Stripe** - Payment processing and subscription management
- **Square** - Payment and order processing

### Infrastructure
- **GoDaddy** - Domain registration and hosting provisioning

## Webhook Endpoints

All webhook endpoints are available under `/api/webhooks/{provider}`.

### Available Webhooks

#### Shopify: `/api/webhooks/shopify`
- **Events**: orders/create, orders/updated, orders/fulfilled, products/create, products/update

#### GoDaddy: `/api/webhooks/godaddy`
- **Events**: domain.registered, hosting.provisioned

#### Stripe: `/api/webhooks/stripe`
- **Events**: payment_intent.succeeded, payment_intent.payment_failed, charge.succeeded

#### Square: `/api/webhooks/square`
- **Events**: payment.created, payment.updated, order.created, order.updated

#### WooCommerce: `/api/webhooks/woocommerce`
- **Events**: order.created, order.updated, product.created, product.updated

## Unified API Client

The `UnifiedAPIClient` class provides a single interface for interacting with all providers.

See full documentation at /docs/WEBHOOKS.md
