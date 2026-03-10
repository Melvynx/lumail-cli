import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const workflowsResource = new Command("workflows")
  .description("Manage automation workflows");

// -- LIST --
workflowsResource
  .command("list")
  .description("List workflows")
  .option("--limit <n>", "Max results to return")
  .option("--status <status>", "Filter by status (e.g. ACTIVE, PAUSED)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows list --limit 5\n  lumail-cli workflows list --status ACTIVE --json")
  .action(async (opts: { limit?: string; status?: string; json?: boolean; format?: string; fields?: string }) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.limit) body.limit = Number(opts.limit);
      if (opts.status) body.status = opts.status;
      const data = await client.post("/list_workflows", body);
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CREATE --
workflowsResource
  .command("create")
  .description("Create a new workflow")
  .requiredOption("--name <name>", "Workflow name")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli workflows create --name "Welcome Sequence"')
  .action(async (opts: { name: string; json?: boolean }) => {
    try {
      const data = await client.post("/create_workflow", { name: opts.name });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- ACTIVATE --
workflowsResource
  .command("activate")
  .description("Activate a workflow")
  .requiredOption("--id <id>", "Workflow ID to activate")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows activate --id abc123")
  .action(async (opts: { id: string; json?: boolean }) => {
    try {
      const data = await client.post("/activate_workflow", { workflowId: opts.id });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
