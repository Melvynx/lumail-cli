import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const subscribersResource = new Command("subscribers")
  .description("Manage subscribers");

// ── LIST ──────────────────────────────────────────────
subscribersResource
  .command("list")
  .description("List all subscribers")
  .option("--limit <n>", "Max results", "20")
  .option("--page <n>", "Page number", "1")
  .option("--tag <tag>", "Filter by tag")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli subscribers list\n  lumail-cli subscribers list --tag newsletter --json")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.limit) body.limit = Number(opts.limit);
      if (opts.page) body.page = Number(opts.page);
      if (opts.tag) body.tag = opts.tag;
      const data = await client.post("/tools/list_subscribers", body);
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
subscribersResource
  .command("get <email>")
  .description("Get a subscriber by email")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli subscribers get user@example.com\n  lumail-cli subscribers get user@example.com --json")
  .action(async (email: string, opts) => {
    try {
      const data = await client.post("/tools/get_subscriber", { email });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── ADD ──────────────────────────────────────────────
subscribersResource
  .command("add")
  .description("Add a new subscriber")
  .requiredOption("--email <email>", "Subscriber email")
  .option("--name <name>", "Subscriber name")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli subscribers add --email user@example.com\n  lumail-cli subscribers add --email user@example.com --tags "newsletter,vip" --json')
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { email: opts.email };
      if (opts.name) body.name = opts.name;
      if (opts.tags) body.tags = opts.tags.split(",").map((t: string) => t.trim());
      const data = await client.post("/tools/add_subscriber", body);
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
subscribersResource
  .command("delete <email>")
  .description("Delete a subscriber by email")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli subscribers delete user@example.com\n  lumail-cli subscribers delete user@example.com --json")
  .action(async (email: string, opts) => {
    try {
      const data = await client.post("/tools/delete_subscriber", { email });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result ?? { deleted: true, email }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
