import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const toolsResource = new Command("tools")
  .description("Raw access to Lumail tools API");

// ── LIST ──────────────────────────────────────────────
toolsResource
  .command("list")
  .description("List all available API tools")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli tools list\n  lumail-cli tools list --json")
  .action(async (opts) => {
    try {
      const data = await client.get("/tools");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── EXECUTE ───────────────────────────────────────────
toolsResource
  .command("execute <tool_name>")
  .description("Execute any tool by name with raw JSON params")
  .option("--params <json>", "JSON params to pass", "{}")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", `\nExamples:\n  lumail-cli tools execute get_org_stats --json\n  lumail-cli tools execute get_subscriber --params '{"email":"test@example.com"}' --json`)
  .action(async (toolName: string, opts) => {
    try {
      const params = JSON.parse(opts.params);
      const data = await client.post(`/tools/${toolName}`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
