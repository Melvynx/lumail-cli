import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tagsResource = new Command("tags")
  .description("Manage subscriber tags");

// -- LIST --
tagsResource
  .command("list")
  .description("List all tags")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli tags list\n  lumail-cli tags list --json")
  .action(async (opts: { json?: boolean; format?: string; fields?: string }) => {
    try {
      const data = await client.post("/list_tags");
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CREATE --
tagsResource
  .command("create")
  .description("Create a new tag")
  .requiredOption("--name <name>", "Tag name")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli tags create --name "vip"')
  .action(async (opts: { name: string; json?: boolean }) => {
    try {
      const data = await client.post("/create_tag", { name: opts.name });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
