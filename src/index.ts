import { serve } from "@hono/node-server"
import { sentry } from "@hono/sentry"
import { Hono } from "hono"
import { compress } from "hono/compress"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"
import { timeout } from "hono/timeout"

import { rateLimiter } from "./middlewares/rateLimiter"
import { registerMetrics } from "./utils/clients/prometheus"

import { appConfig } from "@/config"
import { routes } from "@/routes"
import {
  routeNotFound,
  unspecifiedErrorOccurred,
} from "@/utils/messages/global"
import { router } from "@/utils/router"
import { SC } from "@/utils/status"

import "@/utils/workers/todoConsumer"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: appConfig.security.cors.origin,
    allowMethods: appConfig.security.cors.methods,
    allowHeaders: appConfig.security.cors.headers,
    credentials: appConfig.security.cors.credentials,
  }),
  rateLimiter,
  compress({
    encoding: appConfig.compression.encoding,
    threshold: appConfig.compression.treshold,
  }),
  sentry({
    dsn: appConfig.sentry.dsn,
  }),
  secureHeaders(),
  etag(),
  logger(),
  prettyJSON(),
  timeout(appConfig.timeout),
  registerMetrics
)

/** Route Not Found Handler **/
app.notFound((c) => {
  return c.json(routeNotFound, SC.errors.NOT_FOUND)
})

/** Global Error Handler (Sentry) **/
app.onError((err, c) => {
  const sentryInstance = c.get("sentry")

  if (sentryInstance) {
    sentryInstance.captureException(err)

    sentryInstance.setContext("request", {
      method: c.req.method,
      path: c.req.path,
      headers: Object.fromEntries(c.req.raw.headers.entries()),
    })
  }

  return c.json(unspecifiedErrorOccurred, SC.serverErrors.INTERNAL_SERVER_ERROR)
})

app.get("/", (c) => {
  return c.json(`Health Check: ${appConfig.env}`, SC.success.OK)
})

app.route(router.todos, routes.todos).route(router.global, routes.global)

serve(
  {
    fetch: app.fetch,
    port: appConfig.port,
  },
  () => {
    // eslint-disable-next-line no-console
    console.info(`🚀 Server running on port ${appConfig.port}`)
  }
)

if (appConfig.env === "development") {
  showRoutes(app)
}
