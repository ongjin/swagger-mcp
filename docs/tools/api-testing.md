# API Testing

Tools for testing APIs and generating cURL commands.

## swagger_test

Executes an actual HTTP request against the API.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `method` | string | Yes | HTTP method |
| `path` | string | Yes | Endpoint path |
| `pathParams` | object | No | Path parameter values |
| `queryParams` | object | No | Query parameter values |
| `headers` | object | No | Request headers |
| `body` | object | No | Request body (JSON) |

**Example prompts:**
- "Call GET /pet/1"
- "Test POST /pet with name 'doggie'"
- "Execute the createUser endpoint"

**Response includes:**
- HTTP status code
- Response headers
- Response body
- Request duration
- Generated cURL command

**Usage Example:**
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

::: warning
This tool makes real HTTP requests. Be careful when testing endpoints that modify data.
:::

### Advanced Usage

**With Query Parameters:**
```
You: Find pets with status 'available'

Claude: [swagger_test method="GET" path="/pet/findByStatus" queryParams={"status":"available"}]
```

**With Request Body:**
```
You: Create a new pet named 'Max'

Claude: [swagger_test method="POST" path="/pet" body={"name":"Max","photoUrls":["http://example.com/max.jpg"],"status":"available"}]
```

**With Custom Headers:**
```
You: Call the API with bearer token

Claude: [swagger_test method="GET" path="/pet/1" headers={"Authorization":"Bearer xxx"}]
```

---

## swagger_curl

Generates a cURL command for an endpoint.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `method` | string | Yes | HTTP method |
| `path` | string | Yes | Endpoint path |
| `pathParams` | object | No | Path parameter values |
| `queryParams` | object | No | Query parameter values |
| `headers` | object | No | Request headers |
| `body` | object | No | Request body (JSON) |

**Example prompts:**
- "Generate curl for GET /pet/1"
- "Create a curl command for creating a pet"
- "Give me the curl for POST /pet"

**Usage Example:**
```
You: Generate curl command for creating a pet

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

::: tip
The generated cURL command can be copied directly to your terminal for manual testing or integration into scripts.
:::
