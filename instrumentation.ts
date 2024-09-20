import { context, diag, DiagConsoleLogger, DiagLogLevel, propagation, trace } from "@opentelemetry/api"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto"
import { Resource } from "@opentelemetry/resources"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { registerOTel } from "@vercel/otel"

// Configuración del logger de diagnóstico
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)

// Verificación de registro previo de OpenTelemetry
function isAlreadyRegistered() {
  return trace.getTracerProvider() || context.active() || propagation.setGlobalPropagator
}

// Inicialización de OpenTelemetry
function initializeOpenTelemetry() {
  const resource = new Resource({
    "service.name": "next-app", // Cambia el nombre del servicio según tu proyecto
  })

  const provider = new NodeTracerProvider({
    resource,
  })

  const traceExporter = new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces", // Asegúrate de que el servicio OTLP esté corriendo
  })

  provider.addSpanProcessor(new BatchSpanProcessor(traceExporter))
  provider.register()
}

// Registrar OpenTelemetry si no está registrado
if (!isAlreadyRegistered()) {
  initializeOpenTelemetry()
}

// Registrar la configuración de OpenTelemetry
export function register() {
  registerOTel("next-app") // Mismo nombre de servicio
}
