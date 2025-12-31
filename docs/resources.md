# Resources

MCP Resources provide read-only data that Claude can access as context without explicit tool calls.

## What are Resources?

Resources are data exposed via URI that Claude can read directly. Unlike tools (which perform actions), resources provide static or dynamic data that enriches the conversation context.

**Benefits:**
- No need to call tools repeatedly for the same data
- Claude can reference data naturally in responses
- Reduces context switching during complex tasks

## Available Resources

### swagger://services

Lists all configured services from `swagger-targets.json`.

**Example Response:**
```json
{
  "description": "Configured services from swagger-targets.json",
  "count": 3,
  "services": [
    { "alias": "auth", "spec": "http://localhost:3000/api-docs" },
    { "alias": "payment", "spec": "./specs/payment.json", "baseUrl": "http://localhost:3001" }
  ],
  "usage": "Use swagger_select_service with any alias to connect"
}
```

**Use Case:** Start a conversation by seeing all available services.

---

### swagger://current/info

Shows information about the currently connected service.

**Example Response:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "baseUrl": "http://localhost:3000",
  "title": "Auth API",
  "version": "1.0.0",
  "description": "Authentication and authorization service",
  "specVersion": "3.0.0",
  "endpointCount": 15,
  "tags": ["auth", "users", "tokens"]
}
```

**Use Case:** Quickly understand the current API without calling tools.

---

### swagger://current/endpoints

Lists all API endpoints from the current service.

**Example Response:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "count": 15,
  "endpoints": [
    {
      "method": "POST",
      "path": "/auth/login",
      "summary": "User login",
      "tags": ["auth"],
      "operationId": "login"
    },
    {
      "method": "GET",
      "path": "/users/{id}",
      "summary": "Get user by ID",
      "tags": ["users"],
      "operationId": "getUserById"
    }
  ]
}
```

**Use Case:** Get a full list of endpoints for analysis or code generation.

---

### swagger://current/schemas

Lists all schemas/DTOs from the current service.

**Example Response:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "count": 8,
  "schemas": [
    {
      "name": "User",
      "type": "object",
      "description": "User entity",
      "properties": ["id", "email", "name", "createdAt"]
    },
    {
      "name": "LoginRequest",
      "type": "object",
      "description": null,
      "properties": ["email", "password"]
    }
  ]
}
```

**Use Case:** Generate TypeScript interfaces or understand data structures.

---

## How to Use Resources

### In Claude Desktop

Use the `@` symbol to attach a resource to your message:

```
@swagger://current/endpoints

Find all user-related endpoints
```

### In Conversation

Simply reference the resource naturally:

```
You: Show me all available services

Claude: (reads swagger://services automatically)
Based on your configuration, you have 3 services available...
```

## Resources vs Tools

| Aspect | Resources | Tools |
|--------|-----------|-------|
| Purpose | Provide data | Perform actions |
| Invocation | Automatic or via @ | Explicit call |
| Read/Write | Read-only | Can modify state |
| Example | List all endpoints | Test an endpoint |

## Tips

1. **Start with Resources**: Begin a session by checking `swagger://services` to see available options

2. **Combine with Tools**: Use resources for context, then tools for actions:
   ```
   @swagger://current/endpoints
   Generate TypeScript code for the login endpoint
   ```

3. **Schema Analysis**: Use `swagger://current/schemas` when generating types or validating data structures
