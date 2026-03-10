import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const toolsResource = new Command("tools")
  .description("Generic tool runner for the Lumail API");

// -- LIST --
toolsResource
  .command("list")
  .description("List all available Lumail tools")
  .option("--json", "Output as JSON")
  .option("--raw", "Output raw API response with full schemas")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  lumail-cli tools list\n  lumail-cli tools list --json")
  .action(async (opts: { json?: boolean; raw?: boolean; format?: string }) => {
    try {
      const data = await client.get("");
      if (opts.raw) {
        output(data, { json: opts.json, format: opts.format });
      } else {
        let tools: Record<string, unknown>[] = [];
        if (Array.isArray(data)) {
          tools = data;
        } else if (typeof data === "object" && data !== null) {
          const dataObj = data as Record<string, unknown>;
          if (Array.isArray(dataObj.tools)) {
            tools = dataObj.tools;
          }
        }
        const formatted = tools.map((tool: Record<string, unknown>) => {
          const inputSchema = tool.inputSchema as Record<string, unknown>;
          const required = (inputSchema?.required as string[]) ?? [];
          const properties = (inputSchema?.properties ?? {}) as Record<string, unknown>;
          const paramNames = Object.keys(properties);
          const requiredParams = paramNames.filter((p) => required.includes(p));
          const optionalParams = paramNames.filter((p) => !required.includes(p));
          const params =
            requiredParams.length > 0 || optionalParams.length > 0
              ? [
                  ...requiredParams.map((p) => `${p} (required)`),
                  ...optionalParams.map((p) => `${p}`),
                ].join(", ")
              : "";

          return {
            name: String(tool.name ?? ""),
            description: String(tool.description ?? ""),
            params,
          };
        });
        output(formatted, { json: opts.json, format: opts.format });
      }
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- RUN --
toolsResource
  .command("run")
  .description("Run an arbitrary Lumail tool by name")
  .requiredOption("--tool <name>", "Tool name (e.g. list_subscribers, get_subscriber)")
  .option("--params <json>", "JSON string of parameters", "{}")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  lumail-cli tools run --tool list_subscribers\n  lumail-cli tools run --tool get_subscriber --params \'{"email": "test@example.com"}\'',
  )
  .action(async (opts: { tool: string; params?: string; json?: boolean; format?: string }) => {
    try {
      const body = opts.params ? JSON.parse(opts.params) : {};
      const data = await client.post(`/${opts.tool}`, body);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
