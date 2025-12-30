# Code Generation

Tools for generating code from API specifications.

## swagger_generate_code

Generates TypeScript or JavaScript code with axios or fetch for calling API endpoints.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `method` | string | Yes | HTTP method (get, post, put, delete, patch) |
| `path` | string | Yes | Endpoint path (e.g., /users/{id}) |
| `language` | string | No | Output language: `typescript` (default) or `javascript` |
| `httpClient` | string | No | HTTP client: `axios` (default) or `fetch` |

**Example prompts:**
- "Generate TypeScript code for POST /pet"
- "Create axios function for GET /users/{id}"
- "Generate fetch code for the login endpoint"

**Response includes:**
- Import statements
- TypeScript interfaces (for path params, query params, request body, response)
- Async function with proper typing
- JSDoc comments with endpoint description

**Usage Example:**
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

### With Path Parameters

```
You: Generate code for GET /pet/{petId}

Claude: [swagger_generate_code method="get" path="/pet/{petId}"]

📝 Generated TypeScript Code:

import axios, { AxiosResponse } from 'axios';

interface GetPetByidPathParams {
  petId: number;
}

/**
 * Find pet by ID
 */
export async function getPetByid(pathParams: GetPetByidPathParams): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet/${pathParams.petId}`;
  return axios.get(url);
}
```

---

### With Query Parameters

```
You: Generate code for GET /pet/findByStatus

Claude: [swagger_generate_code method="get" path="/pet/findByStatus"]

📝 Generated TypeScript Code:

import axios, { AxiosResponse } from 'axios';

interface GetPetFindbystatusQueryParams {
  status?: string;
}

/**
 * Finds Pets by status
 */
export async function getPetFindbystatus(queryParams: GetPetFindbystatusQueryParams): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet/findByStatus`;
  return axios.get(url, { params: queryParams });
}
```

---

### Using Fetch Instead of Axios

```
You: Generate fetch code for POST /pet

Claude: [swagger_generate_code method="post" path="/pet" httpClient="fetch"]

📝 Generated TypeScript Code:

interface PostPetRequest {
  name: string;
  photoUrls: string[];
  status?: string;
}

/**
 * Add a new pet to the store
 */
export async function postPet(data: PostPetRequest): Promise<Response> {
  return fetch(`${BASE_URL}/pet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
```

---

### JavaScript Output

```
You: Generate JavaScript code for GET /pet/{petId}

Claude: [swagger_generate_code method="get" path="/pet/{petId}" language="javascript"]

📝 Generated JavaScript Code:

import axios from 'axios';

/**
 * Find pet by ID
 */
export async function getPetByid(pathParams) {
  const url = `${BASE_URL}/pet/${pathParams.petId}`;
  return axios.get(url);
}
```

::: tip
The generated code provides a starting point. You may need to:
- Define the `BASE_URL` constant
- Add error handling
- Customize headers (e.g., authentication)
- Adjust type definitions based on your project setup
:::

::: info Supported Features
- **Path parameters**: Automatically included in URL template
- **Query parameters**: Passed as axios config or URLSearchParams
- **Request body**: For POST, PUT, PATCH methods
- **TypeScript interfaces**: Generated from OpenAPI schema
:::
