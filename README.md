# jamierumbelow.net

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run build
```

## crontab

```
*/5 * * * * cd /Users/jamierumbelow/code/jamierumbelow.github.io && /usr/bin/env bun run deploy > /dev/null 2>&1
```
