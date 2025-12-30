# Examples & Best Practices

Real-world usage examples and best practices for Swagger MCP Server.

## Common Workflows

### Exploring a New API

When you encounter a new API, follow this workflow:

```
1. "Connect to https://petstore.swagger.io/v2/swagger.json"
   → Establishes connection and shows API overview

2. "List all available endpoints"
   → Shows all endpoints organized by tags

3. "Show me the endpoints tagged with 'pet'"
   → Filters to specific category

4. "Get details for POST /pet"
   → Shows parameters, request body, responses

5. "Show me the Pet schema"
   → Shows data structure for TypeScript/validation
```

**Full Conversation Example:**
```
You: Connect to the petstore API

Claude: ✅ Connected to "petstore"
- Title: Swagger Petstore
- Version: 1.0.6
- Endpoints: 20
- Tags: pet, store, user

You: What endpoints are available for pets?

Claude: 🏷️ 8 endpoints tagged "pet":
| Method | Path | Summary |
|--------|------|---------|
| POST | /pet | Add a new pet |
| PUT | /pet | Update a pet |
| GET | /pet/findByStatus | Find by status |
...

You: Show me how to create a pet

Claude: 📖 POST /pet - Add a new pet to the store

Request Body (required):
{
  "name": string (required),
  "photoUrls": string[] (required),
  "status": "available" | "pending" | "sold"
}
```

---

### Testing an API Endpoint

Test endpoints directly without leaving the chat:

```
1. "Connect to petstore"
   → Connect to service

2. "Call GET /pet/1"
   → Execute actual request, see response

3. "Test POST /pet with name 'buddy' and status 'available'"
   → Create new resource
```

**Full Conversation Example:**
```
You: Call GET /pet/1

Claude: 🧪 API Test Result:

Request: GET /pet/1
Status: 200 OK
Duration: 127ms

Response:
{
  "id": 1,
  "name": "doggie",
  "status": "available"
}

You: Now test creating a new pet named "Max"

Claude: 🧪 API Test Result:

Request: POST /pet
Status: 200 OK
Duration: 234ms

Response:
{
  "id": 9223372036854775807,
  "name": "Max",
  "status": "available"
}
```

---

### Generating cURL Commands

Generate cURL for terminal or scripts:

```
1. "Connect to the payment service"
2. "Show me the POST /orders endpoint"
3. "Generate curl command for creating an order with amount 100"
```

**Full Conversation Example:**
```
You: Generate curl for creating a pet

Claude: 📋 cURL Command:

curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "doggie",
    "photoUrls": ["https://example.com/photo.jpg"],
    "status": "available"
  }' \
  'https://petstore.swagger.io/v2/pet'
```

---

### MSA Environment Workflow

Switch between multiple services seamlessly:

```
1. "List available services"
   → See all configured services

2. "Connect to auth service"
   → Work with authentication API

3. "Show me the login endpoint"
   → Explore auth endpoints

4. "Now switch to payment service"
   → Change context to different service

5. "Search for 'refund' endpoints"
   → Find relevant endpoints in new service
```

**Full Conversation Example:**
```
You: What services do I have?

Claude: 📋 Registered Services (4):
- auth: http://localhost:3000/api-docs
- payment: http://localhost:3001/api-docs
- order: http://localhost:3002/api-docs
- petstore: https://petstore.swagger.io/v2/swagger.json

You: Connect to payment service

Claude: ✅ Connected to "payment"
- Title: Payment API
- Endpoints: 12
- Tags: payments, refunds, webhooks

You: Search for refund endpoints

Claude: 🔍 Found 3 endpoints matching "refund":
| Method | Path | Summary |
|--------|------|---------|
| POST | /refunds | Create refund |
| GET | /refunds/{id} | Get refund status |
| GET | /payments/{id}/refunds | List refunds for payment |
```

---

### API Documentation Review

Review API documentation systematically:

```
1. "Connect to the API and show current info"
2. "Are there any deprecated endpoints?"
3. "List all schemas"
4. "What authentication is required?"
```

---

## Best Practices

### Service Configuration

::: tip Use swagger-targets.json
Create a `swagger-targets.json` file in your project root for quick service switching:

```json
{
  "auth": "http://localhost:3000/api-docs",
  "payment": "http://localhost:3001/api-docs",
  "staging": "https://staging-api.example.com/docs"
}
```

This is especially useful in MSA environments where you frequently switch between services.
:::

### Caching Behavior

::: tip Specification Caching
Specifications are cached after the first fetch. To refresh:
- Reconnect to the same service
- The cache is cleared when the server restarts
:::

### URL Format

::: warning Always Include Protocol
When using direct URLs, always include the full protocol:

```
✅ "Connect to https://api.example.com/docs"
✅ "Use http://localhost:3000/api-docs"
❌ "Connect to api.example.com/docs"
```
:::

### API Testing Safety

::: warning Be Careful with Mutations
The `swagger_test` tool makes **real HTTP requests**. Be careful when:
- Testing POST, PUT, DELETE endpoints
- Working with production APIs
- Dealing with sensitive data

Consider using staging environments for testing.
:::

### TypeScript Interface Generation

::: tip Schema to TypeScript
Use schemas for TypeScript interface generation:

```
You: Show me the Pet schema and convert to TypeScript

Claude:
interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
```
:::

### Efficient Exploration

::: tip Use Tags for Navigation
Most APIs organize endpoints by tags. Use tag filtering:

```
"Show me all 'user' endpoints"
"List endpoints tagged with 'authentication'"
```

This is more efficient than listing all endpoints.
:::
