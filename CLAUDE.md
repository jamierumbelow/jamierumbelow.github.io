# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static site generator for jamierumbelow.net. It reads markdown files from an Obsidian vault, processes them with custom features, and outputs static HTML files to the `docs/` directory for GitHub Pages deployment.

## Commands

**Build the site:**
```bash
bun run build
```

**Build and deploy (commits and pushes):**
```bash
bun run deploy
```

**Build CSS (Tailwind):**
This runs automatically during build, but can be run manually:
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./docs/style.css
```

## Architecture

### Data Flow

1. **Source**: Obsidian vault at `~/Documents/Obsidian Vault/jamierumbelow.net`
2. **Query**: Markdown files tagged with `#public` are read from the filesystem via `src/db.ts`
3. **Process**: Content is normalized, markdown is rendered, special syntax is compiled
4. **Output**: Static HTML files written to `docs/` directory

### Key Concepts

**Obsidian Integration**: The site reads all `.md` files from the Obsidian vault directory (recursively). Only files containing the `#public` tag are included in the build. File titles are derived from the filename (without the `.md` extension).

**Homepage Structure**: The homepage note (`jamierumbelow.net`) has a special three-part structure separated by `***`:
1. Title/header section
2. Navigation links (as `[[Page Title]]` references)
3. Main content (rendered as homepage body)

**Special Syntax**:
- `[[Page Title]]` → Compiles to internal links (see `src/pageRefs.ts`)
- `{{books}}` → Replaced with dynamically generated book list from `data/books.csv`
- `#public` tag → Stripped from output (but used to filter which files to build)

**Page Processing** (`src/build.ts`):
- Content normalization removes `#public` tags and trims whitespace
- Markdown rendering uses `markdown-it` with custom link rules (all links open in new tabs)
- File hashing for cache-busting CSS
- File modification timestamps used for "last updated" dates

**Navigation** (`src/nav.ts`): Built from the homepage's middle section. Each `[[Page Title]]` reference is looked up from the loaded markdown files, converted to a slug, and rendered as a nav link.

**Books List** (`src/books.ts`): Reads `data/books.csv`, formats titles (handles "Title, The" → "The Title"), links to Amazon using ISBN10, displays author names.

**CSS**: Tailwind CSS v4 compiled from `src/input.css` to `docs/style.css` with cache-busting hash query parameter.

## File Organization

```
cmd/index.ts          - CLI entry point
src/build.ts          - Main build orchestration
src/deploy.ts         - Git commit and push automation
src/db.ts             - Filesystem queries for Obsidian vault
src/books.ts          - Books CSV processing
src/pageRefs.ts       - [[Page]] link compilation
src/nav.ts            - Navigation generation
src/template.ts       - HTML template
src/markdown.ts       - Markdown-it configuration
src/css.ts            - Tailwind build wrapper
src/config.ts         - Configuration constants (vault path, etc.)
src/utils.ts          - Utility functions (slugify, copyDir, etc.)
data/books.csv        - Books data
public/               - Static assets (images, CNAME, robots.txt)
docs/                 - Build output (GitHub Pages serves from here)
```

## Important Notes

- The site reads markdown files from `~/Documents/Obsidian Vault/jamierumbelow.net`
- Only files tagged with `#public` are included in the build
- Output directory is `docs/` (not `dist/` or `build/`) because GitHub Pages serves from there
- Deployment automatically runs build, then commits all changes with timestamp
- All markdown links automatically get `target="_blank"` attribute
- TypeScript is configured for Bun with strict mode enabled
- Pages are cached in memory during build for performance
