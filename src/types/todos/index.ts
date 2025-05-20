import { z } from "zod"

import { paginationSchema } from "@/types/global/pagination"

export const todoIdSchema = z.object({
  id: z.string().uuid(),
})

export type TodoIdSchema = z.infer<typeof todoIdSchema>

export const createTodoSchema = z.object({
  content: z.string().min(1),
})

export type CreateTodoSchema = z.infer<typeof createTodoSchema>

export const updateTodoSchema = z.object({
  content: z.string().optional(),
  done: z.boolean().optional(),
})

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>

export const todoOrderByOptions = {
  createdAt: "createdAt",
  done: "done",
} as const

export const listTodoSchema = paginationSchema.extend({
  orderBy: z
    .enum([todoOrderByOptions.createdAt, todoOrderByOptions.done])
    .optional()
    .default(todoOrderByOptions.createdAt),
})

export type ListTodoSchema = z.infer<typeof listTodoSchema>
