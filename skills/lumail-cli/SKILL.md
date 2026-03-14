---
name: lumail-cli
description: "Manage Lumail via CLI - tools, subscribers, campaigns, workflows, tags, segments, analytics. Use when user mentions 'lumail', 'email campaign', 'subscribers', 'newsletter', or 'email marketing'."
category: email-marketing
---

# lumail-cli

## Setup

If `lumail-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle lumail
npx api2cli link lumail
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
lumail-cli auth set "your-token"
lumail-cli auth test
```

## Resources

### subscribers

| Command | Description |
|---------|-------------|
| `lumail-cli subscribers list --json` | List all subscribers |
| `lumail-cli subscribers list --limit 10 --json` | List subscribers with limit |
| `lumail-cli subscribers list --status ACTIVE --json` | Filter by status (SUBSCRIBED, UNSUBSCRIBED, BOUNCED) |
| `lumail-cli subscribers list --query "john" --json` | Search by email or name |
| `lumail-cli subscribers list --tag vip --json` | Filter by tag |
| `lumail-cli subscribers list --fields email,name,status --json` | Select specific columns |
| `lumail-cli subscribers get --email "test@example.com" --json` | Get subscriber by email |
| `lumail-cli subscribers add --email "test@example.com" --json` | Add new subscriber |
| `lumail-cli subscribers add --email "test@example.com" --name "John" --tags "newsletter,vip" --json` | Add subscriber with name and tags |

### campaigns

| Command | Description |
|---------|-------------|
| `lumail-cli campaigns list --json` | List all campaigns |
| `lumail-cli campaigns list --limit 5 --status DRAFT --json` | List with limit and status filter (DRAFT, SENT, SCHEDULED) |
| `lumail-cli campaigns list --fields id,name,status --json` | Select specific columns |
| `lumail-cli campaigns get --id <campaignId> --json` | Get campaign by ID (includes full content) |
| `lumail-cli campaigns create --name "Newsletter" --subject "Update" --content "<h1>Hello</h1>" --json` | Create campaign |
| `lumail-cli campaigns edit --id <campaignId> --subject "New subject" --json` | Edit campaign metadata |
| `lumail-cli campaigns edit --id <campaignId> --operations '[{"op":"replace_text","search":"old","replace":"new"}]' --json` | Surgical edit via operations |
| `lumail-cli campaigns edit --id <campaignId> --content '{"type":"doc","content":[...]}' --json` | Full content rewrite |
| `lumail-cli campaigns send --id <campaignId> --json` | Send a campaign |

### workflows

| Command | Description |
|---------|-------------|
| `lumail-cli workflows list --json` | List all workflows |
| `lumail-cli workflows list --limit 5 --status ACTIVE --json` | List with limit and status filter (ACTIVE, PAUSED) |
| `lumail-cli workflows list --fields id,name,status --json` | Select specific columns |
| `lumail-cli workflows create --name "Welcome Sequence" --json` | Create new workflow |
| `lumail-cli workflows activate --id <workflowId> --json` | Activate a workflow |

### tags

| Command | Description |
|---------|-------------|
| `lumail-cli tags list --json` | List all tags |
| `lumail-cli tags list --fields name,count --json` | Select specific columns |
| `lumail-cli tags create --name "vip" --json` | Create a new tag |

### tools (generic API runner)

| Command | Description |
|---------|-------------|
| `lumail-cli tools list --json` | List all 59 available Lumail API tools with schemas |
| `lumail-cli tools run --tool <name> --json` | Run any tool by name |
| `lumail-cli tools run --tool <name> --params '{"key":"value"}' --json` | Run tool with JSON parameters |

## JSON output structure

All `--json` output follows: `{"ok": true, "data": {...}}`. Access data directly:
- `data.subscribers` (list), `data.id` (get), `data.tools` (tools list), `data.total` (count)
- NO double nesting - it's always `data.<field>`, never `data.data.<field>`
- Campaign content is TipTap JSON (`data.content`). To extract plain text, traverse `content` nodes recursively and concatenate `text` fields.

## Campaign editing best practices

**Use `edit_campaign` for ALL campaign modifications** - it's the ONLY tool for editing campaigns. Two modes:

