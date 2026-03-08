# lumail-cli

CLI for the Lumail email marketing API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install Melvynx/lumail-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/lumail-cli
```

## Usage

```bash
lumail-cli auth set "your-token"
lumail-cli auth test
lumail-cli --help
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
| `lumail-cli campaigns send <id> --json` | Send a campaign |

### workflows

| Command | Description |
|---------|-------------|
| `lumail-cli workflows list --json` | List all workflows |
| `lumail-cli workflows create --name "Welcome Series" --json` | Create a workflow |
| `lumail-cli workflows delete <id> --json` | Delete a workflow |
| `lumail-cli workflows activate <id> --json` | Activate a workflow |
| `lumail-cli workflows create-step <workflowId> --type TRIGGER --json` | Add a trigger step |
| `lumail-cli workflows create-step <workflowId> --type EMAIL --json` | Add an email step |
| `lumail-cli workflows update-step <stepId> --tags "newsletter" --json` | Update step trigger tags |

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
| `lumail-cli tools execute <tool_name> --params '{"key":"value"}' --json` | Execute any tool by name |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
