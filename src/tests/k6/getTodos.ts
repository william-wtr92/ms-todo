import { check, sleep } from "k6"
import http from "k6/http"

export const options = {
  vus: 100,
  duration: "20s",
}

export const getTodos = () => {
  const res = http.get("http://localhost:3001/todos?limit=10&page=0")

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has todos list": (r) => {
      const list = r.json("list")

      return Array.isArray(list) && list.length >= 0
    },
  })

  sleep(1)
}
