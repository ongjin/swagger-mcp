/**
 * Swagger/OpenAPI Parser Service
 *
 * Provides functionality to fetch, parse, and extract information
 * from Swagger 2.0 and OpenAPI 3.x specifications.
 *
 * @author zerry
 * @module services/swagger-parser
 */

import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import type {
    ApiEndpoint,
    ApiEndpointDetail,
    ApiParameter,
    ApiRequestBody,
    ApiResponse,
    ApiSpecSummary,
    HttpMethod,
    OpenAPIDocument,
} from "../types/index.js";
import { isOpenAPIV3, isSwaggerV2 } from "../types/index.js";

/**
 * HTTP methods to scan in OpenAPI paths
 */
const HTTP_METHODS: HttpMethod[] = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
    "head",
];

/**
 * Service for parsing and extracting data from Swagger/OpenAPI specifications
 *
 * @author zerry
 */
export class SwaggerParserService {
    private cache: Map<string, OpenAPIDocument> = new Map();

    /**
     * Fetches and parses a Swagger/OpenAPI specification from a URL
     *
     * @author zerry
     * @param url - URL to fetch the specification from
     * @param useCache - Whether to use cached result if available
     * @returns Parsed OpenAPI document
     */
    async parse(url: string, useCache = true): Promise<OpenAPIDocument> {
        if (useCache && this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (cached) {
                return cached;
            }
        }

        const api = await SwaggerParser.dereference(url);
        this.cache.set(url, api as OpenAPIDocument);
        return api as OpenAPIDocument;
    }

