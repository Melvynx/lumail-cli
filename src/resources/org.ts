import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const orgResource = new Command("org")
  .description("Organization info and stats");

// ── STATS ─────────────────────────────────────────────
orgResource
  .command("stats")
  .description("Get organization statistics")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli org stats\n  lumail-cli org stats --json")
  .action(async (opts) => {
    try {
      const data = await client.post("/tools/get_org_stats", {});
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
