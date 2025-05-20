import { createTodos } from "./createTodos"
import { getTodos } from "./getTodos"

export const options = {
  scenarios: {
    createTodos: {
      executor: "constant-vus",
      exec: "createTodos",
      vus: 10,
      duration: "30s",
    },
    getTodos: {
      executor: "constant-vus",
      exec: "getTodos",
      vus: 10,
      duration: "30s",
    },
  },
}

export { createTodos, getTodos }
