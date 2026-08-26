# Portability: Claude Code and GitHub Copilot

Every plugin has a **portable core** that any open-skill–compatible tool reads, plus an
optional **Claude-only layer**. Nothing in the Claude layer breaks other tools — they
simply ignore files they don't understand.

## What each tool consumes

| Artifact | Path | Claude Code | GitHub Copilot (VS Code) | OpenCode |
|---|---|:--:|:--:|:--:|
| Skill (portable core) | `plugins/<p>/skills/<name>/SKILL.md` + `references/`, `templates/` | ✅ | ✅ | ✅ |
| Slash commands | `plugins/<p>/commands/*.md` | ✅ | — | — |
| Subagents | `plugins/<p>/agents/*.md` | ✅ | — | — |
| Hooks | `plugins/<p>/hooks/hooks.json` | ✅ | — | — |
| MCP servers | `plugins/<p>/.mcp.json` | ✅ | ✅ (if MCP configured) | ✅ (if MCP configured) |
| Marketplace catalog | `.claude-plugin/marketplace.json` | ✅ | — | — |

The only file a skill **must** have is `SKILL.md` with valid open-skill frontmatter
(`name`, `description`, `license`). That is the contract shared by every tool.

## Installing

**Claude Code** (CLI or VS Code extension):
```
/plugin marketplace add <owner>/sap-agent-skills
/plugin install sap-cap
```

**GitHub Copilot** (VS Code) and other open-skill tools:
```
npx skills add <owner>/sap-agent-skills
```
This links the `skills/` trees so Copilot Chat can load them. Copilot ignores the
Claude-only files above.

**Manual symlink** (any tool that scans a skills folder): link
`plugins/<p>/skills/<name>` into the tool's skills directory.

## Authoring rule

Put anything portable (guidance, references, templates) in the skill. Reserve
`commands/`, `agents/`, `hooks/`, and `.mcp.json` for genuinely Claude-specific
ergonomics — never hide required knowledge there, or non-Claude users lose it.
