import { Hono } from "hono"

const app = new Hono()

export const testSentryRoute = app.get("/test-sentry", () => {
  throw new Error("💥 This route always fails")
})
