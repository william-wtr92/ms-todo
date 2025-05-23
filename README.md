# 🚀 Micro-services ToDo List API

> A micro-services ToDo List API built with Hono, Redis, BullMQ, OpenTelemetry, Prometheus, Grafana, and Sentry.

## Architecture

![Architecture](./docs/arch.png)

## Installation

### Manually

```bash
pnpm i && pnpm run dev
```

### Docker

```bash
make build
```

```bash
make up
```

## K6 Tests

> Make sure server is running before running the tests.

```bash
pnpm run build:k6
```

```bash
pnpm run test:k6
```

## Grafana

> Hono Dashboard

![Hono Dashboard](./docs/hono-dashboard.png)

> Node Dashboard

![Node Dashboard](./docs/node-dashboard.png)

## Checklist

- [x] Create endpoints for the ToDo List API
- [x] Create a Dockerfile
- [x] Create a docker-compose.yml
- [x] Add Sentry for error tracking
- [x] Add K6 for load testing
- [x] Add Redis for caching / Idempotency HTTP headers
- [x] Add OpenTelemetry for distributed tracing (Tempo/Grafana)
- [x] Add Prometheus for monitoring
- [x] Add Grafana for visualization
- [x] Add CI/CD pipeline
- [x] Add Rate Limiting
- [x] Add BullMQ for message queue
- [x] Add Indexing to the database
- [x] Add Compression Gzip
- [x] Add PM2 Cluster
- [x] Husky
