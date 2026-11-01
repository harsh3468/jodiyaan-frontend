# jodiyaan-frontend

Next.js web app for Jodiyaan. Talks to [jodiyaan-backend](../jodiyaan-backend).

## Run locally

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```

Start the backend first. Sign-in codes are printed to the backend log when SMTP is not configured.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Email + one-time code sign-in |
| `/onboarding` | Create profile |
| `/discover` | Browse profiles with filters |
| `/profiles/:userId` | View profile, send/accept interest, block, report |
| `/interests` | Received and sent interests |
| `/matches`, `/matches/:id` | Matches and chat |
| `/me`, `/me/edit` | Own profile, photo, visibility, blocked members |

## Deploy free on Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Set `NEXT_PUBLIC_API_URL` to the backend URL (for example `https://jodiyaan-api.onrender.com`).
3. Add the Vercel URL to the backend's `CORS_ORIGINS`.
