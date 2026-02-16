# P05 — Global Error Handler (Node + TS + Express)

**Status:** Shipped ✅  
**Tag/Release:** `p05`  
**Stack:** Node.js • TypeScript • Express • Vitest • Supertest

## Goal

Centralize error handling so the API returns **consistent JSON errors** and **never leaks stack traces**.

## Done When (Acceptance)

- Validation failures return **400** `{ "error": "Bad Request" }`
- Unknown routes return **404** `{ "error": "Not Found" }`
- Unexpected errors return **500** `{ "error": "Internal Server Error" }`
- Errors never leak stack traces or internal messages
- Integration tests cover **400 + 404 + 500**
- Merged to `main` + tag pushed

---

## Behavior Contract

### Error response shape (always)

All errors return JSON in exactly this shape:

```json
{ "error": "string" }
```

### Supported public errors

| Scenario                | Status | Body                                   |
| ----------------------- | -----: | -------------------------------------- |
| Validation failure      |    400 | `{ "error": "Bad Request" }`           |
| Unknown route           |    404 | `{ "error": "Not Found" }`             |
| Unexpected server error |    500 | `{ "error": "Internal Server Error" }` |

### No stack leaks

Responses must **not** include stack traces, thrown error messages, or internal details.

---

## Middleware Order (important)

In `src/app.ts`:

1. `express.json()`
2. `requestId()` (P04)
3. `requestLogger()` (P04)
4. Routes (e.g. `/example`)
5. `notFound` (produces 404 via `HttpError`)
6. `errorHandler` (final global handler)

This ensures:

- Every response (including errors) carries `x-request-id`
- All errors are formatted in one place

---

## Key Implementation Notes

### `HttpError` helper

`src/middleware/httpError.ts` defines:

- `PUBLIC_ERROR_MESSAGES` map
- `HttpError` class containing `statusCode` + `publicMessage`
- `isHttpError()` type guard

Only public-safe messages are returned.

### Validation middleware

`validate()` uses Zod `safeParse()` and on failure calls:

```ts
next(new HttpError(400));
```

No direct `res.status(400)` calls inside validation.

### Not Found

Unknown routes call:

```ts
next(new HttpError(404));
```

### Error handler

The global `errorHandler`:

- checks `res.headersSent` to avoid double-sends
- clamps public statuses to **400/404**
- otherwise responds with **500** `"Internal Server Error"`

---

## Test-only Route

To reliably test 500s, `src/app.ts` adds a test-only boom route:

- `GET /__test__/boom` throws an error
- Registered only when `NODE_ENV === "test"`

---

## Tests

Integration tests live at:

- `tests/errors.int.test.ts`

Coverage:

- 404 unknown route
- 400 validation failure (hits a validated endpoint)
- 500 unexpected error (`/__test__/boom`)
- `x-request-id` header is present on error responses
- responses are JSON (`content-type`)

---

## Scripts

From the project root (or the package folder for P05):

```bash
npm install
npm test
```

If you have separate scripts in `package.json`, run:

```bash
npm run test
npm run test:watch
```

---

## Endpoints

### Health

- `GET /health`
- `200 { "status": "ok" }`

### Example routes

Mounted under:

- `/example/*`

(See `src/routes/example.routes.ts` for details.)

---

## Notes / Standards

This project follows the shared standards:

- Errors are always `{ "error": "string" }` (no stack leaks)
- Every endpoint has integration tests
- Tests are deterministic
- Git hygiene: feature branches, small commits, README required
- Request-id propagation via `x-request-id` (P04)

---

## Next

**P06 — In-Memory CRUD**

- Build a small resource (e.g., `widgets`) with full CRUD and integration tests,
- continuing the same standards (request-id, logging, error contract, determinism).
