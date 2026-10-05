# kuncode-docs

Provider-agnostic setup guides for AI coding tools (Codex, Claude Code, OpenCode, GitHub Copilot CLI and others).

The docs are open to everyone: examples use KunCode as a reference address, but every step applies to any compatible gateway or official API. Using KunCode is not required.

- Site: https://120403.xyz/kuncode-docs/
- KunCode: https://kuncode.120403.xyz
- Repository: https://github.com/MY-Final/kuncode-docs

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
    index.md            #   overview / three-step setup
    api-key.md          #   create and copy an API key
    endpoints.md        #   pick the right protocol endpoint
    concepts.md         #   API keys, groups, channels, ratios, quota
    models.md           #   list models, capabilities, per-tool requirements
    errors.md           #   error codes and troubleshooting
  tools/                # Chinese per-tool guides
    codex.md
    claude-code.md
    opencode.md
    copilot.md
  faq.md
  en/                   # English mirror of the same tree
  public/               # static assets (images, logo, favicon)
```

Chinese pages live at the root (`docs/guide/...`); the English mirror lives under `docs/en/...` with the same filenames. When you add or edit a page, update both sides.

## Writing a new tool page

1. Copy an existing page such as `docs/tools/opencode.md` to `docs/tools/<tool>.md`.
2. Copy `docs/en/tools/opencode.md` to `docs/en/tools/<tool>.md` and translate it.
3. Register both in the `zhSidebar` / `enSidebar` arrays in `docs/.vitepress/config.mts`, under the right protocol group (OpenAI-compatible or Anthropic-compatible).
4. Add it to the tool table in `docs/tools/index.md` and `docs/en/tools/index.md`.
5. Put screenshots under `docs/public/images/<tool>/` and reference them as `/images/<tool>/<name>.png`.
6. Run `bun run build` before committing.

## Conventions

- Every Chinese page has an English counterpart with the same path under `docs/en/`.
- Screenshots live under `docs/public/images/<section>/` and are shared by both languages.
- Keep the reference address in examples as `https://kuncode.120403.xyz`, but note that it is replaceable.
- Internal links use root-absolute paths with the right locale prefix, e.g. `/guide/errors` and `/en/guide/errors`.