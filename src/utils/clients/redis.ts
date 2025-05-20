import Redis from "ioredis"

import { appConfig } from "@/config"

const { port, host, password } = appConfig.redis

export const redis = new Redis({
  port: parseInt(port),
  host: host,
  password: password,
})
