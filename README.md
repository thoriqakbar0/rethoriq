# Rethoriq v3

Minimal TanStack Start app. Single empty white page.

## Run

```bash
pnpm install
pnpm dev
```

## Agentation

Agentation is installed but off by default, so the page stays blank.

```bash
VITE_ENABLE_AGENTATION=1 \\
pnpm agentation:mcp
pnpm dev
```

Override the endpoint with `VITE_AGENTATION_ENDPOINT`.

## Ship

```bash
pnpm build
pnpm deploy
```
