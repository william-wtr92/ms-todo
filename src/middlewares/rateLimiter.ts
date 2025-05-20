import { rateLimiter as rateLimit } from "hono-rate-limiter"

import { appConfig } from "@/config"
import { redis } from "@/utils/clients/redis"
import { toManyRequests } from "@/utils/messages/global"
import { SC } from "@/utils/status"

const customRedisStore = {
  async increment(key: string) {
    const totalHits = await redis.incr(key)

    if (totalHits === 1) {
      await redis.expire(key, Math.floor(appConfig.rateLimit.windowMs / 1000))
    }

    return {
      totalHits,
      resetTime: new Date(Date.now() + appConfig.rateLimit.windowMs),
    }
  },
  async decrement(key: string) {
    await redis.decr(key)
  },
  async resetKey(key: string) {
    await redis.del(key)
  },
}

export const rateLimiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  limit: appConfig.rateLimit.limit,
  keyGenerator: (c) =>
    c.req.header("x-forwarded-for") ||
    c.req.header("cf-connecting-ip") ||
    c.req.raw.headers.get("host") ||
    "unknown",
  store: customRedisStore,
  statusCode: SC.errors.TOO_MANY_REQUESTS,
  message: toManyRequests,
})
