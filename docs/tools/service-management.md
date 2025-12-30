# Service Management

Tools for managing connections to multiple API services.

## swagger_select_service

Select a service to work with. Uses either an alias from `swagger-targets.json` or a direct URL.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Service alias or direct URL |

**Example prompts:**
- "Connect to the petstore API"
- "Use http://localhost:3000/api-docs"
- "Switch to the payment service"

**Response includes:**
- API title and version
- Description
- Server URLs
- Total endpoint count
- Available tags

**Usage Example:**
```
You: Connect to petstore API

Claude: [swagger_select_service name="petstore"]

✅ Connected to "petstore"
- Title: Swagger Petstore
- Version: 1.0.0
- Endpoints: 20
- Tags: pet, store, user
```

---

## swagger_list_services

Lists all configured services from `swagger-targets.json`.

**Parameters:** None

**Example prompts:**
- "What services are available?"
- "List all configured APIs"
- "Show me the service list"

**Usage Example:**
```
You: Show me registered services

Claude: [swagger_list_services]

📋 Registered Services (5):
- auth: http://localhost:3000/api-docs
- payment: http://localhost:3001/api-docs
- order: http://localhost:3002/api-docs
- petstore: https://petstore.swagger.io/v2/swagger.json
- local: ./docs/openapi.yaml
```

---

## swagger_get_current

Shows information about the currently selected service.

**Parameters:** None

**Example prompts:**
- "What service am I connected to?"
- "Show current API info"
- "What's the current service?"

**Usage Example:**
```
You: What service am I connected to?

Claude: [swagger_get_current]

📌 Current Service: petstore
- URL: https://petstore.swagger.io/v2/swagger.json
- Title: Swagger Petstore
- Version: 1.0.6
- Endpoints: 20
```
