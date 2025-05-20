import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { appConfig } from "@/config"
import { cors } from "hono/cors"
import { secureHeaders } from "hono/secure-headers"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import {
  routeNotFound,
  unspecifiedErrorOccurred,
} from "./utils/messages/global"
import { SC } from "./utils/status"
import { router } from "./utils/router"
import { routes } from "./routes"
import { showRoutes } from "hono/dev"
import { timeout } from "hono/timeout"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: appConfig.security.cors.origin,
    allowMethods: appConfig.security.cors.methods,
    allowHeaders: appConfig.security.cors.headers,
    credentials: appConfig.security.cors.credentials,
  }),
  secureHeaders(),
  etag(),
  logger(),
  prettyJSON(),
  timeout(appConfig.timeout)
)

/** Route Not Found Handler **/
app.notFound((c) => {
  return c.json(routeNotFound, SC.errors.NOT_FOUND)
})

/** Global Error Handler **/
app.onError((_, c) => {
  return c.json(unspecifiedErrorOccurred, SC.serverErrors.INTERNAL_SERVER_ERROR)
})

app.get("/", (c) => {
  return c.json(`Health Check: ${appConfig.env}`, SC.success.OK)
})

app.route(router.todos, routes.todos)

serve(
  {
    fetch: app.fetch,
    port: appConfig.port,
  },
  () => {
    console.info(`🚀 Server running on port ${appConfig.port}`)
  }
)

if (appConfig.env === "development") {
  showRoutes(app)
}
