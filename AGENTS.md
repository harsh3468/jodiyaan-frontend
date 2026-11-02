<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jodiyaan Frontend Agent Guidelines

Coding conventions, architecture guidelines, and workflows for `jodiyaan-frontend`. Follow these rules whenever writing or refactoring code in this repository.

## Architecture Overview

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript.
- **Styling**: Tailwind CSS v4 (`src/app/globals.css`).
- **State & Session**: Token and user session cached in `localStorage` via `src/lib/session.ts` and provided globally through `AuthProvider`.
- **API Client**: Centralized typed HTTP client in `src/lib/api.ts` talking to `jodiyaan-backend`.

---

## Hard Rules

1. **No constants in components/pages** — static option lists, navigation items, magic strings/numbers, config, and route paths must be declared in constants or `src/lib/` modules.
2. **No types or interfaces in components/pages** — all shared TypeScript types, interfaces, DTO shapes, and props types belong in `src/lib/types.ts` (or dedicated type files); components must import them.
3. **Prefer helpers for reusable logic** — formatting (dates, currency, names), validation, and string utilities belong in `src/lib/format.ts` or pure helpers under `src/lib/`.
4. **Data fetching & form logic in hooks or API clients** — components remain presentational. HTTP requests go through `src/lib/api.ts`; interactive loading and mutation states use custom hooks or `src/lib/use-api.ts`.
5. **No inline imports** — all `import` statements must remain at the top of the file, cleanly organized:
   - External library imports (React, Next.js, Lucide icons, etc.)
   - Internal core & lib imports (`@/...` or relative paths to `src/lib/`)
   - Components and UI elements (`src/components/`)
   - Styles last
6. **Route Protection & Guards** — protected app pages live under `src/app/(app)/` and wrap with `AuthGuard`. Public auth pages (e.g. `/login`) wrap with `RedirectIfSignedIn`. Do not write ad-hoc auth redirection inside pages.
7. **Tailwind CSS v4 standards** — use semantic Tailwind utility classes. Do not use arbitrary inline styles (`style={{ ... }}`) or inline CSS blocks when Tailwind utilities can achieve the design.

---

## Folder Map

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router pages, layouts, and route handlers |
| `src/app/(app)/` | Authenticated routes (`discover`, `interests`, `matches`, `me`, `profiles`) |
| `src/app/login/` | OTP request and verification login flow |
| `src/app/onboarding/` | First-time profile creation step |
| `src/components/` | Reusable presentational components, shells, guards (`app-shell.tsx`, `auth-guard.tsx`, `profile-card.tsx`, `ui.tsx`) |
| `src/lib/` | Reusable utilities, typed API client (`api.ts`), session management (`session.ts`), formatting (`format.ts`), shared types (`types.ts`) |
| `public/` | Static public assets (images, icons, logos) |

---

## API Layer Guidelines

- All backend requests go through `src/lib/api.ts`.
- `api` methods throw `ApiError` with HTTP `status` code and server error message. Always catch `ApiError` in form handlers or use `useApi` helper to display user-friendly errors.
- Never store raw sensitive user tokens directly in components; use `getToken()` and `setToken()` from `src/lib/session.ts`.

---

## Checklist Before Finishing Any Task

- [ ] No `const SOME_LIST = [...]` or hardcoded magic values inside `.tsx` component files.
- [ ] Shared `type` / `interface` declarations moved to `src/lib/types.ts`.
- [ ] Pure logic extracted to `src/lib/` helpers.
- [ ] API integration uses `src/lib/api.ts` with proper `ApiError` handling.
- [ ] Authenticated views wrapped in `AuthGuard` or `AppShell`.
- [ ] Imports are sorted and placed at the top of the file.
- [ ] `npm run lint` passes without errors.
