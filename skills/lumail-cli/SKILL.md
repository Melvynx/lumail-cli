---
name: lumail-cli
description: "Manage lumail via CLI - subscribers, campaigns, workflows, tags, org stats, tools. Use when user mentions 'lumail' or wants to interact with the lumail API."
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

### subscribers

| Command | Description |
|---------|-------------|
| `lumail-cli subscribers list --json` | List all subscribers |
| `lumail-cli subscribers list --tag newsletter --json` | List subscribers filtered by tag |
| `lumail-cli subscribers get user@example.com --json` | Get a subscriber by email |
| `lumail-cli subscribers add --email user@example.com --json` | Add a subscriber |
| `lumail-cli subscribers add --email user@example.com --tags "newsletter,vip" --json` | Add subscriber with tags |
| `lumail-cli subscribers delete user@example.com --json` | Delete a subscriber |

### campaigns

| Command | Description |
|---------|-------------|
| `lumail-cli campaigns list --json` | List all campaigns |
| `lumail-cli campaigns get <id> --json` | Get a campaign by ID |
| `lumail-cli campaigns update <id> --subject "My Newsletter" --json` | Update campaign subject |
| `lumail-cli campaigns update <id> --content '{"type":"doc","content":[...]}' --json` | Update campaign TipTap content |
| `lumail-cli campaigns send <id> --json` | Send a campaign (sends real emails!) |

### workflows

| Command | Description |
|---------|-------------|
| `lumail-cli workflows list --json` | List all workflows |
| `lumail-cli workflows create --name "Welcome Series" --json` | Create a workflow |
| `lumail-cli workflows delete <id> --json` | Delete a workflow |
| `lumail-cli workflows activate <id> --json` | Activate a workflow (starts processing!) |
| `lumail-cli workflows create-step <workflowId> --type TRIGGER --json` | Add a trigger step |
| `lumail-cli workflows create-step <workflowId> --type EMAIL --json` | Add an email step (returns campaignId) |
| `lumail-cli workflows update-step <stepId> --tags "newsletter,welcome" --json` | Update step trigger tags |
| `lumail-cli workflows update-step <stepId> --delay 60 --json` | Set step delay in minutes |

### tags

| Command | Description |
|---------|-------------|
| `lumail-cli tags list --json` | List all tags |

### org

| Command | Description |
|---------|-------------|
| `lumail-cli org stats --json` | Get organization statistics |

### tools

| Command | Description |
|---------|-------------|
| `lumail-cli tools list --json` | List all available API tools |
| `lumail-cli tools execute <tool_name> --json` | Execute any tool by name |
| `lumail-cli tools execute get_subscriber --params '{"email":"test@example.com"}' --json` | Execute tool with params |

## Workflow Creation Flow

1. `lumail-cli workflows create --name "My Workflow" --json` → get workflowId
2. `lumail-cli workflows create-step <workflowId> --type TRIGGER --json` → get stepId
3. `lumail-cli workflows update-step <stepId> --tags "newsletter" --json`
4. `lumail-cli workflows create-step <workflowId> --type EMAIL --json` → get stepId AND campaignId
5. `lumail-cli campaigns update <campaignId> --subject "Welcome" --content '...' --json`
6. `lumail-cli workflows activate <workflowId> --json`

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
