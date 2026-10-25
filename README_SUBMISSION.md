# MyRehat Task B — Better-T-Stack

Technical assessment implementation of a homestay marketplace listing flow, WhatsApp webhook response, AI description polishing, and a responsive landing page.

## Technology

- **Web:** Next.js 16, TypeScript
- **API:** Elysia, oRPC
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Better Auth
- **AI:** AI SDK / OpenRouter for the WAHA webhook; OpenCode SDK provider for the CLI polish utility
- **Tooling:** pnpm workspace, Turborepo, Biome, Vitest, Docker Compose

## Scope

| Feature | Implementation |
| --- | --- |
| F1: BuyHomestay | Public listing page and authentication-protected listing creation. Fields: title, price, location, category, WhatsApp contact. |
| F2: WAHA webhook | `POST /api/webhooks/waha`: validate the incoming message, generate a suitable reply using OpenRouter, and return `{to, reply}`. |
| F3: Description polish | `scripts/polish.ts` with CLI command `pnpm polish "..."`, using `ai-sdk-provider-opencode-sdk`. |
| F4: Landing page | Responsive homepage with the hero text **“Book homestays directly with hosts”**. |

F1 category options:

- `Buy Property`
- `Buy land to build homestay`
- `Buy Airbnb Profile`
- `Buy Airbnb Business`

## Project structure

- `apps/web` — Next.js UI, WAHA webhook, and internal server-side proxy routes
- `apps/server` — Elysia backend, Better Auth, and oRPC handler
- `packages/api` — oRPC router and listing validation
- `packages/db` — Drizzle schema and PostgreSQL integration
- `scripts/polish.ts` — OpenCode-powered text polishing CLI

## Prerequisites

- Node.js 24, pnpm 10.34.7
- PostgreSQL database and connection string
- Docker Desktop for Compose tests and deployment builds
- OpenRouter API key for live WAHA replies
- OpenCode server / supported AI provider for **live** F3 testing

## Local development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure local secrets in **untracked** files `apps/web/.env.local` and `apps/server/.env.local`. Refer to each app's `.env.schema` and the dummy `.env` files for supported keys. Never commit real credentials.
3. Ensure the PostgreSQL database and the relevant Drizzle tables exist. Apply database schema changes using the project's configured Drizzle workflow if necessary; do not run schema changes against a shared database without permission.
4. Run both applications:

   ```bash
   pnpm dev
   ```

   In the local setup tested for this assessment, Elysia ran on `http://localhost:3000` and Next.js on `http://localhost:3001`.

### Local environment variables

- **Web:** `NEXT_PUBLIC_SERVER_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`
- **Server:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, and other keys required by `.env.schema`
- **F3 CLI:** `OPENCODE_URL` (defaults to `http://127.0.0.1:4096`), `OPENCODE_MODEL` (defaults to `opencode/big-pickle`), and `OPENCODE_PASSWORD` when HTTP authentication is enabled

**Do not place real database passwords, API keys, or OpenCode passwords in committed files.**

## AI Description Polish (F3)

Start an authenticated OpenCode server separately and configure the CLI's connection credentials. Then run:

```bash
pnpm polish "A cozy homestay near the beach with 2 bedrooms"
```

Verified live example output:

> A warm and inviting homestay located near the beach, featuring two comfortable bedrooms.

Empty input is intentionally rejected with usage guidance and a nonzero exit code.

## Quality checks

```bash
pnpm exec vitest run
pnpm --filter web check-types
pnpm exec biome check .
```

Recorded local verification: **21 tests passed across four files**; TypeScript typecheck passed after regenerating Next.js route types. See `VERIFICATION.md` for details and outstanding checks.

## Docker Compose

Docker runs the web and API as separate services, with the API accessible to the web container using `http://server:3000`. Browser-facing `/rpc/*` and `/api/auth/*` requests are forwarded using Next.js Route Handlers, not external Next.js rewrites.

A local override `docker-compose.local.yml` can expose Next.js on `127.0.0.1:3001`; this local-only file is excluded from Git. Example:

```yaml
services:
  web:
    ports:
      - "127.0.0.1:3001:3001"
```

To start the **local** Compose configuration, use your own noncommitted local environment files:

```bash
PUBLIC_WEB_URL=http://localhost:3001 docker compose \
  --env-file apps/server/.env.local \
  --env-file apps/web/.env.local \
  -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

Check the oRPC proxy:

```bash
curl -i -X POST http://localhost:3001/rpc/healthCheck \
  -H 'Content-Type: application/json' -d '{}'
```

Expected successful body: `{"json":"OK"}`.

> The committed `.env` files must contain **dummy values only**. Populate all production secrets in Dokploy's environment management and set the public origin to the deployed HTTPS domain. This README does **not** claim a public Dokploy deployment is already live.

## Deployment and submission

- Repository: **add GitHub URL after first push**
- Public application: **add Dokploy URL after deployment and smoke tests**
- Test evidence: `VERIFICATION.md`
- AI assistance record: `AI_PROMPT_LOG.md`
- Video demo: **add URL only if produced**

### Security

- No `.env.local` files or live credentials in Git.
- Dummy `apps/web/.env` and `apps/server/.env` can be committed only after their contents have been verified.
- Production endpoints should use HTTPS, appropriate auth/cookie settings, and a verification mechanism for WAHA webhook requests before exposing the webhook publicly.