    /**
     * Clears the cache for a specific URL or all cached specs
     *
     * @author zerry
     * @param url - Optional URL to clear; if not provided, clears all cache
     */
    clearCache(url?: string): void {
        if (url) {
            this.cache.delete(url);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Extracts a summary of the API specification
     *
     * @author zerry
     * @param doc - Parsed OpenAPI document
     * @returns API specification summary
     */
    getSummary(doc: OpenAPIDocument): ApiSpecSummary {
        const endpoints = this.listEndpoints(doc);

        if (isOpenAPIV3(doc)) {
            return this.getOpenAPIV3Summary(doc, endpoints.length);
        }

        if (isSwaggerV2(doc)) {
            return this.getSwaggerV2Summary(doc, endpoints.length);
        }

        throw new Error("Unknown OpenAPI specification format");
    }

    /**
     * Extracts summary from OpenAPI 3.x document
     */
    private getOpenAPIV3Summary(
        doc: OpenAPIV3.Document | OpenAPIV3_1.Document,
        endpointCount: number
    ): ApiSpecSummary {
        const tags = doc.tags?.map((t) => t.name) ?? [];
        const servers = doc.servers?.map((s) => s.url) ?? [];

        return {
            title: doc.info.title,
            version: doc.info.version,
            description: doc.info.description,
            specVersion: `OpenAPI ${doc.openapi}`,
            servers,
            endpointCount,
            tags: tags.length > 0 ? tags : undefined,
        };
    }

    /**
     * Extracts summary from Swagger 2.0 document
     */
    private getSwaggerV2Summary(
        doc: OpenAPIV2.Document,
        endpointCount: number
    ): ApiSpecSummary {
        const tags = doc.tags?.map((t) => t.name) ?? [];
        const baseUrl = `${doc.schemes?.[0] ?? "http"}://${doc.host ?? "localhost"}${doc.basePath ?? ""}`;

        return {
            title: doc.info.title,
            version: doc.info.version,
            description: doc.info.description,
            specVersion: `Swagger ${doc.swagger}`,
            servers: [baseUrl],
            endpointCount,
            tags: tags.length > 0 ? tags : undefined,
        };
    }

    /**
     * Lists all endpoints in the API specification
     *
     * @author zerry
     * @param doc - Parsed OpenAPI document
     * @param tag - Optional tag to filter endpoints
     * @returns Array of API endpoints
     */
    listEndpoints(doc: OpenAPIDocument, tag?: string): ApiEndpoint[] {
        const endpoints: ApiEndpoint[] = [];
        const paths = doc.paths ?? {};

        for (const [path, pathItem] of Object.entries(paths)) {
            if (!pathItem) continue;

            for (const method of HTTP_METHODS) {
                const operation = (pathItem as Record<string, unknown>)[
                    method
                ] as OpenAPIV3.OperationObject | OpenAPIV2.OperationObject | undefined;

                if (!operation) continue;

                // Filter by tag if specified
                if (tag && !operation.tags?.includes(tag)) {
                    continue;
                }

                endpoints.push({
                    method,
                    path,
                    operationId: operation.operationId,
                    summary: operation.summary,
                    description: operation.description,
                    tags: operation.tags,
                    deprecated: operation.deprecated,
                });
            }
        }

        return endpoints;
    }

    /**
     * Gets detailed information about a specific endpoint
     *
     * @author zerry
     * @param doc - Parsed OpenAPI document
     * @param method - HTTP method
     * @param path - Endpoint path
     * @returns Detailed endpoint information or null if not found
     */
    getEndpointDetail(
        doc: OpenAPIDocument,
        method: HttpMethod,
        path: string
    ): ApiEndpointDetail | null {
        const pathItem = doc.paths?.[path];
        if (!pathItem) return null;

        const operation = (pathItem as Record<string, unknown>)[method] as
            | OpenAPIV3.OperationObject
            | OpenAPIV2.OperationObject
            | undefined;

        if (!operation) return null;

        const baseEndpoint: ApiEndpoint = {
            method,
            path,
            operationId: operation.operationId,
            summary: operation.summary,
            description: operation.description,
            tags: operation.tags,
            deprecated: operation.deprecated,
        };

        if (isOpenAPIV3(doc)) {
            return this.getOpenAPIV3EndpointDetail(
                baseEndpoint,
                operation as OpenAPIV3.OperationObject,
                pathItem as OpenAPIV3.PathItemObject
            );
        }

        if (isSwaggerV2(doc)) {
            return this.getSwaggerV2EndpointDetail(
                baseEndpoint,
                operation as OpenAPIV2.OperationObject,
                pathItem as OpenAPIV2.PathItemObject
            );
        }

        return baseEndpoint;
    }

    /**
     * Extracts detailed endpoint info from OpenAPI 3.x
     */
    private getOpenAPIV3EndpointDetail(
        base: ApiEndpoint,
        operation: OpenAPIV3.OperationObject,
        pathItem: OpenAPIV3.PathItemObject
    ): ApiEndpointDetail {
        // Combine path-level and operation-level parameters
        const allParams = [
            ...(pathItem.parameters ?? []),
            ...(operation.parameters ?? []),
        ] as OpenAPIV3.ParameterObject[];

        const parameters = this.extractOpenAPIV3Parameters(allParams);
        const requestBody = this.extractOpenAPIV3RequestBody(
            operation.requestBody as OpenAPIV3.RequestBodyObject | undefined
        );
        const responses = this.extractOpenAPIV3Responses(operation.responses);

        return {
            ...base,
            parameters: parameters.length > 0 ? parameters : undefined,
            requestBody,
            responses,
            security: operation.security as
                | Array<Record<string, string[]>>
                | undefined,
        };
    }

    /**
     * Extracts parameters from OpenAPI 3.x
     */
    private extractOpenAPIV3Parameters(
        params: OpenAPIV3.ParameterObject[]
    ): ApiParameter[] {
        return params.map((p) => {
            const schema = p.schema as OpenAPIV3.SchemaObject | undefined;
            return {
                name: p.name,
                in: p.in as ApiParameter["in"],
                required: p.required,
                description: p.description,
                type: schema?.type as string | undefined,
                format: schema?.format,
                default: schema?.default,
                example: p.example ?? schema?.example,
                enum: schema?.enum,
            };
        });
    }

    /**
     * Extracts request body from OpenAPI 3.x
     */
    private extractOpenAPIV3RequestBody(
        requestBody: OpenAPIV3.RequestBodyObject | undefined
    ): ApiRequestBody | undefined {
        if (!requestBody) return undefined;

        const content: Record<string, { schema?: Record<string, unknown>; example?: unknown }> = {};

        if (requestBody.content) {
            for (const [mediaType, mediaTypeObj] of Object.entries(
                requestBody.content
            )) {
                content[mediaType] = {
                    schema: mediaTypeObj.schema as Record<string, unknown>,
                    example: mediaTypeObj.example,
                };
            }
        }

        return {
            description: requestBody.description,
            required: requestBody.required,
            content: Object.keys(content).length > 0 ? content : undefined,
        };
    }

    /**
     * Extracts responses from OpenAPI 3.x
     */
    private extractOpenAPIV3Responses(
        responses: OpenAPIV3.ResponsesObject | undefined
    ): Record<string, ApiResponse> | undefined {
        if (!responses) return undefined;

        const result: Record<string, ApiResponse> = {};

        for (const [statusCode, response] of Object.entries(responses)) {
            const resp = response as OpenAPIV3.ResponseObject;
            const content: Record<string, { schema?: Record<string, unknown>; example?: unknown }> = {};

            if (resp.content) {
                for (const [mediaType, mediaTypeObj] of Object.entries(
                    resp.content
                )) {
                    content[mediaType] = {
                        schema: mediaTypeObj.schema as Record<string, unknown>,
                        example: mediaTypeObj.example,
                    };
                }
            }

            result[statusCode] = {
                description: resp.description,
                content: Object.keys(content).length > 0 ? content : undefined,
            };
        }

        return Object.keys(result).length > 0 ? result : undefined;
    }

    /**
     * Extracts detailed endpoint info from Swagger 2.0
     */
    private getSwaggerV2EndpointDetail(
        base: ApiEndpoint,
        operation: OpenAPIV2.OperationObject,
        pathItem: OpenAPIV2.PathItemObject
    ): ApiEndpointDetail {
        // Combine path-level and operation-level parameters
        const allParams = [
            ...(pathItem.parameters ?? []),
            ...(operation.parameters ?? []),
        ] as OpenAPIV2.Parameter[];

        const { parameters, requestBody } =
            this.extractSwaggerV2Parameters(allParams);
        const responses = this.extractSwaggerV2Responses(operation.responses);

        return {
            ...base,
            parameters: parameters.length > 0 ? parameters : undefined,
            requestBody,
            responses,
            security: operation.security as
                | Array<Record<string, string[]>>
                | undefined,
        };
    }

    /**
     * Extracts parameters from Swagger 2.0 (separates body params)
     */
    private extractSwaggerV2Parameters(params: OpenAPIV2.Parameter[]): {
        parameters: ApiParameter[];
        requestBody?: ApiRequestBody | undefined;
    } {
        const parameters: ApiParameter[] = [];
        let requestBody: ApiRequestBody | undefined;

        for (const p of params) {
            if (p.in === "body") {
                // Body parameter becomes requestBody
                const bodyParam = p as OpenAPIV2.InBodyParameterObject;
                requestBody = {
                    description: bodyParam.description,
                    required: bodyParam.required,
                    content: {
                        "application/json": {
                            schema: bodyParam.schema as Record<string, unknown>,
                        },
                    },
                };
            } else {
                const generalParam = p as OpenAPIV2.GeneralParameterObject;
                parameters.push({
                    name: generalParam.name,
                    in: generalParam.in as ApiParameter["in"],
                    required: generalParam.required,
                    description: generalParam.description,
                    type: generalParam.type,
                    format: generalParam.format,
                    default: generalParam.default,
                    enum: generalParam.enum,
                });
            }
        }

        return { parameters, requestBody };
    }

    /**
     * Extracts responses from Swagger 2.0
     */
    private extractSwaggerV2Responses(
        responses: OpenAPIV2.ResponsesObject | undefined
    ): Record<string, ApiResponse> | undefined {
        if (!responses) return undefined;

        const result: Record<string, ApiResponse> = {};

        for (const [statusCode, response] of Object.entries(responses)) {
            const resp = response as OpenAPIV2.ResponseObject;

            result[statusCode] = {
                description: resp.description,
                content: resp.schema
                    ? {
                          "application/json": {
                              schema: resp.schema as Record<string, unknown>,
                          },
                      }
                    : undefined,
            };
        }

        return Object.keys(result).length > 0 ? result : undefined;
    }

    /**
     * Searches endpoints by keyword in path, summary, description, or operationId
     *
     * @author zerry
     * @param doc - Parsed OpenAPI document
     * @param keyword - Search keyword (case-insensitive)
     * @returns Array of matching endpoints
     */
    searchEndpoints(doc: OpenAPIDocument, keyword: string): ApiEndpoint[] {
        const allEndpoints = this.listEndpoints(doc);
        const lowerKeyword = keyword.toLowerCase();

        return allEndpoints.filter((endpoint) => {
            const searchableFields = [
                endpoint.path,
                endpoint.summary,
                endpoint.description,
                endpoint.operationId,
                ...(endpoint.tags ?? []),
            ];

            return searchableFields.some(
                (field) => field?.toLowerCase().includes(lowerKeyword)
            );
        });
    }
}

// Singleton instance for the service
export const swaggerParser = new SwaggerParserService();
