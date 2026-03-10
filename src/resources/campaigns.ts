import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const campaignsResource = new Command("campaigns")
  .description("Manage email campaigns");

// -- LIST --
campaignsResource
  .command("list")
  .description("List campaigns")
  .option("--limit <n>", "Max results to return")
  .option("--status <status>", "Filter by status (e.g. DRAFT, SENT, SCHEDULED)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns list --limit 5\n  lumail-cli campaigns list --status SENT --json")
  .action(async (opts: { limit?: string; status?: string; json?: boolean; format?: string; fields?: string }) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.limit) body.limit = Number(opts.limit);
      if (opts.status) body.status = opts.status;
      const data = await client.post("/list_campaigns", body);
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- GET --
campaignsResource
  .command("get")
  .description("Get a specific campaign by ID")
  .requiredOption("--id <id>", "Campaign ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns get --id abc123")
  .action(async (opts: { id: string; json?: boolean; format?: string }) => {
    try {
      const data = await client.post("/get_campaign", { campaignId: opts.id });
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CREATE --
campaignsResource
  .command("create")
  .description("Create a new campaign")
  .requiredOption("--name <name>", "Campaign name")
  .requiredOption("--subject <subject>", "Email subject line")
  .requiredOption("--content <content>", "Email body content (HTML)")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  lumail-cli campaigns create --name "Newsletter" --subject "Weekly Update" --content "<h1>Hello</h1>"',
  )
  .action(async (opts: { name: string; subject: string; content: string; json?: boolean }) => {
    try {
      const data = await client.post("/create_campaign", {
        name: opts.name,
        subject: opts.subject,
        content: opts.content,
      });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- SEND --
campaignsResource
  .command("send")
  .description("Send a campaign")
  .requiredOption("--id <id>", "Campaign ID to send")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns send --id abc123")
  .action(async (opts: { id: string; json?: boolean }) => {
    try {
      const data = await client.post("/send_campaign", { campaignId: opts.id });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
