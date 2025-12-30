/**
 * MCP Tools for Swagger/OpenAPI parsing and testing
 *
 * Provides tools for service selection, endpoint discovery,
 * schema inspection, API testing, and cURL generation.
 *
 * @author zerry
 * @module tools/swagger-tools
 */

import { z } from "zod";
import {
    swaggerParser,
    getCurrentSource,
    setCurrentSource,
    resolveServiceUrl,
    listServices,
    reloadConfig,
    executeRequest,
    generateCurl,
    extractBaseUrl,
    type HttpMethodType,
} from "../services/index.js";
import type { HttpMethod, OpenAPIDocument } from "../types/index.js";
import { isOpenAPIV3, isSwaggerV2 } from "../types/index.js";

/**
 * Tool definitions for MCP registration
 *
 * @author zerry
 */
export const swaggerTools = {
    /**
     * Tool: swagger_select_service
     * Selects a service from config or sets direct URL
     */
    swagger_select_service: {
        name: "swagger_select_service",
        description:
            "Select a Swagger/OpenAPI service to work with. " +
            "Can use an alias from swagger-targets.json or a direct URL. " +
            "Must be called before using other tools.",
        inputSchema: {
            type: "object" as const,
            properties: {
                name: {
                    type: "string",
                    description:
                        "Service alias (from swagger-targets.json) or direct URL/file path",
                },
            },
            required: ["name"],
        },
    },

    /**
     * Tool: swagger_list_services
     * Lists all configured services
     */
    swagger_list_services: {
        name: "swagger_list_services",
        description:
            "Lists all available services from swagger-targets.json configuration. " +
            "Shows alias names and their URLs.",
        inputSchema: {
            type: "object" as const,
            properties: {
                reload: {
                    type: "boolean",
                    description: "Reload configuration from file. Default: false",
                },
            },
            required: [],
        },
    },

    /**
     * Tool: swagger_get_current
     * Shows current service info
     */
    swagger_get_current: {
        name: "swagger_get_current",
        description:
            "Shows information about the currently selected service including " +
            "title, version, endpoint count, and available tags.",
        inputSchema: {
            type: "object" as const,
            properties: {},
            required: [],
        },
    },

    /**
     * Tool: swagger_list_endpoints
     * Lists all endpoints in current service
     */
    swagger_list_endpoints: {
        name: "swagger_list_endpoints",
        description:
            "Lists all API endpoints from the currently selected service. " +
            "Returns method, path, summary, and tags for each endpoint. " +
            "Optionally filter by tag.",
        inputSchema: {
            type: "object" as const,
            properties: {
                tag: {
                    type: "string",
                    description: "Optional tag to filter endpoints by",
                },
            },
            required: [],
        },
    },

    /**
     * Tool: swagger_get_endpoint
     * Gets detailed information about a specific endpoint
     */
    swagger_get_endpoint: {
        name: "swagger_get_endpoint",
        description:
            "Gets detailed information about a specific API endpoint including " +
            "parameters, request body schema, and response definitions.",
        inputSchema: {
            type: "object" as const,
            properties: {
                method: {
                    type: "string",
                    enum: ["get", "post", "put", "delete", "patch", "options", "head"],
                    description: "HTTP method",
                },
                path: {
                    type: "string",
                    description: "Endpoint path (e.g., /users/{id})",
                },
            },
            required: ["method", "path"],
        },
    },

    /**
     * Tool: swagger_search
     * Searches endpoints by keyword
     */
    swagger_search: {
        name: "swagger_search",
        description:
            "Searches API endpoints by keyword. Searches in path, summary, " +
            "description, operationId, and tags.",
        inputSchema: {
            type: "object" as const,
            properties: {
                keyword: {
                    type: "string",
                    description: "Search keyword (case-insensitive)",
                },
            },
            required: ["keyword"],
        },
    },

    /**
     * Tool: swagger_get_schema
     * Gets a specific schema/model definition
     */
    swagger_get_schema: {
        name: "swagger_get_schema",
        description:
            "Gets the structure of a specific schema/model (DTO) from " +
            "components/schemas or definitions. Useful for generating " +
            "TypeScript interfaces or understanding response structures.",
        inputSchema: {
            type: "object" as const,
            properties: {
                schemaName: {
                    type: "string",
                    description: "Name of the schema (e.g., UserDto, ErrorResponse)",
                },
            },
            required: ["schemaName"],
        },
    },

    /**
     * Tool: swagger_list_schemas
     * Lists all available schemas
     */
    swagger_list_schemas: {
        name: "swagger_list_schemas",
        description:
            "Lists all available schemas/models (DTOs) defined in the specification.",
        inputSchema: {
            type: "object" as const,
            properties: {},
            required: [],
        },
    },

    /**
     * Tool: swagger_test
     * Executes an actual HTTP request
     */
    swagger_test: {
        name: "swagger_test",
        description:
            "Executes an actual HTTP request to the API endpoint and returns " +
            "the response. Includes status code, response body, and cURL command.",
        inputSchema: {
            type: "object" as const,
            properties: {
                method: {
                    type: "string",
                    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
                    description: "HTTP method",
                },
                path: {
                    type: "string",
                    description: "Endpoint path (e.g., /users/{id})",
                },
                pathParams: {
                    type: "object",
                    description: "Path parameters as key-value pairs (e.g., {\"id\": \"123\"})",
                },
                queryParams: {
                    type: "object",
                    description: "Query parameters as key-value pairs",
                },
                body: {
                    type: "object",
                    description: "Request body (for POST, PUT, PATCH)",
                },
                headers: {
                    type: "object",
                    description: "Additional headers (e.g., {\"Authorization\": \"Bearer token\"})",
                },
                baseUrl: {
                    type: "string",
                    description: "Override base URL (e.g., http://host.docker.internal:8080). If not provided, uses URL from swagger spec.",
                },
            },
            required: ["method", "path"],
        },
    },

    /**
     * Tool: swagger_curl
     * Generates a cURL command
     */
    swagger_curl: {
        name: "swagger_curl",
        description:
            "Generates a ready-to-use cURL command for an endpoint. " +
            "Includes proper headers, body formatting, and URL encoding.",
        inputSchema: {
            type: "object" as const,
            properties: {
                method: {
                    type: "string",
                    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
                    description: "HTTP method",
                },
                path: {
                    type: "string",
                    description: "Endpoint path (e.g., /users/{id})",
                },
                pathParams: {
                    type: "object",
                    description: "Path parameters as key-value pairs",
                },
                queryParams: {
                    type: "object",
                    description: "Query parameters as key-value pairs",
                },
                body: {
                    type: "object",
                    description: "Request body (for POST, PUT, PATCH)",
                },
                headers: {
                    type: "object",
                    description: "Additional headers",
                },
                baseUrl: {
                    type: "string",
                    description: "Override base URL (e.g., http://host.docker.internal:8080). If not provided, uses URL from swagger spec.",
                },
            },
            required: ["method", "path"],
        },
    },
} as const;

