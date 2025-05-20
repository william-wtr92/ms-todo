import { todos } from "@/db/schema"
import { db } from "@/db/utils/client"
import { cache } from "@/middlewares/cache"
import { listTodoSchema } from "@/types/todos"
import { SC } from "@/utils/status"
import { zValidator } from "@hono/zod-validator"
import { count, desc } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono()

export const listTodoRoute = app.get(
  "/",
  cache(),
  zValidator("query", listTodoSchema),
  async (c) => {
    const { limit: limitString, page, orderBy } = c.req.valid("query")

    const limit = Number(limitString)
    const offset = Number(page)

    const [list, listCount] = await Promise.all([
      db
        .select()
        .from(todos)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(todos[orderBy])),

      db.select({ count: count() }).from(todos),
    ])

    return c.json(
      {
        list,
        totalTodos: listCount[0].count,
        limit,
        page: offset,
        totalPage: Math.ceil(listCount[0].count / limit),
      },
      SC.success.OK
    )
  }
)
