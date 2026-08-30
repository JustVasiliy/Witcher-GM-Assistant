# Witcher GM Assistant

A web app that helps Game Masters run tabletop sessions of _The Witcher_
TTRPG: a bestiary/NPC database, an interactive combat tracker (HP, Stamina,
statuses, injuries), an initiative tracker with round counter, rules cheat
sheets, and GM notes — all behind user registration/login.

See [CLAUDE.md](./CLAUDE.md) for the full architecture and conventions.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Prisma](https://www.prisma.io) + PostgreSQL
- [styled-components](https://styled-components.com)
- [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com)
- [Auth.js](https://authjs.dev) (credentials + OAuth)
- pnpm, ESLint, Prettier, Vitest

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Setup

1. Copy `.env.example` to `.env` and fill in real values for `DATABASE_URL`
   and `AUTH_SECRET`.
2. Run `pnpm install` — this also runs `prisma generate` via the
   `postinstall` script.
3. Apply the database schema: `pnpm exec prisma migrate deploy` (or
   `pnpm exec prisma migrate dev` for local development).
4. Start the dev server: `pnpm dev`.

## Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `pnpm dev`          | Start the dev server            |
| `pnpm build`        | Build for production            |
| `pnpm start`        | Run the production build        |
| `pnpm lint`         | Lint the codebase               |
| `pnpm format`       | Format the codebase             |
| `pnpm format:check` | Check formatting without fixing |
| `pnpm typecheck`    | Type-check the codebase         |
| `pnpm test`         | Run the test suite              |

## Project Structure

```
src/
  app/       Next.js App Router routes/layouts
  modules/   Feature modules (bestiary, npc-tracker, initiative, ...)
  core/      Shared infrastructure (db, auth, ui, theme)
```

See [CLAUDE.md](./CLAUDE.md) for the module boundary rules and conventions
to follow when adding new features.
