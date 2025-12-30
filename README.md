# 🔌 Swagger MCP Server

Chat with AI to explore Swagger/OpenAPI and test APIs directly. API development through chat, no Postman needed.

[![npm version](https://img.shields.io/npm/v/@zerry_jin/swagger-mcp)](https://www.npmjs.com/package/@zerry_jin/swagger-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@zerry_jin/swagger-mcp)](https://www.npmjs.com/package/@zerry_jin/swagger-mcp)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://ongjin.github.io/swagger-mcp)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.x-green)
![Swagger](https://img.shields.io/badge/Swagger-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

**[한국어](./README_ko.md)** | **[📚 Documentation](https://ongjin.github.io/swagger-mcp)**

---

## Why?

Navigating between multiple API docs in MSA environments is tedious.

With this MCP server:
- 🔄 **Seamless service switching** - Just say "connect to payment server"
- 🧪 **Direct API testing** - Call APIs right from chat, no Postman needed
- 📋 **Auto-generate cURL** - Copy and paste to terminal
- 📊 **Schema/DTO inspection** - Use for TypeScript interface generation
- ⚡ **Dynamic URL support** - Enter URLs directly without config

---

## ✨ Available Tools

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

### 🛠️ Code Generation
| Tool | Description |
|------|-------------|
| `swagger_generate_code` | **Generate TypeScript/axios code** |

---

## 🚀 Installation

```bash
# No installation required
npx @zerry_jin/swagger-mcp

# Or install globally
npm install -g @zerry_jin/swagger-mcp
```

---

## ⚙️ Configuration

### Claude Code (CLI)

```bash
# Register MCP server
claude mcp add swagger-mcp -- npx @zerry_jin/swagger-mcp -s project

# Verify
claude mcp list
```

### Claude Desktop App

Add to `claude_desktop_config.json`:

<details>
<summary>📁 Config file locations</summary>

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

</details>

```json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

---

## 📋 Service Configuration (swagger-targets.json)

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

For environments like WSL/Docker where the API server URL differs from the spec URL:

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

### Config Search Order

1. **`--config` argument** - Explicit path
2. **`SWAGGER_MCP_CONFIG`** - Environment variable
3. **Current working directory**
4. **`~/.swagger-mcp/swagger-targets.json`** - Home directory

> 💡 **Tip**: For Claude Desktop, use `--config` to specify your project path:
> ```json
> "args": ["-y", "@zerry_jin/swagger-mcp", "--config", "/path/to/project"]
> ```

---

## 🎯 Quick Permission Setup

### Claude Code (CLI)

```bash
# In claude, type:
/permissions

# Add to Allowed Tools:
mcp__swagger-mcp__*
```

### Claude Desktop App

Check **"Always allow requests from this server"** on first tool use.

---

## 💡 Usage Examples

### 1️⃣ Select a Service

```
You: Connect to the petstore API

Claude: [swagger_select_service name="petstore"]

✅ Connected to "petstore"
- Title: Swagger Petstore
- Version: 1.0.0
- Endpoints: 20
- Tags: pet, store, user
```

### 2️⃣ List Endpoints

```
You: Show me all pet endpoints

Claude: [swagger_list_endpoints tag="pet"]

🏷️ 8 endpoints tagged "pet":
| Method | Path | Summary |
|--------|------|---------|
| POST | /pet | Add a new pet |
| PUT | /pet | Update a pet |
| GET | /pet/findByStatus | Find by status |
| GET | /pet/{petId} | Find by ID |
| DELETE | /pet/{petId} | Delete a pet |
...
```

### 3️⃣ Get Endpoint Details

```
You: Show me POST /pet details

Claude: [swagger_get_endpoint method="post" path="/pet"]

📖 POST /pet - Add a new pet to the store

Request Body (application/json):
{
  "name": string (required),
  "photoUrls": string[] (required),
  "status": "available" | "pending" | "sold"
}

Responses:
- 200: Successful
- 405: Invalid input
```

### 4️⃣ Get Schema/DTO

```
You: Show me the Pet schema

Claude: [swagger_get_schema schemaName="Pet"]

📊 Pet Schema:
{
  "type": "object",
  "required": ["name", "photoUrls"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "category": { "$ref": "#/definitions/Category" },
    "photoUrls": { "type": "array", "items": { "type": "string" } },
    "status": { "enum": ["available", "pending", "sold"] }
  }
}
```

### 5️⃣ Test API (🔥 No Postman Needed!)

```
You: Call GET /pet/1

Claude: [swagger_test method="GET" path="/pet/{petId}" pathParams={"petId":"1"}]

🧪 API Test Result:

Request: GET /pet/1
Status: 200 OK
Duration: 127ms

Response:
{
  "id": 1,
  "name": "doggie",
  "status": "available"
}

cURL:
curl 'https://petstore.swagger.io/v2/pet/1'
```

### 6️⃣ Generate cURL

```
You: Generate curl for creating a pet

Claude: [swagger_curl method="POST" path="/pet" body={...}]

📋 cURL Command:

curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "doggie",
    "photoUrls": ["https://example.com/photo.jpg"],
    "status": "available"
  }' \
  'https://petstore.swagger.io/v2/pet'
```

### 7️⃣ Switch Services

```
You: Now connect to the payment service

Claude: [swagger_select_service name="payment"]

✅ Switched to "payment" (http://localhost:3001/api-docs)
- Title: Payment API
- Endpoints: 12
```

### 8️⃣ Generate TypeScript Code (🔥 New!)

```
You: Generate TypeScript code for POST /pet

Claude: [swagger_generate_code method="post" path="/pet"]

📝 Generated TypeScript Code:

import axios, { AxiosResponse } from 'axios';

interface PostPetRequest {
  name: string;
  photoUrls: string[];
  status?: string;
}

/**
 * Add a new pet to the store
 */
export async function postPet(data: PostPetRequest): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet`;
  return axios.post(url, data);
}

// Note: Define BASE_URL constant or import from config
// const BASE_URL = 'http://localhost:8080';
```

---

## 🔧 Supported Specifications

| Format | Versions |
|--------|----------|
| OpenAPI | 3.0.x, 3.1.x |
| Swagger | 2.0 |

---

## 🏗️ Architecture

```
src/
├── index.ts                 # MCP server entry
├── services/
│   ├── config-loader.ts     # swagger-targets.json loader
│   ├── swagger-parser.ts    # OpenAPI parsing
│   └── http-client.ts       # API testing & cURL generation
├── tools/
│   └── swagger-tools.ts     # 11 MCP tools
└── types/
    └── swagger.ts           # TypeScript definitions
```

---

## 📚 Documentation

**[https://ongjin.github.io/swagger-mcp](https://ongjin.github.io/swagger-mcp)**

- [Getting Started](https://ongjin.github.io/swagger-mcp/getting-started)
- [Tools Reference](https://ongjin.github.io/swagger-mcp/tools/)
- [Examples & Best Practices](https://ongjin.github.io/swagger-mcp/examples)
- [API Reference](https://ongjin.github.io/swagger-mcp/api/)

---

## 🤝 Contributing

Contributions welcome!
- 🐛 Bug reports
- 💡 Feature suggestions
- 🔧 Pull requests

---

## 📄 License

MIT License

---

Made with ❤️ by **zerry**
