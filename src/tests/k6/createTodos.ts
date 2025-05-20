import { check, sleep } from "k6"
import http from "k6/http"

export const options = {
  vus: 50,
  duration: "30s",
}

export const createTodos = () => {
  const url = "http://localhost:3001/todos"
  const payload = JSON.stringify({ content: "K6 test todo" })

  const headers = {
    "Content-Type": "application/json",
    "Idempotency-Key": Math.random().toString(36).substring(7),
  }

  const res = http.post(url, payload, { headers })

  check(res, {
    "status is 201": (r) => r.status === 201,
    "response is not empty": (r) => {
      if (typeof r.body === "string") {
        return r.body.length > 0
      }

      if (r.body instanceof ArrayBuffer) {
        return r.body.byteLength > 0
      }

      return false
    },
  })

  sleep(1)
}
