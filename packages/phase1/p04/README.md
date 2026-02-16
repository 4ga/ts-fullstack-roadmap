# P04 - Logging + Request-ID

Adds request correlation and structured JSON logs without leaking secrets.

## Run

```bash
npm run dev
```

## Test

```bash
npm test
```

## Request ID

- If `x-request-id` is provided, it is echoed back.
- If missing, a new request id is generated.
- Every response includes the `x-request-id` header.

## Logging

- Logs are JSON (one line per event)
- Request logs include: `requestId`, `method`, `path`, `status`, `durationMs`
- No secrets are logged (no auth headers, cookies, or passwords)
