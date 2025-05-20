/* eslint-disable no-console */
import { Worker } from "bullmq"

import { bullmq } from "../clients/bullmq"

import { appConfig } from "@/config"

export const worker = new Worker(
  "todos",
  async (job) => {
    const { id, content } = job.data

    await fetch(appConfig.discord.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `📌 New task added : **#${id}** ${content}`,
      }),
    })
  },
  { connection: bullmq }
)

worker.on("completed", (job) => {
  console.info(`✅ Job ${job.id} completed`)
})

worker.on("failed", (job, err) => {
  console.info(`❌ Job ${job?.id} failed:`, err)
})
