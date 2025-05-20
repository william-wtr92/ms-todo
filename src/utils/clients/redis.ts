import { appConfig } from "@/config"
import Redis from "ioredis"

const { port, host, password } = appConfig.redis

export const redis = new Redis({
  port: parseInt(port),
  host: host,
  password: password,
})
