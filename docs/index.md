---
layout: home

hero:
  name: "Swagger MCP Server"
  text: "Chat-based API Development"
  tagline: Explore Swagger/OpenAPI and test APIs through AI conversation. No Postman needed.
  image:
    src: /logo.svg
    alt: Swagger MCP Server
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ongjin/swagger-mcp

features:
  - icon: "🔄"
    title: Multi-Service Switching
    details: Switch between multiple API services instantly via chat. Perfect for MSA environments with swagger-targets.json configuration.
  - icon: "🔍"
    title: Endpoint Discovery
    details: List, search, and explore all API endpoints with full details including parameters, request bodies, and responses.
  - icon: "🧪"
    title: Live API Testing
    details: Execute actual HTTP requests directly from chat. No Postman needed - test APIs with real-time responses.
  - icon: "📋"
    title: cURL Generation
    details: Generate ready-to-use cURL commands for any endpoint. Copy and paste to terminal instantly.
  - icon: "📊"
    title: Schema Inspection
    details: Get detailed schema/DTO structures for TypeScript interface generation. Supports Swagger 2.0 and OpenAPI 3.x.
  - icon: "🤖"
    title: AI-Ready
    details: Built for Model Context Protocol (MCP). Works with Claude Desktop and Claude Code CLI.
---

## Quick Start

```bash
# No installation required
npx @zerry_jin/swagger-mcp
```

Then ask Claude:

> "Connect to petstore API and show me all pet endpoints"

## Available Tools

### 🔌 Service Management
| Tool | Description |
|------|-------------|
| `swagger_select_service` | Select a service (alias from config or direct URL) |
| `swagger_list_services` | List all configured services |
| `swagger_get_current` | Show current service info |

### 🔍 API Discovery
| Tool | Description |
|------|-------------|
| `swagger_list_endpoints` | List all endpoints (filter by tag) |
| `swagger_get_endpoint` | Get endpoint details (params, body, responses) |
| `swagger_search` | Search endpoints by keyword |

### 📊 Schema Inspection
| Tool | Description |
|------|-------------|
| `swagger_get_schema` | Get schema/DTO structure |
| `swagger_list_schemas` | List all available schemas |

### 🧪 API Testing
| Tool | Description |
|------|-------------|
| `swagger_test` | **Execute actual HTTP request** |
| `swagger_curl` | **Generate cURL command** |

## Why?

Navigating through multiple service API docs in an MSA environment is cumbersome.

With this MCP server:
- **Seamless service switching** - Just say "Connect to payment server"
- **Direct API testing** - Call APIs from chat without Postman
- **Auto cURL generation** - Copy and paste to terminal
- **Schema/DTO lookup** - Use for TypeScript interface generation
- **Dynamic URL support** - Enter URLs directly without configuration
