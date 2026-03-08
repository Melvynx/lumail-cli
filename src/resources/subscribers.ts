import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const subscribersResource = new Command("subscribers")
  .description("Manage subscribers");

// -- LIST --
subscribersResource
  .command("list")
  .description("List all subscribers")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli subscribers list\n  lumail-cli subscribers list --json")
  .action(async (opts: { json?: boolean; format?: string; fields?: string }) => {
    try {
      const data = await client.post("/list_subscribers");
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- GET --
subscribersResource
  .command("get")
  .description("Get a specific subscriber by email")
  .requiredOption("--email <email>", "Subscriber email address")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", '\nExamples:\n  lumail-cli subscribers get --email "test@example.com"')
  .action(async (opts: { email: string; json?: boolean; format?: string }) => {
    try {
      const data = await client.post("/get_subscriber", { email: opts.email });
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- ADD --
subscribersResource
  .command("add")
  .description("Add a new subscriber")
  .requiredOption("--email <email>", "Subscriber email address")
  .option("--name <name>", "Subscriber name")
  .option("--tags <tags>", "Comma-separated tag names")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  lumail-cli subscribers add --email "test@example.com"\n  lumail-cli subscribers add --email "test@example.com" --name "John" --tags "newsletter,vip"',
  )
  .action(async (opts: { email: string; name?: string; tags?: string; json?: boolean }) => {
    try {
      const body: Record<string, unknown> = { email: opts.email };
      if (opts.name) body.name = opts.name;
      if (opts.tags) body.tags = opts.tags.split(",").map((t) => t.trim());
      const data = await client.post("/add_subscriber", body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
