import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { todos } from "@/db/schema"
import { db } from "@/db/utils/client"
import { todoIdSchema, updateTodoSchema } from "@/types/todos"
import { todoNotFound } from "@/utils/messages/todos"
import { SC } from "@/utils/status"

const app = new Hono()

export const updateTodoRoute = app.put(
  "/:id",
  zValidator("param", todoIdSchema),
  zValidator("json", updateTodoSchema),
  async (c) => {
    const { id } = c.req.valid("param")
    const { content, done } = c.req.valid("json")

    const todoExists = await db.select().from(todos).where(eq(todos.id, id))

    if (!todoExists) {
      return c.json(todoNotFound, SC.errors.NOT_FOUND)
    }

    const [todo] = await db
      .update(todos)
      .set({
        content: content,
        done,
      })
      .where(eq(todos.id, id))
      .returning()

    return c.json(todo, SC.success.OK)
  }
)
