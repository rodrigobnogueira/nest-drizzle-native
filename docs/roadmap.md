# Roadmap

The first version is stable around a small Nest-native package surface:

- `DrizzleModule` registration, including async options and named connections.
- `@InjectDrizzle()` and repository providers for Nest-friendly query classes.
- Transaction decorator bridges for applications that use CLS.
- Testing helpers for override-friendly unit tests.
- Quality gates for coverage, performance reporting, cognitive complexity,
  release checks, and security audits.
- Focused samples for validation, error mapping, transactions, Swagger, and
  driver-owned lifecycle setup.

## Intentional Choices

DTO classes with `ValidationPipe` are the canonical Nest-native HTTP validation
path. Zod and `drizzle-zod` are supported as optional application choices, but
they should not become required dependencies or the default documentation path.

The Drizzle-Zod/OpenAPI bridge sample currently stays app-owned: Nest pipes own
runtime validation, explicit Swagger DTOs own the public API contract, and smoke
tests keep the two aligned. A package helper would be premature unless more
samples or real applications prove the same boilerplate keeps repeating.

Driver clients, pools, and shutdown behavior stay in application code. The
module receives a ready Drizzle client and an optional shutdown hook, which keeps
driver-specific behavior explicit and easy to inspect.

## Possible Future Work

- Add focused samples for new drivers or public features as they land, while
  keeping local execution friendly and CI coverage real.
- Consider a tiny optional helper only after repeated samples prove it removes
  real boilerplate without weakening the Nest-native API.

New APIs should prove they are useful in samples or integration tests before
becoming part of the public surface.
