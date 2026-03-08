import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const campaignsResource = new Command("campaigns")
  .description("Manage campaigns");

// ── LIST ──────────────────────────────────────────────
campaignsResource
  .command("list")
  .description("List all campaigns")
  .option("--limit <n>", "Max results", "20")
  .option("--page <n>", "Page number", "1")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns list\n  lumail-cli campaigns list --json")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.limit) body.limit = Number(opts.limit);
      if (opts.page) body.page = Number(opts.page);
      const data = await client.post("/tools/list_campaigns", body);
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

// ── GET ───────────────────────────────────────────────
campaignsResource
  .command("get <id>")
  .description("Get a campaign by ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns get abc123\n  lumail-cli campaigns get abc123 --json")
  .action(async (id: string, opts) => {
    try {
      const data = await client.post("/tools/get_campaign", { campaignId: id });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
campaignsResource
  .command("update <id>")
  .description("Update a campaign with TipTap content")
  .option("--subject <subject>", "Email subject line")
  .option("--content <json>", "TipTap JSON content (as string)")
  .option("--preview <text>", "Preview text")
  .option("--from-name <name>", "Sender name")
  .option("--from-email <email>", "Sender email")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli campaigns update abc123 --subject "My Newsletter"\n  lumail-cli campaigns update abc123 --content \'{"type":"doc","content":[...]}\' --json')
  .action(async (id: string, opts) => {
    try {
      const body: Record<string, unknown> = { campaignId: id };
      if (opts.subject) body.subject = opts.subject;
      if (opts.content) body.content = JSON.parse(opts.content);
      if (opts.preview) body.previewText = opts.preview;
      if (opts.fromName) body.fromName = opts.fromName;
      if (opts.fromEmail) body.fromEmail = opts.fromEmail;
      const data = await client.post("/tools/update_campaign_with_tiptap", body);
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SEND ──────────────────────────────────────────────
campaignsResource
  .command("send <id>")
  .description("Send a campaign (sends real emails!)")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli campaigns send abc123\n  lumail-cli campaigns send abc123 --json")
  .action(async (id: string, opts) => {
    try {
      const data = await client.post("/tools/send_campaign", { campaignId: id });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
