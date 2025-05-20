import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const todos = pgTable(
  "todos",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    content: text("content").notNull(),
    done: boolean("done").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_todos_done").on(table.done)]
)
