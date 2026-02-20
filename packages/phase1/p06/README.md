# P06 — In-Memory CRUD API (Widgets)

**Status:** Shipped ✅  
**Tag/Release:** `p06`  
**Stack:** Node.js • TypeScript • Express • Zod • Vitest • Supertest

## Goal

Build a small **Widgets** CRUD API with:
- clean structure (router + store + schemas)
- deterministic integration tests (no uncontrolled time/IDs)
- consistent error handling via the global error handler (P05)

---

## Resource

Base path: **`/widgets`**

Widget shape:

```json
{
  "id": "string",
  "name": "string",
  "createdAt": "ISO-8601 string",
  "updatedAt": "ISO-8601 string"
}
```

---

## Behavior Contract

### Error response shape (always)

```json
{ "error": "string" }
```

### Public error mapping

| Scenario | Status | Body |
|---|---:|---|
| Validation failure | 400 | `{ "error": "Bad Request" }` |
| Unknown route | 404 | `{ "error": "Not Found" }` |
| Unknown widget id | 404 | `{ "error": "Not Found" }` |
| Unexpected server error | 500 | `{ "error": "Internal Server Error" }` |

**No stack traces** or internal messages are returned.

---

## Endpoints

### Create
**POST `/widgets`**

Request body:
```json
{ "name": "Widget name" }
```

Responses:
- `201` → created widget

Validation:
- `name` required, non-empty, max length 100

---

### List (pagination)
**GET `/widgets?limit=&offset=`**

Query params:
- `limit` (default 20, min 1, max 100)
- `offset` (default 0, min 0)

Response `200`:
```json
{
  "items": [ /* Widget[] */ ],
  "total": 0,
  "limit": 20,
  "offset": 0
}
```

---

### Read
**GET `/widgets/:id`**

Response:
- `200` → widget
- `404` → `{ "error": "Not Found" }` (unknown id)

---

### Update (partial)
**PATCH `/widgets/:id`**

Request body (partial):
```json
{ "name": "New name" }
```

Responses:
- `200` → updated widget
- `400` → invalid body (including empty `{}`)
- `404` → unknown id

Notes:
- `updatedAt` changes only when a field actually changes.

---

### Delete
**DELETE `/widgets/:id`**

Responses:
- `204` → deleted (no body)
- `404` → unknown id

---

## Project Structure

```
src/
  widgets/
    widgets.types.ts      # domain types
    widgets.schemas.ts    # zod schemas (body/query/params)
    widgets.store.ts      # in-memory store w/ injected idGen + clock
    widgets.router.ts     # express router for /widgets
  middleware/
    validate.ts           # routes zod failures to global handler (HttpError 400)
    httpError.ts          # HttpError + public-safe messages
    errorHandler.ts       # global handler (400/404/500 only)
    notFound.ts           # unknown routes -> HttpError 404
tests/
  widgets.int.test.ts     # full CRUD integration tests
```

---

## Deterministic Testing

The store is created with injected dependencies:

- `idGen.nextId()` → deterministic IDs in tests (`w_1`, `w_2`, …)
- `clock.nowISO()` → deterministic timestamps in tests

In production, `app` uses:
- `randomUUID()` for IDs
- `new Date().toISOString()` for timestamps

In tests, `createApp({ widgets: { idGen, clock } })` injects test doubles.

---

## Running Tests

From the package root:

```bash
npm install
npm test
```

---

## Notes / Standards

This project follows the shared standards:

- Errors are always `{ "error": "string" }` (no stack leaks)
- Every endpoint has integration tests
- Tests are deterministic (no uncontrolled randomness/time)
- Git hygiene: feature branches, small commits, README required
- `x-request-id` is returned on responses (including errors)

---

## Next

**P07 — SQLite CRUD + Migrations**
- Replace the in-memory store with SQLite-backed persistence.
- Introduce migrations + reliability settings (WAL, foreign_keys, busy_timeout, etc.).
