---
name: lumail
description: "Manage lumail via CLI - {{RESOURCES_LIST}}. Use when user mentions 'lumail' or wants to interact with the lumail API."
category: {{CATEGORY}}
---

# lumail-cli

## Setup

If `lumail-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle lumail
npx api2cli link lumail
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
lumail-cli auth set "your-token"
lumail-cli auth test
```

## Resources

{{RESOURCES_HELP}}

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
