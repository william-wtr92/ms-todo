import { Hono } from "hono"
import { basicAuth } from "hono/basic-auth"

import { appConfig } from "@/config"
import { printMetrics } from "@/utils/clients/prometheus"

const app = new Hono()

export const metricsRoute = app.get(
  "/metrics",
  basicAuth({
    username: appConfig.metrics.username,
    password: appConfig.metrics.password,
  }),
  printMetrics
)
