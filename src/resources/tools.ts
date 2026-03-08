import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const toolsResource = new Command("tools")
  .description("Generic tool runner for the Lumail API");

// -- LIST --
toolsResource
  .command("list")
  .description("List all available Lumail tools")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli tools list\n  lumail-cli tools list --json")
  .action(async (opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get("");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- RUN --
toolsResource
  .command("run")
  .description("Run an arbitrary Lumail tool by name")
  .requiredOption("--tool <name>", "Tool name (e.g. list_subscribers, get_subscriber)")
  .option("--params <json>", "JSON string of parameters", "{}")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  lumail-cli tools run --tool list_subscribers\n  lumail-cli tools run --tool get_subscriber --params \'{"email": "test@example.com"}\'',
  )
  .action(async (opts: { tool: string; params?: string; json?: boolean; format?: string }) => {
    try {
      const body = opts.params ? JSON.parse(opts.params) : {};
      const data = await client.post(`/${opts.tool}`, body);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
