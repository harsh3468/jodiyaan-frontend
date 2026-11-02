---
name: jodiyaan-frontend
description: >-
  Next.js 16 App Router + React 19 + Tailwind CSS v4 conventions for jodiyaan-frontend:
  constants and types outside components, helpers under src/lib/, centralized api client in
  src/lib/api.ts, session management via src/lib/session.ts, auth guards for protected routes,
  and top-of-file imports. Use when writing, modifying, or refactoring pages, components,
  API interactions, auth flows, or styles in this repository.
---

# Jodiyaan Frontend

Apply these conventions on every frontend change in this repository.

## Hard Rules

1. **No constants in components/pages** — static lists, dropdown options, config objects, routes, UI copy, and magic values live in `src/lib/` (or dedicated constants modules).
2. **No types or interfaces in components/pages** — domain entities, DTO shapes, and props types live in `src/lib/types.ts`; components import them.
3. **Prefer helpers** — shared logic (date/age calculations, height formatting, location strings) goes in `src/lib/format.ts` or pure helpers under `src/lib/`.
4. **Data handling in API client and hooks** — API queries and mutations go through `src/lib/api.ts` (`api.profiles`, `api.matches`, `api.interests`, `api.safety`); loading and error state are managed via `src/lib/use-api.ts` or custom hooks.
5. **Route protection** — pages under `src/app/(app)/` must be wrapped with `<AuthGuard>`; public authentication pages wrap with `<RedirectIfSignedIn>`.
6. **No inline imports** — imports only at the top of the file, cleanly ordered (external -> lib -> components -> styles).
7. **Semantic Tailwind CSS v4** — style using Tailwind utilities, leveraging theme definitions in `src/app/globals.css`. Do not add arbitrary inline style objects.

## Folder Map

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router root layout, global styles, public landing page |
| `src/app/(app)/` | Authenticated routes: `discover`, `profiles`, `interests`, `matches`, `me` |
| `src/app/login/` | Phone/email and OTP sign-in flow |
| `src/app/onboarding/` | New user profile creation form |
| `src/components/` | Reusable presentational components (`app-shell.tsx`, `auth-guard.tsx`, `profile-card.tsx`, `ui.tsx`) |
| `src/lib/api.ts` | Typed HTTP client for all Jodiyaan backend endpoints |
| `src/lib/session.ts` | Auth token storage (`AUTH_TOKEN_KEY`), session user persistence |
| `src/lib/types.ts` | Shared interfaces, DTOs, enums, and API shapes |
| `src/lib/format.ts` | Pure formatting utilities (age, height, location, dates) |
| `src/lib/use-api.ts` | Hook for executing async API operations with loading and error states |

## API Layer Pattern

- Endpoint clients are namespaced in `src/lib/api.ts`:
  - `api.auth.requestOtp(email)`
  - `api.auth.verifyOtp(email, code)`
  - `api.auth.me()`
  - `api.profiles.getOwn()`, `api.profiles.create(dto)`, `api.profiles.update(dto)`, `api.profiles.uploadPhoto(file)`
  - `api.profiles.discover(params)`, `api.profiles.getById(userId)`
  - `api.interests.send(targetUserId)`, `api.interests.listReceived()`, `api.interests.listSent()`, `api.interests.accept(id)`, `api.interests.decline(id)`
  - `api.matches.list()`, `api.matches.getById(id)`, `api.matches.listMessages(id)`, `api.matches.sendMessage(id, text)`
  - `api.safety.blockUser(userId)`, `api.safety.listBlocked()`, `api.safety.unblockUser(userId)`, `api.safety.report(dto)`
- Always handle `ApiError` instances:
  ```ts
  try {
    await api.profiles.update(payload);
  } catch (err) {
    if (err instanceof ApiError) {
      // display err.message
    }
  }
  ```

## Checklist Before Finishing

- [ ] No `const OPTIONS = [...]`, magic strings, or `type`/`interface` declarations inside components/pages.
- [ ] Shared types declared in `src/lib/types.ts`.
- [ ] API calls routed through `src/lib/api.ts` with `ApiError` handling.
- [ ] Protected app views guarded with `AuthGuard`.
- [ ] Responsive UI verified with Tailwind CSS v4 utility classes.
- [ ] Imports arranged at top of the file.
- [ ] `npm run lint` passes with no warnings or errors.
