# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Project

This is **NextChat** (formerly ChatGPT-Next-Web) — a Next.js-based web/desktop AI chat application supporting multiple LLM providers. It runs as a Next.js web app and optionally as a Tauri desktop app.

## Development Commands

```bash
# Install dependencies
yarn install

# Start dev server (also watches and rebuilds masks)
yarn dev

# Build for production (standalone)
yarn build

# Build as static export (for desktop app)
yarn export

# Lint
yarn lint

# Run tests (watch mode)
yarn test

# Run tests (CI mode, no watch)
yarn test:ci

# Run a single test file
npx jest path/to/test.test.ts

# Rebuild prompt masks only
yarn mask

# Desktop app (Tauri)
yarn app:dev    # Dev mode
yarn app:build  # Production build
```

### Setup

Before running locally, create `.env.local` at project root:
```
OPENAI_API_KEY=<your api key>
```

See `.env.template` for the full list of supported env vars. Key optional ones:
- Per-provider keys: `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `DEEPSEEK_API_KEY`, etc.
- `CODE` — comma-separated access passwords
- `CUSTOM_MODELS` — `+model` to add, `-model` to hide, `name=displayName` to rename
- `DEFAULT_MODEL` — default model for new chats
- `ENABLE_MCP=true` — enable Model Context Protocol tool calling (must be set before building)
- `BUILD_MODE` — `standalone` (default, Next.js server) or `export` (static, for Tauri)

## Architecture

### Request Flow

Client requests go through Next.js API routes that act as proxies to the actual LLM providers. This keeps API keys server-side.

- `app/client/api.ts` — `LLMApi` abstract class and `ClientApi` factory. Each provider implements `chat()`, `speech()`, `usage()`, `models()`.
- `app/client/platforms/` — One file per provider (openai, anthropic, google, baidu, bytedance, alibaba, tencent, moonshot, iflytek, deepseek, xai, glm, siliconflow, ai302).
- `app/api/` — Next.js API route handlers, one per provider. `common.ts` has shared proxy logic (`requestOpenai`).

### State Management

Uses **Zustand** with persistence via `createPersistStore` (wraps Zustand's persist middleware).

- `app/store/chat.ts` — Chat sessions, messages, summarization, MCP tool calls
- `app/store/config.ts` — App-wide settings (theme, model defaults, TTS, etc.)
- `app/store/access.ts` — API keys, access codes, provider URLs
- `app/store/mask.ts` — Prompt templates ("masks")
- `app/store/prompt.ts` — User-defined custom prompts

### Key Concepts

- **Masks** — Pre-configured chat personas/templates. Built from `app/masks/` via `yarn mask` (runs `app/masks/build.ts` to generate `app/masks/index.ts`). Add new masks as `.ts` files in `app/masks/`.
- **MCP (Model Context Protocol)** — Tool-calling support. Logic in `app/mcp/`. Enabled via `ENABLE_MCP=true`.
- **Artifacts** — Sandboxed preview window for generated HTML/code. Enabled via `enableArtifacts` config.
- **Plugins** — Network search, calculator, and custom APIs. See `app/plugins/`.

### Build Modes

Two distinct output modes controlled by `BUILD_MODE`:
- **standalone** (default) — Next.js server-rendered app for web deployment
- **export** — Static HTML export used by Tauri desktop app (`yarn export` runs this)

The Tauri build (`yarn app:build`) calls `yarn export` internally before packaging.

### Testing

Jest with `jsdom` environment. `jest.setup.ts` mocks global `fetch`. Tests are sparse — the infrastructure exists but coverage is limited.

### Important Files

- `app/constant.ts` — All provider names, model lists, store keys, and template strings
- `app/config/server.ts` — Server-side env var parsing (`getServerSideConfig`)
- `app/config/client.ts` — Client-side config detection (Tauri vs web)
- `app/locales/` — i18n strings; default is `en.ts`
- `app/utils/stream.ts` — SSE streaming parser, handles thinking content for o1/o3 reasoning models

### Multi-Provider Pattern

When adding a new provider:
1. Add a platform client in `app/client/platforms/<name>.ts` implementing `LLMApi`
2. Register it in `ClientApi` constructor in `app/client/api.ts`
3. Add API route handler in `app/api/<name>/`
4. Add provider constants in `app/constant.ts`
5. Add API key field to `app/store/access.ts`