// ============================================================================
// Zod Schemas for Input Validation
// ============================================================================

const schemas = {
    swagger_select_service: z.object({
        name: z.string().min(1, "Service name or URL is required"),
    }),

    swagger_list_services: z.object({
        reload: z.boolean().optional().default(false),
    }),

    swagger_get_current: z.object({}),

    swagger_list_endpoints: z.object({
        tag: z.string().optional(),
    }),

    swagger_get_endpoint: z.object({
        method: z.enum(["get", "post", "put", "delete", "patch", "options", "head"]),
        path: z.string().min(1, "Path is required"),
    }),

    swagger_search: z.object({
        keyword: z.string().min(1, "Keyword is required"),
    }),

    swagger_get_schema: z.object({
        schemaName: z.string().min(1, "Schema name is required"),
    }),

    swagger_list_schemas: z.object({}),

    swagger_test: z.object({
        method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]),
        path: z.string().min(1, "Path is required"),
        pathParams: z.record(z.string()).optional(),
        queryParams: z.record(z.string()).optional(),
        body: z.unknown().optional(),
        headers: z.record(z.string()).optional(),
        baseUrl: z.string().optional(),
    }),

    swagger_curl: z.object({
        method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]),
        path: z.string().min(1, "Path is required"),
        pathParams: z.record(z.string()).optional(),
        queryParams: z.record(z.string()).optional(),
        body: z.unknown().optional(),
        headers: z.record(z.string()).optional(),
        baseUrl: z.string().optional(),
    }),
};

