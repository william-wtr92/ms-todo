# Micro-services ToDo List API

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

## Checklist

- [x] Create endpoints for the ToDo List API
- [x] Create a Dockerfile
- [x] Create a docker-compose.yml
- [x] Add Sentry for error tracking
- [ ] Add Swagger for API documentation
- [x] Add K6 for load testing
- [x] Add Redis for caching / Idempotency HTTP headers
- [ ] Add OpenTelemetry for distributed tracing
- [x] Add Prometheus for monitoring
- [x] Add Grafana for visualization
- [x] Add CI/CD pipeline
- [x] Add Rate Limiting
- [x] Add BullMQ for message queue
- [x] Add Indexing to the database
- [x] Add Compression Gzip
- [ ] Add Traeffik for reverse proxy
- [x] Husky
