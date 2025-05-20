import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { todos } from "@/db/schema"
import { db } from "@/db/utils/client"
import { idempotency } from "@/middlewares/idempotency"
import { createTodoSchema } from "@/types/todos"
import { queueKeys } from "@/utils/keys/queueKeys"
import { todoQueue } from "@/utils/queues/todos"
import { SC } from "@/utils/status"

const app = new Hono()

export const createTodoRoute = app.post(
  "/",
  idempotency,
  zValidator("json", createTodoSchema),
  async (c) => {
    const { content } = c.req.valid("json")

    const [todo] = await db.insert(todos).values({ content }).returning()

    await todoQueue.add(queueKeys.todosCreated, {
      id: todo.id,
      content: todo.content,
    })

    return c.json(todo, SC.success.CREATED)
  }
)
