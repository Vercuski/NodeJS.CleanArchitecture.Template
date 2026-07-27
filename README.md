# clean-arch-node

A base Node.js + TypeScript project structured around Clean Architecture
(a.k.a. the Dependency Rule): source code dependencies only point inward,
toward the domain. Nothing in `domain/` or `application/` imports Express,
a database driver, or anything else concrete — only interfaces ("ports").

## Layers, and their .NET equivalents

| Folder             | Purpose                                                              | Roughly like...                                  |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| `domain/`           | Entities, Value Objects, domain errors, repository **interfaces**     | Your `Domain` project (POCOs + `IRepository<T>`)  |
| `application/`      | Use cases (application services) + ports they need (`Logger`, `Clock`) | Your `Application` project (MediatR handlers)     |
| `infrastructure/`   | Concrete implementations of every port                                | Your `Infrastructure` project (EF Core, etc.)     |
| `presentation/`     | Express controllers/routes — translates HTTP <-> use cases            | Your `Web`/`Api` project (Controllers)             |
| `bootstrap/`        | Composition root: wires concrete infrastructure into use cases        | `Program.cs` registering services in the DI container |

The dependency rule in one sentence: **domain knows nothing about anyone;
everyone knows about domain.** `infrastructure/` and `presentation/` both
depend inward on `application/` and `domain/`, never the other way around.

## Dependency injection: no container, no decorators

This template uses a **manual composition root** (`bootstrap/composition-root.ts`)
instead of a DI container like `tsyringe` or `inversify`. Every dependency is
a plain constructor argument — the same idea as constructor injection in
.NET, just wired by hand in one file instead of `services.AddScoped<...>()`.
It's more explicit, has zero runtime dependencies, and — because it avoids
decorators entirely — keeps every file compatible with Node's native
TypeScript execution (see below). If the object graph grows large enough to
want a container, `tsyringe` is the closest match to .NET's built-in DI.

## Why there's no build step

Since Node.js 22.6 (stable from 23.6, and the default on 24 LTS), Node can
run `.ts` files directly via **type stripping**: it erases type annotations
at load time and runs the plain JavaScript underneath. No `ts-node`, no
`tsx`, no `dist/` folder needed for `dev` or `start`.

Type stripping only supports **erasable** syntax — it can't run `enum`,
`namespace`, or constructor parameter properties (`constructor(private x: Foo)`),
because those need actual code generation, not just erasure. `tsconfig.json`
sets `"erasableSyntaxOnly": true` so `tsc` itself will error if any file
accidentally uses one of those — the whole codebase is guaranteed to run
natively. That's also why entities/value objects assign fields explicitly
in the constructor body instead of using parameter-property shorthand.

Relative imports use real `.ts` extensions (e.g. `from "./user.entity.ts"`).
`allowImportingTsExtensions` + `rewriteRelativeImportExtensions` let `tsc`
still emit a valid `dist/` (rewriting `.ts` → `.js`) if you ever want a
compiled build for a Docker image or an npm package — `npm run build`.

`tsc` never runs your code; it only type-checks (`npm run typecheck`) and,
optionally, emits `dist/` (`npm run build`). Running the app never requires it.

## Requirements

- Node.js 24 (Active LTS) or newer
- npm

## Getting started

```bash
npm install
cp .env.example .env
npm run dev          # watches src/ and restarts on save
```

```bash
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","displayName":"Ada"}'
```

## Scripts

| Command                | Does                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Run with `node --watch`, restarts on file change             |
| `npm start`             | Run once, no watch (fine for production too)                 |
| `npm run build`         | Optional: emit a compiled `dist/` via `tsc`                   |
| `npm run typecheck`     | Type-check with `tsc --noEmit`, no execution                  |
| `npm test`              | Run unit tests with Vitest                                    |
| `npm run lint`          | ESLint, including type-aware rules                             |

## Adding a new use case

1. Add/extend entities or value objects in `domain/` if the business rule
   lives there.
2. Add ports in `domain/repositories/` (persistence) or `application/ports/`
   (anything else external) if a new capability is needed.
3. Write the use case in `application/use-cases/<name>/`, plus its DTOs.
4. Implement any new ports in `infrastructure/`.
5. Add a controller + route in `presentation/http/`.
6. Wire the new pieces together in `bootstrap/composition-root.ts`.

## A note on TypeScript's version

This template targets **TypeScript 6.0**, the current stable release, and
uses only syntax that's also valid under TypeScript 7 (the new Go-based
compiler). TypeScript 7 is GA and dramatically faster, but at the time of
writing `typescript-eslint` (and therefore this template's lint setup)
hasn't added support for it yet — worth revisiting once the ecosystem
catches up.
