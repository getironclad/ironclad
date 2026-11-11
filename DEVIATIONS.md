# Deviations from the requested spec

This file records every deliberate deviation from the original scaffold
request. Nothing here changes the protocol design; these are build/tooling
adjustments required to keep the repo installable and CI-green.

## Dependency versions

All requested versions **existed** in the npm registry and were used exactly
as specified. No fallback versions were required.

| Package     | Requested | Resolved (lockfile) | Notes |
| ----------- | --------- | ------------------- | ----- |
| typescript  | ^7.0.2    | 7.0.2               | exact major requested |
| vitest      | ^5.1.0    | 5.1.0               | exact |
| vite        | ^6.4      | 6.4.6               | within requested range |
| turbo       | ^2.11.10  | 2.11.10             | exact |
| prettier    | ^3        | 3.9.10              | within requested range |
| express     | ^5        | 5.3.0               | within requested range |

## pnpm 12 build-script approvals

pnpm v12 refuses to run dependency `postinstall` scripts by default and fails
the install with `ERR_PNPM_IGNORED_BUILDS`. `esbuild` (pulled in by
vitest/vite) needs its postinstall, so `pnpm-workspace.yaml` declares:

```yaml
allowBuilds:
  esbuild: true
```

This is required for `pnpm install --frozen-lockfile` to succeed in CI.

## Local verification note (not a repo change)

`turbo run ...` cannot spawn child processes in the local sandbox
(`unable to spawn child process: Exec format error (os error 8)`); this
affects the Turborepo Go binary and reproduces with other turbo versions and
trivial tasks. It is an environment/sandbox limitation, not a repository
issue — GitHub Actions runners run turbo normally. As a substitute, every
underlying task was verified directly:

- `pnpm install --frozen-lockfile` — passes
- `pnpm -r exec vitest run` — all 4 packages pass (shared 5, gateway 2,
  sdk-web 4 + 1 skipped-by-design, poc 2)
- `pnpm -r exec tsc -p tsconfig.json --noEmit` (lint) — passes
- `tsc -p tsconfig.build.json` (build) for shared/gateway/sdk-web — passes

## Minor content additions

- `examples/poc/src/poc.test.ts` — trivial test added so the `poc` package
  passes `vitest run` (vitest exits 1 when no test files are found, which
  would fail CI).
- `packages/gateway/tsconfig.json` sets `"types": ["node"]` and
  `@types/node` is a devDependency (needed for Express + Node typings).
- `packages/sdk-web` tsconfig sets the DOM libs (WebCrypto types).
- `.prettierrc.json` added so `prettier` output matches the repo style.
