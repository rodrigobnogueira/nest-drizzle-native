# How To Review Samples

Every sample PR should answer two questions:

1. Does the sample prove the feature with real Nest and Drizzle behavior?
2. Did building the sample reveal a better package, docs, or test design?

## Sample Boundaries

Sample PRs should not include package source changes under `packages/drizzle/**`.
If a sample reveals a package bug, pause the sample branch and fix the package
in a separate PR first.

## Review Checklist

- Library ergonomics: did the sample reveal an awkward API, missing helper,
  confusing type, or repetitive setup that belongs in `packages/drizzle`?
- Architecture: did the sample need a pattern that should become the
  recommended Nest-native structure?
- Documentation: did the sample teach something that belongs in the README,
  Docusaurus docs, or API reference?
- Performance: did the sample reveal unnecessary connection work, slow test
  setup, excessive boot cost, or query patterns that need guidance?
- Maintainability: did the sample duplicate code that should become a shared
  sample helper, documented convention, or future library improvement?

## When To Avoid Package Changes

Do not add a package abstraction just because two samples repeat setup. Prefer
copy-pasteable examples until the repeated shape is stable across multiple
drivers and use cases.

Good package changes should reduce real application complexity, not hide
important Drizzle or Nest configuration.
