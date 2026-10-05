#!/usr/bin/env node
/**
 * Documentation checks:
 *   1. Chinese and English pages must come in pairs.
 *   2. Every internal link must resolve to a real page.
 *   3. Internal anchors must exist in the built HTML.
 *   4. Every tool page must be listed in the tool index and the sidebar.
 *
 * Run `npm run build` first: anchor checks read docs/.vitepress/dist.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const distDir = path.join(docsDir, '.vitepress', 'dist')
const publicDir = path.join(docsDir, 'public')

const errors = []
const fail = (message) => errors.push(message)

const toPosix = (value) => value.split(path.sep).join('/')

function walk(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.vitepress' || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, filter, out)
    else if (filter(entry.name)) out.push(full)
  }
  return out
}

const mdFiles = walk(docsDir, (name) => name.endsWith('.md'))
const relDocs = new Set(mdFiles.map((file) => toPosix(path.relative(docsDir, file))))

/* ------------------------------------------------------------------ */
/* 1. Locale parity                                                    */
/* ------------------------------------------------------------------ */
for (const rel of relDocs) {
  if (rel.startsWith('en/')) {
    const zh = rel.slice(3)
    if (!relDocs.has(zh)) fail(`[parity] ${rel} has no Chinese counterpart (docs/${zh})`)
  } else if (!relDocs.has(`en/${rel}`)) {
    fail(`[parity] docs/${rel} has no English counterpart (docs/en/${rel})`)
  }
}

/* ------------------------------------------------------------------ */
/* 2 & 3. Internal links and anchors                                   */
/* ------------------------------------------------------------------ */
const stripCode = (text) =>
  text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

const htmlCache = new Map()
function readHtml(relHtml) {
  if (htmlCache.has(relHtml)) return htmlCache.get(relHtml)
  const full = path.join(distDir, relHtml)
  const value = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null
  htmlCache.set(relHtml, value)
  return value
}

/** Map a docs-relative page path to candidate built files. */
function htmlCandidates(pagePath) {
  const clean = pagePath.replace(/\/+$/, '')
  const candidates = []
  if (clean.endsWith('.html')) candidates.push(clean)
  if (clean.endsWith('.md')) {
    const base = clean.slice(0, -3)
    candidates.push(`${base}.html`, `${base}/index.html`)
  }
  candidates.push(`${clean}.html`, `${clean}/index.html`)
  if (clean === '') candidates.push('index.html')
  return candidates
}

const linkPattern = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

for (const file of mdFiles) {
  const relFile = toPosix(path.relative(docsDir, file))
  const source = stripCode(fs.readFileSync(file, 'utf8'))
  const selfHtml = htmlCandidates(relFile.replace(/\.md$/, ''))

  for (const match of source.matchAll(linkPattern)) {
    const raw = match[1]
    if (/^(https?:|mailto:|tel:|data:)/i.test(raw)) continue

    const [rawPath, rawAnchor] = raw.split('#')
    const anchor = rawAnchor ? decodeURIComponent(rawAnchor) : ''
    const line = source.slice(0, match.index).split('\n').length

    if (!rawPath) {
      // Same-page anchor.
      const html = selfHtml.map(readHtml).find(Boolean)
      if (html && anchor && !html.includes(`id="${anchor}"`)) {
        fail(`[anchor] docs/${relFile}:${line} -> #${anchor} not found on this page`)
      }
      continue
    }

    const resolved = rawPath.startsWith('/')
      ? rawPath.slice(1)
      : toPosix(path.relative(docsDir, path.resolve(path.dirname(file), rawPath)))

    const inPublic = fs.existsSync(path.join(publicDir, resolved))
    const html = htmlCandidates(resolved).map(readHtml).find(Boolean)

    if (!inPublic && !html) {
      fail(`[link] docs/${relFile}:${line} -> ${rawPath} does not resolve`)
      continue
    }

    if (anchor && html && !html.includes(`id="${anchor}"`)) {
      fail(`[anchor] docs/${relFile}:${line} -> ${rawPath}#${rawAnchor} not found`)
    }
  }
}

/* ------------------------------------------------------------------ */
/* 4. Tool pages must be wired into the index and the sidebar          */
/* ------------------------------------------------------------------ */
const configPath = path.join(docsDir, '.vitepress', 'config.mts')
const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : ''

for (const locale of ['', 'en/']) {
  const indexFile = path.join(docsDir, `${locale}tools/index.md`)
  const index = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8') : ''
  // Pages that live under tools/ but are not per-tool guides.
  const nonToolPages = new Set(['index', 'compare'])
  const tools = walk(path.join(docsDir, `${locale}tools`), (name) => name.endsWith('.md'))
    .map((file) => path.basename(file, '.md'))
    .filter((name) => !nonToolPages.has(name))

  for (const tool of tools) {
    if (!index.includes(`(./${tool})`)) {
      fail(`[tools] ${locale}tools/${tool}.md is missing from ${locale}tools/index.md`)
    }
    if (!config.includes(`'/${locale}tools/${tool}'`)) {
      fail(`[tools] ${locale}tools/${tool}.md is missing from the sidebar in config.mts`)
    }
  }
}

/* ------------------------------------------------------------------ */
if (errors.length > 0) {
  console.error(`Documentation checks failed with ${errors.length} problem(s):\n`)
  for (const message of errors) console.error(`  - ${message}`)
  console.error('')
  process.exit(1)
}

console.log(`Documentation checks passed (${mdFiles.length} pages, links, anchors, locale parity).`)