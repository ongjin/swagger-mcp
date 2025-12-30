# Tools Overview

Swagger MCP Server provides 11 tools organized into 5 categories.

## Categories

### 🔌 [Service Management](./service-management)

Manage connections to multiple API services.

| Tool | Description |
|------|-------------|
| `swagger_select_service` | Select a service (alias from config or direct URL) |
| `swagger_list_services` | List all configured services |
| `swagger_get_current` | Show current service info |

### 🔍 [API Discovery](./api-discovery)

Explore and search API endpoints.

| Tool | Description |
|------|-------------|
| `swagger_list_endpoints` | List all endpoints (filter by tag) |
| `swagger_get_endpoint` | Get endpoint details (params, body, responses) |
| `swagger_search` | Search endpoints by keyword |

### 📊 [Schema Inspection](./schema-inspection)

Inspect data schemas and DTOs.

| Tool | Description |
|------|-------------|
| `swagger_get_schema` | Get schema/DTO structure |
| `swagger_list_schemas` | List all available schemas |

### 🧪 [API Testing](./api-testing)

Test APIs and generate cURL commands.

| Tool | Description |
|------|-------------|
| `swagger_test` | **Execute actual HTTP request** |
| `swagger_curl` | **Generate cURL command** |

### 🛠️ Code Generation

Generate code from API specifications.

| Tool | Description |
|------|-------------|
| `swagger_generate_code` | **Generate TypeScript/axios code** |

## Quick Reference

```
# Service Management
swagger_select_service  → Connect to a service
swagger_list_services   → List available services
swagger_get_current     → Show current connection

# API Discovery
swagger_list_endpoints  → List all endpoints
swagger_get_endpoint    → Get endpoint details
swagger_search          → Search by keyword

# Schema Inspection
swagger_get_schema      → Get schema structure
swagger_list_schemas    → List all schemas

# API Testing
swagger_test            → Execute HTTP request
swagger_curl            → Generate cURL command

# Code Generation
swagger_generate_code   → Generate TypeScript/axios code
```
