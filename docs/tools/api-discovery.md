# API Discovery

Tools for exploring and searching API endpoints.

## swagger_list_endpoints

Lists all API endpoints from the current service.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tag` | string | No | Filter endpoints by tag |

**Example prompts:**
- "List all endpoints"
- "Show me only the 'pet' tagged endpoints"
- "What endpoints are available?"

**Response includes:**
- HTTP method (GET, POST, PUT, DELETE, etc.)
- Path
- Summary
- Tags
- Deprecated status

**Usage Example:**
```
You: Show me pet-related endpoints

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

---

## swagger_get_endpoint

Gets detailed information about a specific endpoint.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `method` | string | Yes | HTTP method (get, post, put, delete, patch, options, head) |
| `path` | string | Yes | Endpoint path (e.g., `/users/{id}`) |

**Example prompts:**
- "Show me details for GET /pet/{petId}"
- "What parameters does POST /pet require?"
- "Explain the DELETE /pet/{petId} endpoint"

**Response includes:**
- Full endpoint metadata
- Path, query, header parameters
- Request body schema
- Response schemas for all status codes
- Security requirements

**Usage Example:**
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

---

## swagger_search

Searches endpoints by keyword.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `keyword` | string | Yes | Search keyword (case-insensitive) |

**Example prompts:**
- "Search for 'user' in the API"
- "Find all authentication endpoints"
- "Which endpoints mention 'order'?"

**Searches in:**
- Path
- Summary
- Description
- Operation ID
- Tags

**Usage Example:**
```
You: Search for 'status' in the API

Claude: [swagger_search keyword="status"]

🔍 Found 3 endpoints matching "status":
| Method | Path | Summary |
|--------|------|---------|
| GET | /pet/findByStatus | Finds Pets by status |
| GET | /store/order/{orderId} | Find order by ID |
| POST | /pet/{petId} | Updates pet status |
```
