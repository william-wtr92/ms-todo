import { createMiddleware } from "hono/factory"

import { redis } from "@/utils/clients/redis"
import { redisKeys } from "@/utils/keys/redisKeys"
import { SC } from "@/utils/status"
import { oneDayTTL } from "@/utils/times"

export const idempotency = createMiddleware(async (c, next) => {
  const key = c.req.header("Idempotency-Key")
  const method = c.req.method

  if (method !== "POST" || !key) {
    return await next()
  }

  const cacheKey = redisKeys.idempotency(key)
  const cached = await redis.get(cacheKey)

  if (cached) {
    c.header("X-Idempotent-Replay", "true")

    return c.newResponse(cached, SC.success.OK, {
      "Content-Type": "application/json",
    })
  }

  const originalJson = c.json.bind(c)
  let responseBody: unknown

  c.json = (...args) => {
    responseBody = args[0]

    // @ts-expect-error TS cannot resolve the overloads here — safe anyway
    return originalJson(...args)
  }

  await next()

  if (responseBody !== undefined) {
    await redis.set(cacheKey, JSON.stringify(responseBody), "EX", oneDayTTL)
  }
})
