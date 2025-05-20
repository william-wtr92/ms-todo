import { z } from "zod"

export const DEFAULT_OFFSET = 0 as const
export const DEFAULT_LIMIT = 10 as const

export const paginationSchema = z.object({
  limit: z.string().optional().default(DEFAULT_LIMIT.toString()).optional(),
  page: z.string().optional().default(DEFAULT_OFFSET.toString()).optional(),
})

export type PaginationSchema = z.infer<typeof paginationSchema>
