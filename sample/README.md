# Samples

The sample tree follows the same shape as the main quality strategy:

- `00-showcase`: the planned full integration baseline.
- `01-*` onward: focused samples that isolate one topic each.

## Commands

```bash
npm run ci:sample
npm run sample:focused
npm run test --workspace nest-drizzle-native-sample-01-basic-client
```

## Catalog

| Folder | Focus | State | Command |
| --- | --- | --- | --- |
| `00-showcase` | Full integration baseline | Planned in issue #7 | `npm run showcase` |
| `01-basic-client-injection` | Direct `@InjectDrizzle()` client injection | Runnable | `npm run test --workspace nest-drizzle-native-sample-01-basic-client` |
| `02-repositories` | `@DrizzleRepository()` and `forFeature()` | Planned in issue #5 | TBD |
| `03-for-root-async` | Async configuration and shutdown | Planned in issue #4 | TBD |
| `04-named-connections` | Multiple Drizzle clients | Planned in issue #9 | TBD |
| `05-transactions-cls` | CLS-backed `@Transactional()` | Planned in issue #11 | TBD |
| `06-manual-transaction` | `@InjectTransaction()` escape hatch | Planned in issue #8 | TBD |
| `07-validation-drizzle-zod` | Drizzle schema to Zod validation | Planned in issue #10 | TBD |
| `08-validation-class-validator` | DTO validation with `ValidationPipe` | Planned in issue #16 | TBD |
| `09-error-mapping` | Opt-in database error mapping | Planned in issue #15 | TBD |
| `10-testing-utilities` | Test module and mock helpers | Planned in issue #14 | TBD |
| `11-raw-sql-escape-hatch` | Safe raw SQL patterns | Planned in issue #13 | TBD |
| `12-swagger-openapi` | Swagger/OpenAPI integration | Planned in issue #12 | TBD |

## Sample Rules

Sample PRs must not include package source changes under `packages/drizzle/**`.
If a sample exposes a package bug, pause the sample branch and fix the package in
a separate PR first.
