# lumail-cli

CLI for the lumail API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install <user>/lumail-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add <user>/lumail-cli
```

## Usage

```bash
lumail-cli auth set "your-token"
lumail-cli auth test
lumail-cli --help
```

## Resources

Run `lumail-cli --help` to see available resources.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
