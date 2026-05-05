# Sample 01: Basic Client Injection

This is the smallest runnable NestJS app that uses `nest-drizzle-native` with a
real Drizzle database client.

## What It Demonstrates

| Feature | File(s) |
| --- | --- |
| `DrizzleModule.forRoot()` | `src/app.module.ts` |
| Direct `@InjectDrizzle()` usage | `src/notes/notes.service.ts` |
| Standard Drizzle schema syntax | `src/schema.ts` |
| Real database queries | `src/notes/notes.service.ts` |
| HTTP route backed by Drizzle | `src/notes/notes.controller.ts` |
| Local smoke test | `scripts/smoke.ts` |

## Run

```bash
npm run start --workspace nest-drizzle-native-sample-01-basic-client
```

## Validate

```bash
npm run test --workspace nest-drizzle-native-sample-01-basic-client
```

## Why This Matters

The superpower here is direct access to the Drizzle client through Nest
dependency injection. There is no custom entity layer and no hidden query API:
services can use the full Drizzle query builder while the connection lifecycle
stays inside a Nest module.
