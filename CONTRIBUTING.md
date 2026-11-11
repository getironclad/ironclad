# Contributing

Thanks for contributing to Ironclad!

## Ground rules

- **Branch from `main`.** Open a pull request for every change; no direct
  pushes to `main`.
- **Signed commits are required.** All commits must be signed (SSH or GPG).
  Unsigned commits will not pass CI. See GitHub's
  [documentation on signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification).
- **CI status checks must pass.** `lint` and `test` run on every PR (see
  `.github/workflows/ci.yml`).
- **Reference specs/ADRs** in your PR description when the change touches
  protocol behavior (`docs/spec`, `docs/adr`).

## Setting up

```bash
pnpm install
pnpm test
pnpm lint
pnpm build
```

- Node >= 26 (see `engines`), pnpm 12 (`packageManager`), Turborepo for task
  orchestration.

## Code style

- Formatting: **Prettier** (`pnpm exec prettier --write .`). Keep formatting
  consistent — CI does not auto-format, so format before committing.
- TypeScript: strict mode (see `tsconfig.base.json`). Use `verbatimModuleSyntax`
  — import types with `import type`.
- Tests: Vitest, colocated as `*.test.ts` next to sources.

## Making a change

1. `git checkout -b feat/your-change` (branch from `main`).
2. Make your change; add/adjust tests; run `pnpm test` and `pnpm lint`.
3. Commit with a signed commit and a clear message:
   `feat(packages/gateway): verify DPoP signatures per RFC 9449`.
4. Open a PR against `main` using the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

## Scope expectations

- Keep changes focused and consistent with the surrounding structure.
- Protocol-affecting changes **must** update or add a spec/ADR.
- New public APIs need at least one test and an entry in the package's
  `src/index.ts` exports.

## Questions

Open an issue for questions, or reach out on the project board (TODO: link).
