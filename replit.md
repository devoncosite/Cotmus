# PrivateAI — Replit Setup

## Project Overview

PrivateAI is a self-hosted AI chat interface (similar to ChatGPT) built with **Next.js 14**. It supports multiple AI providers: OpenAI, Anthropic (Claude), Google Gemini, DeepSeek, Azure OpenAI, and many others. Migrated from Vercel to Replit.

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Package Manager**: Yarn 1.22.x
- **Port**: 5000 (required for Replit's webview proxy)
- **Build Mode**: `standalone` (enables server-side API routes)
- **Key directories**:
  - `app/` — Next.js App Router (pages, API routes, components)
  - `app/api/` — Server-side API routes for each AI provider
  - `app/config/` — Server and client config
  - `app/store/` — Zustand state management
  - `public/` — Static assets

## Running the App

```bash
yarn dev    # Development server on port 5000
yarn build  # Production build
yarn start  # Production server on port 5000
```

## Replit Migration Notes

- `dev` and `start` scripts updated to bind on port `5000` and `0.0.0.0` for Replit proxy compatibility
- `husky install` (git hooks) disabled in `prepare` script — not compatible with Replit's git environment
- Workflow configured: **"Start application"** runs `yarn dev` on port 5000

## Environment Variables / Secrets

At minimum, set **one** AI provider API key. See `.env.template` for all options:

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (required if using GPT models) |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `CODE` | Access password(s) to protect your instance (comma-separated) |
| `BASE_URL` | Custom OpenAI-compatible base URL (optional) |

All API keys are server-side only — never exposed to the browser.

## Security

- API keys are injected server-side via Next.js API routes (`app/api/`)
- Access can be protected with `CODE` password env var
- CORS headers are configured in `next.config.mjs` for API routes
