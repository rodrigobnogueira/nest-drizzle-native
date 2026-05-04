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

The package test suite includes a real libSQL integration test that creates a
table, writes rows through a repository, and verifies CLS-backed transaction
commit and rollback.

## Local Commands

```bash
npm run test
npm run test:cov
npm run ci
```

`npm run test:cov` writes `coverage/coverage-summary.json` and
`test-results.json`, which are used by the GitHub coverage and performance
comments.
