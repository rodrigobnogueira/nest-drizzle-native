# API Reference

This page lists the first-version public API. The package may add APIs as
samples and driver coverage grow, but this surface is the supported baseline.

## Modules

### `DrizzleModule.forRoot(options)`

Registers a Drizzle client and optional schema.

```ts
DrizzleModule.forRoot({
  schema,
  connection: db,
  shutdown: client => client.$client.close(),
});
```

Options:

| Option | Purpose |
| --- | --- |
| `connection` | Existing Drizzle client or a factory returning one |
| `schema` | Standard Drizzle schema object, stored as-is |
| `connectionName` | Optional name for multi-database applications |
| `isGlobal` | Defaults to `true`; set `false` for module-scoped registration |
| `shutdown` | Optional hook called during Nest module destruction |

### `DrizzleModule.forRootAsync(options)`

Registers a Drizzle client from an async or provider-backed factory.

```ts
DrizzleModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async config => ({
    schema,
    connection: createDb(config),
  }),
});
```

### `DrizzleModule.forFeature(repositories)`

Registers repository classes as providers and exports them from the dynamic
module.

## Decorators

### `@InjectDrizzle(connectionName?)`

Injects a registered Drizzle client.

### `@DrizzleRepository(options?)`

Marks a class as a Drizzle repository. The class is still a normal Nest
provider and should be registered through `forFeature()`.

### `@Transactional(options?)`

Re-exports the transaction decorator from the CLS transaction stack.

### `@InjectTransaction(connectionName?)`

Injects the active transaction host from the CLS transaction stack.

## Testing

### `DrizzleTestModule.forRoot(options)`

Registers a test client under the same tokens as `DrizzleModule`.

### `DrizzleTestModule.forFeature(repositories)`

Registers repository providers for tests.

### `createDrizzleMockClient(overrides)`

Creates a shallow typed object mock for direct client injection tests.

### `createDrizzleRepositoryMock(methods)`

Creates a shallow typed repository mock for service tests.

## Token Helpers

`getDrizzleClientToken()`, `getDrizzleSchemaToken()`,
`getDrizzleOptionsToken()`, and `getDrizzleConnectionManagerToken()` are exported
for advanced integration and testing scenarios. Prefer decorators in application
code unless an external integration needs the exact provider token.
