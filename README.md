# kuncode-docs

Provider-agnostic setup guides for AI coding tools (Codex, Claude Code, OpenCode and others).

The docs are open to everyone: examples use KunCode as a reference address, but every step applies to any compatible gateway or official API. Using KunCode is not required.

## Local development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## Deploy to GitHub Pages

1. Push this repository to GitHub with `main` as the default branch.
2. In **Settings -> Pages**, set **Source** to **GitHub Actions**.
3. The included workflow builds and deploys on every push to `main`.

The workflow injects `BASE_PATH=/<repo-name>/` so project pages resolve correctly. For a user or organization page (`<user>.github.io`), change `BASE_PATH` to `/`.

## Content layout

```
docs/
  index.md              # Chinese home
  guide/                # Chinese getting started
  tools/                # Chinese per-tool guides
  faq.md
  en/                   # English mirror
  public/               # static assets
```

Add a new tool by copying `docs/tools/opencode.md` and its English counterpart, then registering both in `docs/.vitepress/config.mts`.
