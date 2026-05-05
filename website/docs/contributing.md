---
sidebar_position: 9
---

# Contributing

Contribution work should preserve a clean boundary between package behavior and
examples.

## Keep Sample PRs Separate

Sample PRs may change:

- `sample/**`
- `docs/**`
- `website/docs/**`
- CI and release scripts that validate samples
- README links that point to samples

Sample PRs must not include `packages/drizzle/**` changes. If a sample reveals a
library bug, pause the sample branch and fix the package separately.

## Stash And Fix Workflow

1. Stash the sample work:

   ```bash
   git stash push -u -m "sample work before library fix"
   ```

2. Create a library-fix branch from `main`.
3. Add the package fix and regression test.
4. Open and merge the package fix PR.
5. Return to the sample branch and restore the sample work:

   ```bash
   git stash pop
   ```

6. Confirm the sample PR has no package changes:

   ```bash
   git diff --name-only main...HEAD -- packages/drizzle
   git diff --cached --name-only -- packages/drizzle
   ```

Both commands should print nothing for a sample-only PR.

## Why This Matters

Samples are documentation, validation, and onboarding material. Package fixes
change the public library contract. Keeping them separate makes each PR easier
to review, easier to revert, and safer to release.
