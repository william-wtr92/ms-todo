import { config } from "dotenv"
import { z } from "zod"

import { oneMinuteMs } from "@/utils/times"

config()

const appConfigSchema = z.object({
  env: z.string(),
  port: z.number(),
  timeout: z.number(),
  db: z.object({
    host: z.string(),
    user: z.string(),
    password: z.string(),
    port: z.number(),
    name: z.string(),
    migrations: z.object({
      schema: z.string(),
      out: z.string(),
      dialect: z.literal("postgresql"),
    }),
  }),
  security: z.object({
    cors: z.object({
      origin: z.string(),
      methods: z.array(z.string()),
      headers: z.array(z.string()),
      credentials: z.boolean(),
    }),
  }),
  redis: z.object({
    host: z.string(),
    port: z.string(),
    username: z.string(),
    password: z.string(),
    db: z.string(),
  }),
  sentry: z.object({
    dsn: z.string(),
  }),
  discord: z.object({
    webhookUrl: z.string(),
  }),
  tempo: z.object({
    url: z.string(),
  }),
  metrics: z.object({
    username: z.string(),
    password: z.string(),
  }),
  compression: z.object({
    encoding: z.literal("gzip"),
    treshold: z.number(),
  }),
  rateLimit: z.object({
    windowMs: z.number(),
    limit: z.number(),
  }),
})

export const appConfig = appConfigSchema.parse({
  env: process.env.NODE_ENV!,
  port: parseInt(process.env.SERVER_PORT!, 10),
  timeout: 10000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!, 10),
    name: process.env.DB_NAME,
    migrations: {
      schema:
        process.env.NODE_ENV === "development"
          ? "./src/db/schema/index.ts"
          : "./src/db/schema/index.js",
      out: "./src/db/migrations",
      dialect: "postgresql",
    },
  },
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type", "Authorization"],
      credentials: true,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
  tempo: {
    url: process.env.TEMPO_URL,
  },
  metrics: {
    username: process.env.METRICS_USERNAME,
    password: process.env.METRICS_PASSWORD,
  },
  compression: {
    encoding: "gzip",
    treshold: 512,
  },
  rateLimit: {
    windowMs: oneMinuteMs,
    limit: 50,
  },
})
