# Roadmap

The first version focuses on the package baseline: module registration,
injection, repository providers, transaction decorator bridges, testing helpers,
coverage gates, performance reporting, cognitive complexity reporting, release
checks, and security checks.

Next priorities:

- Additional focused samples for driver-specific setup.
- Drizzle-Zod and Swagger helpers for single-source-of-truth DTO/OpenAPI flows.

The package should stay conservative while these pieces are added. New APIs
should prove they are useful in samples or integration tests before becoming
part of the public surface.
