import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { NodeSDK } from "@opentelemetry/sdk-node"

import { appConfig } from "@/config"

const otlpExporter = new OTLPTraceExporter({
  url: appConfig.tempo.url,
})

export const otelSdk = new NodeSDK({
  traceExporter: otlpExporter,
  serviceName: "ms-todo",
})

otelSdk.start()
