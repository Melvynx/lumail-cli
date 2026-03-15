# lumail-cli

CLI for the Lumail API - email marketing platform. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install Melvynx/lumail-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/lumail-cli
```

## Auth

```bash
lumail-cli auth set <token>
lumail-cli auth show          # masked by default
lumail-cli auth show --raw    # full unmasked token
lumail-cli auth test          # verify token works
lumail-cli auth remove        # delete saved token
```

## Subscribers

```bash
# List subscribers
lumail-cli subscribers list --limit 10
lumail-cli subscribers list --status BOUNCED --json
lumail-cli subscribers list --tag vip
lumail-cli subscribers list --query "john@example.com"
lumail-cli subscribers list --fields "email,name,status"

# Get a subscriber
lumail-cli subscribers get --email "test@example.com"

# Add a subscriber
lumail-cli subscribers add --email "test@example.com" --name "John" --tags "newsletter,vip"
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--limit <n>` | list | Max results to return |
| `--status <status>` | list | Filter by status (ACTIVE, BOUNCED, UNSUBSCRIBED) |
| `--query <q>` | list | Search by email or name |
| `--tag <tag>` | list | Filter by tag name |
| `--fields <cols>` | list | Comma-separated columns to display |
| `--email <email>` | get, add | Subscriber email address |
| `--name <name>` | add | Subscriber name |
| `--tags <tags>` | add | Comma-separated tag names |

## Campaigns

```bash
# List campaigns
lumail-cli campaigns list --limit 5
lumail-cli campaigns list --status SENT --json

# Get a campaign
lumail-cli campaigns get --id abc123

# Create a campaign
lumail-cli campaigns create --name "Newsletter" --subject "Weekly Update" --content "<h1>Hello</h1>"

# Send a campaign
lumail-cli campaigns send --id abc123
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--limit <n>` | list | Max results to return |
| `--status <status>` | list | Filter by status (DRAFT, SENT, SCHEDULED) |
| `--fields <cols>` | list | Comma-separated columns to display |
| `--id <id>` | get, send | Campaign ID |
| `--name <name>` | create | Campaign name |
| `--subject <subject>` | create | Email subject line |
| `--content <content>` | create | Email body content (HTML) |

## Workflows

```bash
# List workflows
lumail-cli workflows list --limit 5
lumail-cli workflows list --status ACTIVE --json

# Create a workflow
lumail-cli workflows create --name "Welcome Sequence"

# Activate a workflow
lumail-cli workflows activate --id abc123
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--limit <n>` | list | Max results to return |
| `--status <status>` | list | Filter by status (ACTIVE, PAUSED) |
| `--fields <cols>` | list | Comma-separated columns to display |
| `--name <name>` | create | Workflow name |
| `--id <id>` | activate | Workflow ID to activate |

## Tags

```bash
# List all tags
lumail-cli tags list
lumail-cli tags list --json

# Create a tag
lumail-cli tags create --name "vip"
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--fields <cols>` | list | Comma-separated columns to display |
| `--name <name>` | create | Tag name |

## Tools

Generic tool runner for calling any Lumail API tool directly.

```bash
# List available tools
lumail-cli tools list
lumail-cli tools list --raw    # full schemas

# Run a tool by name
lumail-cli tools run --tool list_subscribers
lumail-cli tools run --tool get_subscriber --params '{"email": "test@example.com"}'
```

| Flag | Commands | Description |
|------|----------|-------------|
| `--raw` | list | Output raw API response with full schemas |
| `--tool <name>` | run | Tool name (e.g. list_subscribers) |
| `--params <json>` | run | JSON string of parameters |

## Global Flags

All commands support:

| Flag | Description |
|------|-------------|
| `--json` | Output as JSON |
| `--format <fmt>` | Output format: text, json, csv, yaml |
| `--verbose` | Enable debug logging |
| `--no-color` | Disable colored output |
| `--no-header` | Omit table/csv headers (for piping) |