**Direct mode** (metadata or full content rewrite):
- Set name, subject, preview, and/or content (full TipTap JSON)
- `campaigns edit --id <id> --subject "New subject" --preview "Preview" --json`
- `campaigns edit --id <id> --content '{"type":"doc","content":[...]}' --json`

**Operations mode** (surgical edits, saves tokens):
- Pass an operations array for targeted changes WITHOUT rewriting full content
- `campaigns edit --id <id> --operations '[{"op":"replace_text","search":"old","replace":"new","all":true}]' --json`
- Available operations: `replace_text`, `insert_node`, `append_node`, `prepend_node`, `remove_node`, `replace_node`
- Can combine metadata fields (name, subject, preview) with operations in a single call

**DO NOT** provide both `--content` and `--operations` at the same time.

**TipTap format**: The `edit_campaign` tool description contains the full TipTap node reference inline - no need to load skills first.

Available skill types (via `get_skill`): `snippets`, `templates`, `variables`, `copywriter`

**Writing style**: ALWAYS call `tools run --tool get_writing_style --json` BEFORE writing/updating any email content to match the user's voice and tone.

**Snippets**: BEFORE creating content blocks (headers, footers, CTAs), call `tools run --tool get_email_snippets --json` to check for reusable snippets.

**Variables**: ALWAYS call `tools run --tool get_available_variables --json` BEFORE using variables in email content.

## Workflow creation flow

1. `tools run --tool create_workflow --params '{"name":"..."}' --json` - returns workflowId
2. `tools run --tool create_workflow_step --params '{"workflowId":"wf_xxx","type":"TRIGGER"}' --json`
3. `tools run --tool update_workflow_step --params '{"stepId":"step_xxx","type":"TRIGGER","tags":["tag-name"]}' --json`
4. `tools run --tool create_workflow_step --params '{"workflowId":"wf_xxx","type":"EMAIL"}' --json` - returns stepId AND campaignId
5. Use the campaignId (NOT stepId) to update email content via `edit_campaign`
6. `tools run --tool activate_workflow --params '{"workflowId":"wf_xxx"}' --json`

Steps execute in order (position 1, 2, 3...). Types: TRIGGER, EMAIL, WAIT, WEBHOOK, ACTION.

## Advanced commands via `tools run`

For features not exposed as direct CLI resources, use `tools run`. Below are the most useful ones grouped by category.

### Subscriber management

| Command | Description |
|---------|-------------|
| `tools run --tool get_subscriber --params '{"email":"x@y.com"}' --json` | Get subscriber by email |
| `tools run --tool get_subscriber --params '{"subscriberId":"sub_xxx"}' --json` | Get subscriber by ID |
| `tools run --tool unsubscribe --params '{"email":"x@y.com","reason":"requested"}' --json` | Unsubscribe |
| `tools run --tool bulk_add_tags --params '{"subscriberIds":["sub_1","sub_2"],"tagNames":["vip"]}' --json` | Bulk add tags |
| `tools run --tool bulk_remove_tags --params '{"subscriberIds":["sub_1"],"tagNames":["vip"]}' --json` | Bulk remove tags |
| `tools run --tool get_subscribers_by_tag --params '{"tagName":"vip","limit":10}' --json` | Get subscribers by tag |
| `tools run --tool count_subscribers_by_status --params '{"status":"SUBSCRIBED"}' --json` | Count by status |

### Subscriber events & emails

| Command | Description |
|---------|-------------|
| `tools run --tool create_event --params '{"email":"x@y.com","eventType":"purchase","amount":99}' --json` | Create event |
| `tools run --tool list_subscriber_events --params '{"email":"x@y.com","limit":10}' --json` | List subscriber events |
| `tools run --tool get_subscriber_emails --params '{"email":"x@y.com","limit":10}' --json` | Get emails sent to subscriber |

### Campaign management

| Command | Description |
|---------|-------------|
| `tools run --tool get_campaign_analytics --params '{"campaignId":"cmp_xxx"}' --json` | Get campaign analytics (opens, clicks, bounces) |
| `tools run --tool get_campaign_progress --params '{"campaignId":"cmp_xxx"}' --json` | Get sending progress |
| `tools run --tool duplicate_campaign --params '{"campaignId":"cmp_xxx","newName":"Copy"}' --json` | Duplicate campaign |
| `tools run --tool edit_campaign --params '{"id":"cmp_xxx","subject":"New subject"}' --json` | Edit campaign (metadata, content, or operations) |
| `tools run --tool update_campaign_filters --params '{"campaignId":"cmp_xxx","filters":{}}' --json` | Update campaign audience filters |
| `tools run --tool get_available_filters --json` | List available filter types |

