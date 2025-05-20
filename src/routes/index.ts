import { Hono } from "hono"

import { metricsRoute } from "./global/metrics"
import { testSentryRoute } from "./global/test"
import { createTodoRoute } from "./todos/create"
import { listTodoRoute } from "./todos/list"
import { updateTodoRoute } from "./todos/update"

const DEFAULT_PATH = "/" as const

const todoRoutes = new Hono()
  .route(DEFAULT_PATH, createTodoRoute)
  .route(DEFAULT_PATH, listTodoRoute)
  .route(DEFAULT_PATH, updateTodoRoute)

const globalRoutes = new Hono()
  .route(DEFAULT_PATH, testSentryRoute)
  .route(DEFAULT_PATH, metricsRoute)

export const routes = {
  todos: todoRoutes,
  global: globalRoutes,
} as const
