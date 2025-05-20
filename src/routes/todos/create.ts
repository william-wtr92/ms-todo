import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { createTodoSchema } from "@/types/todos"
import { db } from "@/db/utils/client"
import { todos } from "@/db/schema"
import { SC } from "@/utils/status"

const app = new Hono()

export const createTodoRoute = app.post(
  "/",
  zValidator("json", createTodoSchema),
  async (c) => {
    const { content } = c.req.valid("json")

    const [todo] = await db.insert(todos).values({ content }).returning()

    return c.json(todo, SC.success.CREATED)
  }
)
