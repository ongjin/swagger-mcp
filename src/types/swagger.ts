/**
 * Type definitions for Swagger/OpenAPI parsing
 *
 * @author zerry
 * @module types/swagger
 */

import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

/**
 * Supported HTTP methods for API endpoints
 *
 * @author zerry
 */
export type HttpMethod =
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "options"
    | "head";

/**
 * Represents a single API endpoint with its metadata
 *
 * @author zerry
 */
export interface ApiEndpoint {
    /** HTTP method (GET, POST, etc.) */
    method: HttpMethod;
    /** URL path of the endpoint */
    path: string;
    /** Operation ID if defined */
    operationId?: string | undefined;
    /** Short summary of the endpoint */
    summary?: string | undefined;
    /** Detailed description */
    description?: string | undefined;
    /** Tags for categorization */
    tags?: string[] | undefined;
    /** Whether the endpoint is deprecated */
    deprecated?: boolean | undefined;
}

/**
 * Detailed information about an API endpoint including parameters and responses
 *
 * @author zerry
 */
export interface ApiEndpointDetail extends ApiEndpoint {
    /** Request parameters (path, query, header, cookie) */
    parameters?: ApiParameter[] | undefined;
    /** Request body schema */
    requestBody?: ApiRequestBody | undefined;
    /** Response definitions */
    responses?: Record<string, ApiResponse> | undefined;
    /** Security requirements */
    security?: Array<Record<string, string[]>> | undefined;
}

/**
 * Represents a request parameter
 *
 * @author zerry
 */
export interface ApiParameter {
    /** Parameter name */
    name: string;
    /** Location: path, query, header, or cookie */
    in: "path" | "query" | "header" | "cookie";
    /** Whether the parameter is required */
    required?: boolean | undefined;
    /** Parameter description */
    description?: string | undefined;
    /** Schema type */
    type?: string | undefined;
    /** Schema format */
    format?: string | undefined;
    /** Default value */
    default?: unknown;
    /** Example value */
    example?: unknown;
    /** Enum values if applicable */
    enum?: unknown[] | undefined;
}

/**
 * Represents a request body definition
 *
 * @author zerry
 */
export interface ApiRequestBody {
    /** Description of the request body */
    description?: string | undefined;
    /** Whether the request body is required */
    required?: boolean | undefined;
    /** Content type to schema mapping */
    content?: Record<string, ApiMediaType> | undefined;
}

/**
 * Represents a media type schema
 *
 * @author zerry
 */
export interface ApiMediaType {
    /** JSON Schema for the content */
    schema?: Record<string, unknown> | undefined;
    /** Example value */
    example?: unknown;
    /** Multiple examples */
    examples?: Record<string, unknown> | undefined;
}

/**
 * Represents an API response definition
 *
 * @author zerry
 */
export interface ApiResponse {
    /** Response description */
    description?: string | undefined;
    /** Content type to schema mapping */
    content?: Record<string, ApiMediaType> | undefined;
    /** Response headers */
    headers?: Record<string, unknown> | undefined;
}

/**
 * Parsed Swagger/OpenAPI specification summary
 *
 * @author zerry
 */
export interface ApiSpecSummary {
    /** API title */
    title: string;
    /** API version */
    version: string;
    /** API description */
    description?: string | undefined;
    /** Base URL(s) for the API */
    servers?: string[] | undefined;
    /** OpenAPI/Swagger specification version */
    specVersion: string;
    /** Total number of endpoints */
    endpointCount: number;
    /** Available tags */
    tags?: string[] | undefined;
}

/**
 * Union type for all OpenAPI document versions
 *
 * @author zerry
 */
export type OpenAPIDocument = OpenAPI.Document;

/**
 * Type guard for OpenAPI 3.x documents
 *
 * @author zerry
 */
export function isOpenAPIV3(
    doc: OpenAPIDocument
): doc is OpenAPIV3.Document | OpenAPIV3_1.Document {
    return "openapi" in doc;
}

/**
 * Type guard for Swagger 2.0 documents
 *
 * @author zerry
 */
export function isSwaggerV2(doc: OpenAPIDocument): doc is OpenAPIV2.Document {
    return "swagger" in doc;
}