### Workflows (advanced)

| Command | Description |
|---------|-------------|
| `tools run --tool get_workflow --params '{"workflowId":"wf_xxx"}' --json` | Get workflow details with steps |
| `tools run --tool deactivate_workflow --params '{"workflowId":"wf_xxx"}' --json` | Deactivate workflow |
| `tools run --tool duplicate_workflow --params '{"workflowId":"wf_xxx","newName":"Copy"}' --json` | Duplicate workflow |
| `tools run --tool add_subscriber_to_workflow --params '{"workflowId":"wf_xxx","email":"x@y.com"}' --json` | Add subscriber to workflow |
| `tools run --tool remove_subscriber_from_workflow --params '{"workflowId":"wf_xxx","email":"x@y.com"}' --json` | Remove subscriber from workflow |

### Workflow steps

| Command | Description |
|---------|-------------|
| `tools run --tool create_workflow_step --params '{"workflowId":"wf_xxx","type":"EMAIL"}' --json` | Create step (TRIGGER, EMAIL, WAIT, WEBHOOK, ACTION) |
| `tools run --tool update_workflow_step --params '{"stepId":"step_xxx","type":"EMAIL","config":{}}' --json` | Update step config |
| `tools run --tool delete_workflow_step --params '{"stepId":"step_xxx"}' --json` | Delete step |
| `tools run --tool reorder_workflow_step --params '{"stepId":"step_xxx","direction":"up"}' --json` | Move step up or down |

### Segments

| Command | Description |
|---------|-------------|
| `tools run --tool list_segments --params '{"limit":10}' --json` | List segments |
| `tools run --tool get_segment --params '{"segmentId":"seg_xxx"}' --json` | Get segment details |
| `tools run --tool create_segment --params '{"name":"Active users","filters":{}}' --json` | Create segment |
| `tools run --tool update_segment --params '{"segmentId":"seg_xxx","name":"Updated"}' --json` | Update segment |
| `tools run --tool delete_segment --params '{"segmentId":"seg_xxx"}' --json` | Delete segment |
| `tools run --tool duplicate_segment --params '{"segmentId":"seg_xxx","newName":"Copy"}' --json` | Duplicate segment |

### Tags (advanced)

| Command | Description |
|---------|-------------|
| `tools run --tool delete_tag --params '{"name":"old-tag"}' --json` | Delete tag by name |
| `tools run --tool delete_tag --params '{"tagId":"tag_xxx"}' --json` | Delete tag by ID |
| `tools run --tool get_or_create_tags --params '{"names":["vip","premium"]}' --json` | Get or create multiple tags |

### Analytics

| Command | Description |
|---------|-------------|
| `tools run --tool get_org_stats --json` | Get organization stats (subscribers, campaigns, tags, segments) |
| `tools run --tool get_subscriber_growth --params '{"days":30}' --json` | Subscriber growth over time |
| `tools run --tool get_subscriber_stats --json` | Subscriber statistics |

### Writing style

| Command | Description |
|---------|-------------|
| `tools run --tool get_writing_style --json` | Get current writing style |
| `tools run --tool update_writing_style --params '{"persona":"...","audience":"..."}' --json` | Update writing style |

### Organization settings

| Command | Description |
|---------|-------------|
| `tools run --tool update_organization_settings --params '{"name":"New Name","timezone":"Europe/Paris"}' --json` | Update org name/timezone |

### Email & misc

| Command | Description |
|---------|-------------|
| `tools run --tool send_email --params '{"to":"x@y.com","from":"sender_xxx","subject":"Hi","content":"<p>Hello</p>"}' --json` | Send a single email |
| `tools run --tool get_email_senders --json` | List email senders |
| `tools run --tool get_custom_fields --json` | List custom subscriber fields |
| `tools run --tool get_email_snippets --json` | List reusable email snippets |
| `tools run --tool get_available_variables --json` | List available template variables |
| `tools run --tool fetch_web_page --params '{"url":"https://example.com"}' --json` | Fetch web page content |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
