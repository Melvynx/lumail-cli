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

// -- EDIT --
campaignsResource
  .command("edit")
  .description("Edit a campaign (name, subject, preview, content, or surgical operations)")
  .requiredOption("--id <id>", "Campaign ID")
  .option("--name <name>", "New campaign name")
  .option("--subject <subject>", "New email subject line")
  .option("--preview <preview>", "New preview/preheader text")
  .option("--content <json>", "Full TipTap JSON content (for complete rewrites)")
  .option("--operations <json>", "JSON array of surgical edit operations")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    `\nExamples:
  lumail-cli campaigns edit --id cmp_xxx --subject "New subject" --json
  lumail-cli campaigns edit --id cmp_xxx --name "Renamed" --preview "Preview text" --json
  lumail-cli campaigns edit --id cmp_xxx --operations '[{"op":"replace_text","search":"old","replace":"new","all":true}]' --json
  lumail-cli campaigns edit --id cmp_xxx --content '{"type":"doc","content":[...]}' --json`,
  )
  .action(async (opts: { id: string; name?: string; subject?: string; preview?: string; content?: string; operations?: string; json?: boolean }) => {
    try {
      const body: Record<string, unknown> = { id: opts.id };
      if (opts.name) body.name = opts.name;
      if (opts.subject) body.subject = opts.subject;
      if (opts.preview !== undefined) body.preview = opts.preview;
      if (opts.content) body.content = JSON.parse(opts.content);
      if (opts.operations) body.operations = JSON.parse(opts.operations);
      const data = await client.post("/edit_campaign", body);
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
