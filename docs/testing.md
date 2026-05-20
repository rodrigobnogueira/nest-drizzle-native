# Testing

The package provides two testing helpers:

- `DrizzleTestModule` registers a client under the same DI tokens as
  `DrizzleModule`.
- `createDrizzleMockClient()` and `createDrizzleRepositoryMock()` create simple,
  typed object mocks.

## Unit Tests

Use mocks when you want to isolate a service from SQL behavior.

```ts
import { Test } from '@nestjs/testing';
import {
  DrizzleTestModule,
  createDrizzleMockClient,
} from 'nest-drizzle-native';

const db = createDrizzleMockClient({
  query: {
    users: {
      findMany: () => [{ id: 'user_1', name: 'Ada' }],
    },
  },
});

const moduleRef = await Test.createTestingModule({
  imports: [DrizzleTestModule.forRoot({ client: db })],
  providers: [UsersService],
}).compile();
```

This is useful for fast service tests, but it is intentionally shallow. It does
not prove SQL syntax, schema mapping, driver behavior, or transaction behavior.

## Repository Tests

Use repository mocks when a service depends on a repository and the repository
has its own focused tests.

```ts
const usersRepository = createDrizzleRepositoryMock<UsersRepository>({
  findById: async id => ({ id, name: 'Ada' }),
});
```

## Integration Tests

Use a real Drizzle client when the behavior being tested depends on the
database:

- query shape and selected columns
- migrations or table setup
- inserts, updates, deletes, and ordering
- transaction commit and rollback
- driver-specific behavior

The package test suite includes real driver integration coverage for libSQL,
better-sqlite3, PostgreSQL, and MySQL. The CI suite runs PostgreSQL and MySQL
through service containers, while local runs skip those two unless connection
URLs are provided.

## Choosing Test Depth

| Test goal | Recommended setup | Why |
| --- | --- | --- |
| Provider wiring or service orchestration | `DrizzleTestModule` with `createDrizzleMockClient()` or repository mocks | Fast and focused on Nest collaboration, not SQL behavior |
| Query shape, ordering, constraints, or migrations | Real local Drizzle client with a local database file | Proves the schema and SQL path without external services |
| Driver-specific behavior | Real service-backed driver such as PostgreSQL or MySQL | Catches pool, dialect, and driver lifecycle behavior |
| Commit, rollback, and transaction context cleanup | Real local database with recreate-per-test or rollback-per-test isolation | Mocks cannot prove transaction semantics |

For transaction behavior, prefer a fresh local database per scenario until the
application has enough test volume to justify a shared rollback fixture. The
[`19-transaction-isolation-testing`](https://github.com/nest-native/nest-drizzle-native/tree/main/sample/19-transaction-isolation-testing)
sample demonstrates the recreate-per-test pattern with real `@Transactional()`
calls.

## Local Commands

```bash
npm run test
npm run test:cov
npm run ci
```

`npm run test:cov` writes `coverage/coverage-summary.json` and
`test-results.json`, which are used by the GitHub coverage and performance
comments.
