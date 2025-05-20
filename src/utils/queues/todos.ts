import { Queue } from "bullmq"

import { bullmq } from "@/utils/clients/bullmq"
import { queueKeys } from "@/utils/keys/queueKeys"

export const todoQueue = new Queue(queueKeys.todos, {
  connection: bullmq,
})
