# Getting Started

This guide will help you set up Swagger MCP Server and start using it with Claude.

## Prerequisites

- **Node.js** >= 18.0.0
- **Claude Desktop** or **Claude Code CLI**

## Installation

### Option 1: Using npx (Recommended)

No installation required. Just configure your Claude client:

```bash
npx @zerry_jin/swagger-mcp
```

### Option 2: Global Installation

```bash
npm install -g @zerry_jin/swagger-mcp
```

## Configuration

### Claude Code (CLI)

```bash
# Register MCP server
claude mcp add swagger-mcp -- npx @zerry_jin/swagger-mcp -s project

# Verify
claude mcp list
```

### Claude Desktop App

Add the following to your Claude Desktop configuration file:

::: code-group

```json [macOS]
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

```json [Windows]
// %APPDATA%\Claude\claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

```json [Linux]
// ~/.config/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

:::

## Service Configuration (swagger-targets.json)

Create `swagger-targets.json` in your project root for quick service switching:

```json
{
  "auth": "http://localhost:3000/api-docs",
  "payment": "http://localhost:3001/api-docs",
  "order": "http://localhost:3002/api-docs",
  "petstore": "https://petstore.swagger.io/v2/swagger.json",
  "local": "./docs/openapi.yaml"
}
```

### Extended Configuration with Base URL

For environments like WSL/Docker where the API server URL differs from the spec URL, use the extended format:

```json
{
  "core": {
    "spec": "http://host.docker.internal:8080/v3/api-docs",
    "baseUrl": "http://localhost:8080"
  },
  "payment": {
    "spec": "./specs/payment.json",
    "baseUrl": "http://localhost:3001"
  }
}
```

The `baseUrl` will be used automatically for `swagger_test` and `swagger_curl` commands.

Now you can switch services by name:
```
You: Connect to payment service
Claude: ✅ Connected to "payment" (http://localhost:3001/api-docs)
```

### Config File Search Order

The server searches for `swagger-targets.json` in the following order:

1. **Explicit path** via `--config` or `-c` argument
2. **Environment variable** `SWAGGER_MCP_CONFIG`
3. **Current working directory**
4. **Home directory** `~/.swagger-mcp/swagger-targets.json`

::: tip Using with Claude Desktop
Since Claude Desktop's working directory may not be your project root, use the `--config` argument to specify the path:

```json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp", "--config", "/path/to/your/project"]
    }
  }
}
```
:::

## Quick Permission Setup

### Claude Code (CLI)

```bash
# In claude, type:
/permissions

# Add to Allowed Tools:
mcp__swagger-mcp__*
```

### Claude Desktop App

Check **"Always allow requests from this server"** on first tool use.

## Verify Installation

After configuring, restart your Claude client. You should see the Swagger MCP tools available.

Try asking Claude:

> "Connect to petstore API and list all endpoints"

If everything is set up correctly, Claude will use `swagger_select_service` to connect and `swagger_list_endpoints` to show the API.

## Supported Specifications

| Format | Versions |
|--------|----------|
| OpenAPI | 3.0.x, 3.1.x |
| Swagger | 2.0 |

## Next Steps

- Check out the [Tools Reference](/tools/) for detailed tool documentation
- See [Examples & Best Practices](/examples) for usage patterns
- Explore the [API Reference](/api/) for TypeDoc generated docs
