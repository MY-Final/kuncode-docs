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

## Build and verify

```bash
npm run verify
```

`npm run verify` runs the VitePress build and then `node scripts/check-docs.mjs`. The checks cover Chinese/English locale parity, internal links, anchors in the built HTML, and tool pages being registered in both the tools index and the sidebar. They also verify that the homepage tool counts match the number of per-tool pages and that each Chinese/English tool page pair has the same `最后验证` / `Last verified` date.

To preview a completed build locally:

```bash
npm run preview
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
  beginner/             # beginner onboarding module
    index.md            #   start here
    quickstart.md       #   15-minute minimal setup
    windows.md          #   Windows notes
    free-models.md      #   free and trial models
    first-run.md        #   let AI install and configure tools
    prompts.md          #   configuration prompt library
    help.md             #   what to do when setup fails
  guide/                # Chinese getting started
    index.md            #   overview, placeholder conventions, three-step setup
    concepts.md         #   API keys, groups, channels, ratios, quota
    api-key.md          #   create and copy an API key
    endpoints.md        #   choose the right protocol endpoint
    models.md           #   list models and capabilities
    usage.md            #   what to do after setup
    security.md         #   key storage, rotation and safety
    network.md          #   proxies, custom CAs and connectivity
    cost-control.md     #   budgets, limits and usage control
    errors.md           #   error codes and troubleshooting
  tools/                # 14 Chinese per-tool guides
    claude-code.md
    cline.md
    codebuddy.md
    codex.md
    copilot.md
    crush.md
    gemini-cli.md
    goose.md
    kilo-code.md
    opencode.md
    piagent.md
    qwen-code.md
    trae.md
    vscode-copilot.md
  faq.md
  en/                   # English mirror of the same tree
  public/               # static assets (images, logo, favicon)
```

Chinese pages live at the root (`docs/guide/...`); the English mirror lives under `docs/en/...` with the same filenames. When you add or edit a page, update both sides.

## Writing a new tool page

1. Copy an existing page such as `docs/tools/opencode.md` to `docs/tools/<tool>.md`.
2. Copy `docs/en/tools/opencode.md` to `docs/en/tools/<tool>.md` and translate it.
3. Keep the `最后验证` / `Last verified` dates identical, and use the current date after re-checking the setup.
4. Register both pages in the `zhSidebar` and `enSidebar` arrays in `docs/.vitepress/config.mts`.
5. Add both pages to the tool tables in `docs/tools/index.md` and `docs/en/tools/index.md`.
6. If the number of per-tool pages changes, update the tool count in `docs/index.md` and `docs/en/index.md`; `npm run check` enforces that it matches.
7. Put screenshots under `docs/public/images/<tool>/` and reference them as `/images/<tool>/<name>.png`.
8. Run `npm run verify` before committing.

## Conventions

- Every Chinese page has an English counterpart with the same path under `docs/en/`.
- Screenshots live under `docs/public/images/<section>/` and are shared by both languages.
- Keep the reference address in examples as `https://kuncode.120403.xyz`, but note that it is replaceable.
- Internal links use root-absolute paths with the right locale prefix, e.g. `/guide/errors` and `/en/guide/errors`.

## License

Documentation content under `docs/` is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](LICENSE). If you redistribute or adapt it, you must give appropriate credit and share your contributions under the same license.

Code in `docs/.vitepress/`, `scripts/`, and configuration files is licensed under the [MIT License](LICENSE-CODE).
