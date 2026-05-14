---
title: Production Patterns
description: Practical production guidance for connections, tenants, transactions, errors, performance, and security.
---

# Production Patterns

This page collects the production concerns that usually appear after the quick
start works: multiple databases, request scope, transactions, error mapping,
performance, and security.

## Connection Ownership

Applications own driver construction. Create pools or clients in application
code, pass the ready Drizzle client to `DrizzleModule`, and provide an explicit
shutdown hook when the Nest app owns the driver lifecycle.

```ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

DrizzleModule.forRoot({
  schema,
  connection: drizzle(pool, { schema }),
  shutdown: () => pool.end(),
});
```

This keeps driver-specific configuration visible: TLS, pool sizing, timeouts,
and connection strings all stay outside the package abstraction.

## Multiple Databases

Use named connections for multiple databases or driver instances:

```ts
DrizzleModule.forRoot({
  connectionName: 'analytics',
  schema: analyticsSchema,
  connection: analyticsDb,
});
```

Inject with the same name:

```ts
constructor(
  @InjectDrizzle('analytics')
  private readonly analytics: AnalyticsDatabase,
) {}
```

Prefer named connections when tenants map to a small, known set of databases.
For high-cardinality tenant routing, keep the routing service in application
code so connection caching, eviction, and authorization rules remain explicit.

## Request Scope

Request-scoped services can inject repositories or clients through the normal
Nest provider graph. Keep tenant, user, and trace metadata in request-scoped
application providers. Do not hide tenant switching inside the Drizzle module.

Good boundaries:

- A request-scoped tenant resolver chooses the tenant.
- A service or repository receives that tenant context.
- Drizzle queries stay explicit and parameterized.
- Authorization checks happen before writes.

## Transactions

Use `@Transactional()` at the service method that owns the unit of work. Avoid
placing transaction boundaries on every repository method; that fragments the
business workflow and makes rollback behavior harder to reason about.

Use `@InjectTransaction()` only when a lower-level provider needs the current
transaction object directly.

## Error Mapping

Use `mapDrizzleError()` where persistence errors cross into application
semantics, such as unique email conflicts or foreign-key failures.

```ts
try {
  return await this.usersRepository.create(input);
} catch (error) {
  throw mapDrizzleError(error);
}
```

Do not map every error automatically at the module level. Applications should
choose where database failures become public HTTP exceptions and where they
remain internal errors.

## Performance

Keep the package layer thin:

- Use Drizzle query builders directly for complex reads.
- Use the `sql` template for advanced database features, with parameterized
  values.
- Avoid repositories that wrap every query builder method one-for-one.
- Size pools in application code based on the driver and deployment target.
- Keep OpenAPI generation and validation choices at the HTTP boundary, not in
  repository methods.

For hot paths, measure the actual query and driver behavior first. The package
adds Nest provider wiring, not a query translation layer.

## Security

Review every production PR for:

- SQL injection: never build raw SQL by concatenating request strings.
- Secret leakage: keep tokens, password hashes, and internal metadata out of
  DTOs, docs, logs, and sample payloads.
- Tenant isolation: verify tenant selection before reads and writes.
- Transaction context leaks: keep transaction boundaries scoped to the service
  method that owns the workflow.
- Dependency posture: keep drivers and validation ecosystems as optional peers
  or app-owned dependencies unless the package truly requires them.

Security review should be explicit in PR descriptions, even for docs and sample
changes.
