@AGENTS.md

# Witcher GM Assistant

## Project Overview

A web application that helps Game Masters run tabletop sessions of *The
Witcher* TTRPG. Users register and log in, then manage a bestiary of
monsters/NPCs, run interactive NPC lists during combat (HP, Stamina,
statuses, injuries), track initiative order and round count, consult rules
cheat sheets, and keep freeform GM notes.

The app is built to grow: new features (dice rollers, loot generators,
encounter builders, campaign/session management, etc.) should be addable as
new modules without reworking existing ones. Modular architecture is a hard
requirement, not a nice-to-have.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **ORM / DB**: Prisma + PostgreSQL
- **Styling**: styled-components
- **Validation**: Zod
- **Forms**: React Hook Form (with `@hookform/resolvers/zod`)
- **Auth**: Auth.js (NextAuth) — credentials (email + password) and OAuth
  providers side by side
- **Package manager**: pnpm
- **Linting/formatting**: ESLint + Prettier
- **Testing**: Vitest for unit/integration tests

UI language is English only — no i18n library, no translation scaffolding.

## Architecture: Feature-Based Modules

All domain functionality lives under `src/modules/<module-name>/`. Each
module is self-contained and owns everything it needs:

```
src/modules/<module-name>/
  components/     UI components specific to this module
  actions.ts       Server Actions (mutations) for this module
  queries.ts        Prisma read access for this module
  schemas.ts       Zod schemas (shared by actions.ts and client forms)
  types.ts           Module-local TypeScript types
  index.ts            Public surface — the ONLY thing other modules may import
```

Expected initial modules: `auth`, `bestiary`, `npc-tracker`, `initiative`,
`cheatsheets`, `notes`.

Cross-cutting infrastructure that isn't specific to one domain lives under
`src/core/`:

```
src/core/
  db/          Prisma client singleton
  auth/        Auth.js config, session helpers, route guards
  ui/          Shared design-system components (Button, Card, Input, etc.)
  theme/       styled-components theme definition
```

### Module boundary rule

A module may only import from another module's `index.ts`. Never reach into
another module's `components/`, `actions.ts`, `queries.ts`, etc. directly.
`index.ts` is the module's public API — internals behind it can change
freely without breaking consumers.

This is what makes the architecture extensible: adding a new feature means
adding a new folder under `src/modules/`, wiring its `index.ts`, and hooking
it into navigation. It should never require editing another module's
internals.

### Adding a new module (checklist)

1. Create `src/modules/<name>/` with the structure above.
2. Define Zod schemas first (`schemas.ts`) — they're the single source of
   truth for both client-side form validation and server-side
   re-validation.
3. Implement `queries.ts` (reads) and `actions.ts` (writes) using the
   Prisma client from `src/core/db`.
4. Build components, using shared primitives from `src/core/ui` where
   possible instead of one-off styling.
5. Export only what other modules/pages actually need through `index.ts`.
6. Add any new Prisma models in `prisma/schema.prisma` and generate a
   migration (see Database Conventions).

## Data Flow Conventions

- **Mutations** go through Next.js Server Actions, colocated in each
  module's `actions.ts`. Do not create API route handlers for internal
  app mutations.
- **Validation happens twice, with one schema**: the same Zod schema
  drives the `zodResolver` on the React Hook Form instance (client-side
  UX) and is re-parsed at the top of the Server Action (server-side
  guarantee). Never trust client validation alone.
- **Reads** inside Server Components can call `queries.ts` functions
  directly. Client Components fetch through Server Actions or props
  passed down from a Server Component parent — no client-side data
  fetching library is used.
- **Prisma is only ever imported inside a module's `queries.ts` /
  `actions.ts`** (or `src/core/db`). Components — server or client — never
  import Prisma directly.

## Auth

- Auth.js handles sessions for both credentials (email + password, hashed
  with bcrypt) and OAuth providers.
- Auth configuration and helpers live in `src/core/auth/`; the `auth`
  module (`src/modules/auth/`) owns the registration/login UI and any
  auth-specific Server Actions (e.g. registration).
- Protected routes are grouped under a route group (e.g.
  `app/(protected)/`) that checks the session in a shared layout — don't
  duplicate session checks in every page.

## Database Conventions

- Single `prisma/schema.prisma`, organized with a comment header per
  domain area (bestiary, tracker, users, etc.) as the schema grows.
- Every schema change goes through `prisma migrate dev` locally — never
  hand-edit the database or use `db push` for anything meant to persist.
- Model and field names: `PascalCase` models, `camelCase` fields, matching
  Prisma conventions; Postgres table/column names follow Prisma's default
  mapping unless there's a specific reason to override with `@map`.

## Styling Conventions

- styled-components only — no CSS modules, no inline `style={}` props
  except for genuinely dynamic, computed-at-runtime values.
- Colocate styles with their component: `Component.tsx` +
  `Component.styles.ts` in the same folder.
- All colors, spacing, and typography come from the shared theme
  (`src/core/theme/`) via styled-components' `ThemeProvider` — no hardcoded
  hex values or magic pixel numbers in component styles.
- Shared, reusable primitives (buttons, inputs, cards, badges) belong in
  `src/core/ui/`, not duplicated per module.
- **styled-components theme access requires a Client Component.** React
  Server Components render outside the context tree, so any styled
  component reading `theme` (via `${({ theme }) => ...}` or `useTheme()`)
  must live in a file marked `"use client"`. Server Components should
  fetch/prepare data and pass it as props into these client-side styled
  leaf components, rather than rendering themed styled-components
  directly themselves.

## Code Quality

- Package manager: pnpm — use `pnpm add`, not `npm install` or `yarn add`.
- Run `pnpm lint` and `pnpm format` before considering work done.
- Unit/integration tests use Vitest; test files sit next to the code they
  cover as `*.test.ts`.
- TypeScript strict mode is on — don't weaken `tsconfig.json` to silence
  errors; fix the type issue instead.
- Keep files focused. If a module's `components/` folder or
  `actions.ts` grows unwieldy, split it (e.g. `actions/create-npc.ts`,
  `actions/update-npc-status.ts`) rather than letting one file sprawl.

## General Principles

- Follow YAGNI: build what the current feature set needs, not speculative
  future functionality — the module boundary rule is what makes future
  expansion cheap, not pre-built abstractions.
- Prefer editing/extending an existing module over creating a new one
  when a feature is a natural extension of it (e.g. an NPC's inventory
  belongs inside `npc-tracker` or `bestiary`, not a new module).
- When in doubt about where something belongs, prefer the smaller,
  more specific module over a shared/core catch-all.
