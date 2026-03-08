import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tagsResource = new Command("tags")
  .description("Manage tags");

// ── LIST ──────────────────────────────────────────────
tagsResource
  .command("list")
  .description("List all tags")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli tags list\n  lumail-cli tags list --json")
  .action(async (opts) => {
    try {
      const data = await client.post("/tools/list_tags", {});
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, {
        json: opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
