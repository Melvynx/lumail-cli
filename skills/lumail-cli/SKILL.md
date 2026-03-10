---
name: lumail
description: "Manage Lumail via CLI - tools, subscribers, campaigns, workflows, tags. Use when user mentions 'lumail', 'email campaign', 'subscribers', 'newsletter', or 'email marketing'."
category: email-marketing
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

### tools

| Command | Description |
|---------|-------------|
| `lumail-cli tools list --json` | List all available Lumail tools |
| `lumail-cli tools run --tool <name> --json` | Run tool by name |
| `lumail-cli tools run --tool <name> --params '{"key":"value"}' --json` | Run tool with JSON parameters |

### subscribers

| Command | Description |
|---------|-------------|
| `lumail-cli subscribers list --json` | List all subscribers |
| `lumail-cli subscribers list --limit 10 --json` | List subscribers with limit |
| `lumail-cli subscribers list --status ACTIVE --json` | Filter by status |
| `lumail-cli subscribers list --query "john" --json` | Search by email or name |
| `lumail-cli subscribers list --tag vip --json` | Filter by tag |
| `lumail-cli subscribers list --fields email,name,status --json` | Select specific columns |
| `lumail-cli subscribers get --email "test@example.com" --json` | Get subscriber by email |
| `lumail-cli subscribers add --email "test@example.com" --json` | Add new subscriber |
| `lumail-cli subscribers add --email "test@example.com" --name "John" --json` | Add subscriber with name |
| `lumail-cli subscribers add --email "test@example.com" --tags "newsletter,vip" --json` | Add subscriber with tags |

### campaigns

| Command | Description |
|---------|-------------|
| `lumail-cli campaigns list --json` | List all campaigns |
| `lumail-cli campaigns list --limit 5 --json` | List campaigns with limit |
| `lumail-cli campaigns list --status DRAFT --json` | Filter by status |
| `lumail-cli campaigns list --fields id,name,status --json` | Select specific columns |
| `lumail-cli campaigns get --id abc123 --json` | Get campaign by ID |
| `lumail-cli campaigns create --name "Newsletter" --subject "Update" --content "<h1>Hello</h1>" --json` | Create campaign |
| `lumail-cli campaigns send --id abc123 --json` | Send a campaign |

### workflows

| Command | Description |
|---------|-------------|
| `lumail-cli workflows list --json` | List all workflows |
| `lumail-cli workflows list --limit 5 --json` | List workflows with limit |
| `lumail-cli workflows list --status ACTIVE --json` | Filter by status |
| `lumail-cli workflows list --fields id,name,status --json` | Select specific columns |
| `lumail-cli workflows create --name "Welcome Sequence" --json` | Create new workflow |
| `lumail-cli workflows activate --id abc123 --json` | Activate a workflow |

### tags

| Command | Description |
|---------|-------------|
| `lumail-cli tags list --json` | List all tags |
| `lumail-cli tags list --fields name,count --json` | Select specific columns |
| `lumail-cli tags create --name "vip" --json` | Create a new tag |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
