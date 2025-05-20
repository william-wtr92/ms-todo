import { createMiddleware } from "hono/factory"

import { redis } from "@/utils/clients/redis"
import { redisKeys } from "@/utils/keys/redisKays"
import { SC } from "@/utils/status"
import { oneMinute } from "@/utils/times"

export const cache = (ttl = oneMinute) =>
  createMiddleware(async (c, next) => {
    if (c.req.header("X-Bypass-Cache")) {
      return await next()
    }

    const url = new URL(c.req.url)
    const pathname = url.pathname
    const query = [...url.searchParams.entries()]
      .sort()
      .map(([key, value]) => `${key}=${value}`)
      .join("&")

    const cacheKey = redisKeys.cache(query ? `${pathname}?${query}` : pathname)
    const cached = await redis.get(cacheKey)

    if (cached) {
      c.header("X-Cache-Hit", "true")

      return c.newResponse(cached, SC.success.OK, {
        "Content-Type": "application/json",
      })
    }

    const originalJson = c.json.bind(c)
    let responseBody: unknown

    c.json = (...args) => {
      responseBody = args[0]

      // @ts-expect-error safe overload
      return originalJson(...args)
    }

    await next()

    if (responseBody !== undefined) {
      await redis.set(cacheKey, JSON.stringify(responseBody), "EX", ttl)
    }
  })
