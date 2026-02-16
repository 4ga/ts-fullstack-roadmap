# P02 - Validation API

Reusable Express request validation middleware using Zod.

## Requirements

- Node.js (LTS recommended)
- npm

## Install

```bash
npm install
```

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
