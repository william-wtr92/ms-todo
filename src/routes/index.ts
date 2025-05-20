import { Hono } from "hono"
import { createTodoRoute } from "./todos/create"
import { listTodoRoute } from "./todos/list"
import { updateTodoRoute } from "./todos/update"

const DEFAULT_PATH = "/" as const

const todoRoutes = new Hono()
  .route(DEFAULT_PATH, createTodoRoute)
  .route(DEFAULT_PATH, listTodoRoute)
  .route(DEFAULT_PATH, updateTodoRoute)

export const routes = {
  todos: todoRoutes,
} as const
