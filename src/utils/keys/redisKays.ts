export const redisKeys = {
  idempotency: (key: string) => `idempotency:${key}`,
  cache: (key: string) => `cache:${key}`,
}
