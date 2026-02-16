# P03 - Env Config + Fail Fast

Centralized environment configuration using Zod. Configuration is parsed once and the app fails fast on invalid/missing env.

## Requirements

- Node.js (LTS recommended)
- npm

## Install

```bash
npm install
```

## Environment variables

- `NODE_ENV` = `development | test | production` (default: `development`)

- `PORT` = number (default: `3000`)

- `DATABASE_URL` = required string

In development, `.env` is loaded automatically.

## Run

```bash
npm run dev
```

Optional: set a custom port

```bash
PORT=4000 npm run dev
```

## Test

```bash
npm test
```

### Fail-fast behavior

If required env vars are missing/invalid, the server refuses to start.

#### Example (will fail)

```bash
DATABASE_URL= PORT=not-a-number npm run start:dev
```

## Validation middleware

`validate()` supports validating:

- body
- query
- params

On validation failure it returns:

- **400**

```json
{ "error": "Bad Request" }
```

### Example endpoint

### POST /example/echo

**200**

```json
{ "ok": true, "body": { "name": "Grace" } }
```

Invalid body -> 400

```json
{ "error": "Bad Request" }
```

## Endpoints

### GET /health

**200**

```json
{ "status": "ok" }
```

### Unknown routes

**404**

```json
{ "error": "Not Found" }
```
