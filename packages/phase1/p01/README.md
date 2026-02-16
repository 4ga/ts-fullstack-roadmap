# P01 - Healthcheck API

Simple Express + TypeScript service with a health endpoint.

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
