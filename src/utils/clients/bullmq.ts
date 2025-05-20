import { appConfig } from "@/config"

export const bullmq = {
  host: appConfig.redis.host,
  port: parseInt(appConfig.redis.port),
  username: appConfig.redis.username,
  password: appConfig.redis.password,
  db: parseInt(appConfig.redis.db),
  maxRetriesPerRequest: null,
}
