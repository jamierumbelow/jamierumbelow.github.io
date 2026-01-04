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
*/5 * * * * cd /Users/jamierumbelow/code/jamierumbelow.github.io && /Users/jamierumbelow/.bun/bin/bun run deploy >> /tmp/deploy.log 2>&1
```

Logs are written to `/tmp/deploy.log`.
