# Schema Inspection

Tools for inspecting data schemas and DTOs.

## swagger_get_schema

Gets detailed structure of a schema/DTO.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `schemaName` | string | Yes | Name of the schema to retrieve |

**Example prompts:**
- "Show me the Pet schema"
- "What's the structure of Order?"
- "Get the User DTO"

**Response includes:**
- Full schema definition
- Property types and constraints
- Required fields
- Nested references

**Usage Example:**
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

::: tip TypeScript Interface Generation
Use schema information to generate TypeScript interfaces:

```
You: Convert the Pet schema to TypeScript interface

Claude: [Fetches schema via swagger_get_schema and converts]

interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
```
:::

---

## swagger_list_schemas

Lists all available schemas in the current service.

**Parameters:** None

**Example prompts:**
- "What schemas are available?"
- "List all DTOs"
- "Show me the data models"

**Usage Example:**
```
You: List all schemas

Claude: [swagger_list_schemas]

📋 Available Schemas (6):
- Pet
- Category
- Tag
- Order
- User
- ApiResponse
```
