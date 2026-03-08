import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const workflowsResource = new Command("workflows")
  .description("Manage workflows");

// ── LIST ──────────────────────────────────────────────
workflowsResource
  .command("list")
  .description("List all workflows")
  .option("--limit <n>", "Max results", "20")
  .option("--page <n>", "Page number", "1")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows list\n  lumail-cli workflows list --json")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.limit) body.limit = Number(opts.limit);
      if (opts.page) body.page = Number(opts.page);
      const data = await client.post("/tools/list_workflows", body);
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

// ── CREATE ────────────────────────────────────────────
workflowsResource
  .command("create")
  .description("Create a new workflow")
  .requiredOption("--name <name>", "Workflow name")
  .option("--description <desc>", "Workflow description")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli workflows create --name "Welcome Series"\n  lumail-cli workflows create --name "Onboarding" --json')
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.description) body.description = opts.description;
      const data = await client.post("/tools/create_workflow", body);
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
workflowsResource
  .command("delete <id>")
  .description("Delete a workflow")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows delete abc123\n  lumail-cli workflows delete abc123 --json")
  .action(async (id: string, opts) => {
    try {
      const data = await client.post("/tools/delete_workflow", { workflowId: id });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result ?? { deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── ACTIVATE ──────────────────────────────────────────
workflowsResource
  .command("activate <id>")
  .description("Activate a workflow (starts processing!)")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows activate abc123\n  lumail-cli workflows activate abc123 --json")
  .action(async (id: string, opts) => {
    try {
      const data = await client.post("/tools/activate_workflow", { workflowId: id });
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE-STEP ───────────────────────────────────────
workflowsResource
  .command("create-step <workflowId>")
  .description("Add a step to a workflow")
  .requiredOption("--type <type>", "Step type (TRIGGER, EMAIL, DELAY, CONDITION)")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  lumail-cli workflows create-step wf123 --type TRIGGER\n  lumail-cli workflows create-step wf123 --type EMAIL --json")
  .action(async (workflowId: string, opts) => {
    try {
      const body: Record<string, unknown> = { workflowId, type: opts.type };
      const data = await client.post("/tools/create_workflow_step", body);
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE-STEP ───────────────────────────────────────
workflowsResource
  .command("update-step <stepId>")
  .description("Update a workflow step")
  .option("--tags <tags>", "Comma-separated trigger tags")
  .option("--delay <mins>", "Delay in minutes")
  .option("--params <json>", "Raw JSON params for the step")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  lumail-cli workflows update-step step123 --tags "newsletter,welcome"\n  lumail-cli workflows update-step step123 --delay 60 --json')
  .action(async (stepId: string, opts) => {
    try {
      const body: Record<string, unknown> = { stepId };
      if (opts.tags) body.tags = opts.tags.split(",").map((t: string) => t.trim());
      if (opts.delay) body.delayMinutes = Number(opts.delay);
      if (opts.params) Object.assign(body, JSON.parse(opts.params));
      const data = await client.post("/tools/update_workflow_step", body);
      const result = (data as Record<string, unknown>)?.data ?? data;
      output(result, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