// ============================================================================
// Tool Result Types
// ============================================================================

type ToolResult = {
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
};

function errorResult(message: string): ToolResult {
    return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
    };
}

function successResult(data: unknown): ToolResult {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}

function requireSource(): string | null {
    const source = getCurrentSource();
    if (!source) {
        return null;
    }
    return source;
}

// ============================================================================
// Tool Handlers
// ============================================================================

/**
 * Handles swagger_select_service tool
 *
 * @author zerry
 */
async function handleSelectService(args: unknown): Promise<ToolResult> {
    const parseResult = schemas.swagger_select_service.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    const { name } = parseResult.data;
    const { resolved, isAlias, aliasName } = resolveServiceUrl(name);

    try {
        // Validate the source by parsing it
        const doc = await swaggerParser.parse(resolved, false);
        const summary = swaggerParser.getSummary(doc);

        // Set as current source
        setCurrentSource(resolved);

        return successResult({
            message: isAlias
                ? `Connected to "${aliasName}" service`
                : "Connected to direct URL",
            source: resolved,
            isAlias,
            aliasName: aliasName ?? null,
            api: {
                title: summary.title,
                version: summary.version,
                description: summary.description,
                endpointCount: summary.endpointCount,
                tags: summary.tags,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to connect: ${message}`);
    }
}

/**
 * Handles swagger_list_services tool
 *
 * @author zerry
 */
async function handleListServices(args: unknown): Promise<ToolResult> {
    const parseResult = schemas.swagger_list_services.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    if (parseResult.data.reload) {
        reloadConfig();
    }

    const services = listServices();
    const currentSource = getCurrentSource();

    return successResult({
        currentSource,
        services:
            services.length > 0
                ? services
                : "No services configured. Create swagger-targets.json in project root.",
    });
}

/**
 * Handles swagger_get_current tool
 *
 * @author zerry
 */
async function handleGetCurrent(_args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    try {
        const doc = await swaggerParser.parse(source);
        const summary = swaggerParser.getSummary(doc);

        return successResult({
            source,
            ...summary,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to get current service info: ${message}`);
    }
}

/**
 * Handles swagger_list_endpoints tool
 *
 * @author zerry
 */
async function handleListEndpoints(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_list_endpoints.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const endpoints = swaggerParser.listEndpoints(doc, parseResult.data.tag);

        return successResult({
            total: endpoints.length,
            tag: parseResult.data.tag ?? null,
            endpoints,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to list endpoints: ${message}`);
    }
}

/**
 * Handles swagger_get_endpoint tool
 *
 * @author zerry
 */
async function handleGetEndpoint(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_get_endpoint.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const detail = swaggerParser.getEndpointDetail(
            doc,
            parseResult.data.method as HttpMethod,
            parseResult.data.path
        );

        if (!detail) {
            return errorResult(
                `Endpoint not found: ${parseResult.data.method.toUpperCase()} ${parseResult.data.path}`
            );
        }

        return successResult(detail);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to get endpoint: ${message}`);
    }
}

/**
 * Handles swagger_search tool
 *
 * @author zerry
 */
async function handleSearch(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_search.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const endpoints = swaggerParser.searchEndpoints(doc, parseResult.data.keyword);

        return successResult({
            keyword: parseResult.data.keyword,
            total: endpoints.length,
            endpoints,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to search: ${message}`);
    }
}

/**
 * Gets schemas from OpenAPI document
 *
 * @author zerry
 */
function getSchemas(doc: OpenAPIDocument): Record<string, unknown> | null {
    if (isOpenAPIV3(doc)) {
        return (doc.components?.schemas as Record<string, unknown>) ?? null;
    }
    if (isSwaggerV2(doc)) {
        return (doc.definitions as Record<string, unknown>) ?? null;
    }
    return null;
}

/**
 * Handles swagger_get_schema tool
 *
 * @author zerry
 */
async function handleGetSchema(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_get_schema.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const allSchemas = getSchemas(doc);

        if (!allSchemas) {
            return errorResult("No schemas found in specification");
        }

        const schema = allSchemas[parseResult.data.schemaName];
        if (!schema) {
            const available = Object.keys(allSchemas).slice(0, 10).join(", ");
            return errorResult(
                `Schema "${parseResult.data.schemaName}" not found. Available: ${available}...`
            );
        }

        return successResult({
            name: parseResult.data.schemaName,
            schema,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to get schema: ${message}`);
    }
}

/**
 * Handles swagger_list_schemas tool
 *
 * @author zerry
 */
async function handleListSchemas(_args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    try {
        const doc = await swaggerParser.parse(source);
        const allSchemas = getSchemas(doc);

        if (!allSchemas) {
            return successResult({
                message: "No schemas found in specification",
                schemas: [],
            });
        }

        const schemaNames = Object.keys(allSchemas);

        return successResult({
            total: schemaNames.length,
            schemas: schemaNames,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to list schemas: ${message}`);
    }
}

/**
 * Gets servers/base URL from spec
 *
 * @author zerry
 */
function getServers(doc: OpenAPIDocument): string[] {
    if (isOpenAPIV3(doc)) {
        return doc.servers?.map((s) => s.url) ?? [];
    }
    if (isSwaggerV2(doc)) {
        const scheme = doc.schemes?.[0] ?? "http";
        const host = doc.host ?? "localhost";
        const basePath = doc.basePath ?? "";
        return [`${scheme}://${host}${basePath}`];
    }
    return [];
}

/**
 * Handles swagger_test tool
 *
 * @author zerry
 */
async function handleTest(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_test.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const servers = getServers(doc);
        // Use provided baseUrl or extract from spec
        const baseUrl = parseResult.data.baseUrl || extractBaseUrl(servers, source);

        const response = await executeRequest({
            baseUrl,
            method: parseResult.data.method as HttpMethodType,
            path: parseResult.data.path,
            pathParams: parseResult.data.pathParams,
            queryParams: parseResult.data.queryParams,
            headers: parseResult.data.headers,
            body: parseResult.data.body,
        });

        return successResult({
            request: {
                method: parseResult.data.method,
                path: parseResult.data.path,
                baseUrl,
            },
            response: {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: response.body,
                duration: `${response.duration}ms`,
            },
            curl: response.curl,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Request failed: ${message}`);
    }
}

/**
 * Handles swagger_curl tool
 *
 * @author zerry
 */
async function handleCurl(args: unknown): Promise<ToolResult> {
    const source = requireSource();
    if (!source) {
        return errorResult(
            "No service selected. Use swagger_select_service first."
        );
    }

    const parseResult = schemas.swagger_curl.safeParse(args);
    if (!parseResult.success) {
        return errorResult(parseResult.error.message);
    }

    try {
        const doc = await swaggerParser.parse(source);
        const servers = getServers(doc);
        // Use provided baseUrl or extract from spec
        const baseUrl = parseResult.data.baseUrl || extractBaseUrl(servers, source);

        const curl = generateCurl({
            baseUrl,
            method: parseResult.data.method as HttpMethodType,
            path: parseResult.data.path,
            pathParams: parseResult.data.pathParams,
            queryParams: parseResult.data.queryParams,
            headers: parseResult.data.headers,
            body: parseResult.data.body,
        });

        return successResult({
            curl,
            note: "Copy and paste this command into your terminal",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return errorResult(`Failed to generate cURL: ${message}`);
    }
}

// ============================================================================
// Tool Handler Export
// ============================================================================

/**
 * Tool handler mapping
 *
 * @author zerry
 */
export const toolHandlers: Record<
    string,
    (args: unknown) => Promise<ToolResult>
> = {
    swagger_select_service: handleSelectService,
    swagger_list_services: handleListServices,
    swagger_get_current: handleGetCurrent,
    swagger_list_endpoints: handleListEndpoints,
    swagger_get_endpoint: handleGetEndpoint,
    swagger_search: handleSearch,
    swagger_get_schema: handleGetSchema,
    swagger_list_schemas: handleListSchemas,
    swagger_test: handleTest,
    swagger_curl: handleCurl,
};
