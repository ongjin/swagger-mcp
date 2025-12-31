/**
 * MCP Resources for Swagger/OpenAPI
 *
 * Provides read-only data resources that Claude can access as context.
 * Resources are exposed via URI scheme: swagger://
 *
 * @author zerry
 * @module resources/swagger-resources
 */

import {
    swaggerParser,
    getCurrentSource,
    getCurrentBaseUrl,
    listServices,
} from "../services/index.js";

/**
 * Resource URI prefix
 */
const RESOURCE_PREFIX = "swagger://";

/**
 * Resource definitions for MCP registration
 *
 * @author zerry
 */
export const swaggerResources = [
    {
        uri: `${RESOURCE_PREFIX}services`,
        name: "Available Services",
        description: "List of all configured services from swagger-targets.json",
        mimeType: "application/json",
    },
    {
        uri: `${RESOURCE_PREFIX}current/info`,
        name: "Current Service Info",
        description: "Information about the currently connected service",
        mimeType: "application/json",
    },
    {
        uri: `${RESOURCE_PREFIX}current/endpoints`,
        name: "Current Endpoints",
        description: "List of all API endpoints from the current service",
        mimeType: "application/json",
    },
    {
        uri: `${RESOURCE_PREFIX}current/schemas`,
        name: "Current Schemas",
        description: "List of all schemas/DTOs from the current service",
        mimeType: "application/json",
    },
];

/**
 * Resource content type
 */
type ResourceContent = {
    uri: string;
    mimeType: string;
    text: string;
};

/**
 * Handles reading the services list resource
 *
 * @author zerry
 */
async function readServicesResource(): Promise<ResourceContent> {
    const services = listServices();

    const content = {
        description: "Configured services from swagger-targets.json",
        count: services.length,
        services: services.map((s) => ({
            alias: s.alias,
            spec: s.spec,
            ...(s.baseUrl ? { baseUrl: s.baseUrl } : {}),
        })),
        usage: "Use swagger_select_service with any alias to connect",
    };

    return {
        uri: `${RESOURCE_PREFIX}services`,
        mimeType: "application/json",
        text: JSON.stringify(content, null, 2),
    };
}

/**
 * Handles reading the current service info resource
 *
 * @author zerry
 */
async function readCurrentInfoResource(): Promise<ResourceContent> {
    const source = getCurrentSource();
    const baseUrl = getCurrentBaseUrl();

    if (!source) {
        return {
            uri: `${RESOURCE_PREFIX}current/info`,
            mimeType: "application/json",
            text: JSON.stringify({
                error: "No service connected",
                hint: "Use swagger_select_service to connect to a service first",
            }, null, 2),
        };
    }

    try {
        const doc = await swaggerParser.parse(source);
        const summary = swaggerParser.getSummary(doc);

        const content = {
            source,
            baseUrl: baseUrl ?? null,
            title: summary.title,
            version: summary.version,
            description: summary.description,
            specVersion: summary.specVersion,
            endpointCount: summary.endpointCount,
            tags: summary.tags,
        };

        return {
            uri: `${RESOURCE_PREFIX}current/info`,
            mimeType: "application/json",
            text: JSON.stringify(content, null, 2),
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            uri: `${RESOURCE_PREFIX}current/info`,
            mimeType: "application/json",
            text: JSON.stringify({ error: message }, null, 2),
        };
    }
}

/**
 * Handles reading the current endpoints resource
 *
 * @author zerry
 */
async function readCurrentEndpointsResource(): Promise<ResourceContent> {
    const source = getCurrentSource();

    if (!source) {
        return {
            uri: `${RESOURCE_PREFIX}current/endpoints`,
            mimeType: "application/json",
            text: JSON.stringify({
                error: "No service connected",
                hint: "Use swagger_select_service to connect to a service first",
            }, null, 2),
        };
    }

    try {
        const doc = await swaggerParser.parse(source);
        const endpoints = swaggerParser.listEndpoints(doc);

        const content = {
            source,
            count: endpoints.length,
            endpoints: endpoints.map((ep) => ({
                method: ep.method.toUpperCase(),
                path: ep.path,
                summary: ep.summary ?? null,
                tags: ep.tags ?? [],
                operationId: ep.operationId ?? null,
            })),
        };

        return {
            uri: `${RESOURCE_PREFIX}current/endpoints`,
            mimeType: "application/json",
            text: JSON.stringify(content, null, 2),
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            uri: `${RESOURCE_PREFIX}current/endpoints`,
            mimeType: "application/json",
            text: JSON.stringify({ error: message }, null, 2),
        };
    }
}

/**
 * Handles reading the current schemas resource
 *
 * @author zerry
 */
async function readCurrentSchemasResource(): Promise<ResourceContent> {
    const source = getCurrentSource();

    if (!source) {
        return {
            uri: `${RESOURCE_PREFIX}current/schemas`,
            mimeType: "application/json",
            text: JSON.stringify({
                error: "No service connected",
                hint: "Use swagger_select_service to connect to a service first",
            }, null, 2),
        };
    }

    try {
        const doc = await swaggerParser.parse(source);

        // Get schemas from OpenAPI 3.x or Swagger 2.0
        let schemas: Record<string, unknown> = {};
        if ("openapi" in doc && doc.components?.schemas) {
            schemas = doc.components.schemas as Record<string, unknown>;
        } else if ("swagger" in doc && doc.definitions) {
            schemas = doc.definitions as Record<string, unknown>;
        }

        const schemaNames = Object.keys(schemas);

        const content = {
            source,
            count: schemaNames.length,
            schemas: schemaNames.map((name) => {
                const schema = schemas[name] as Record<string, unknown>;
                return {
                    name,
                    type: schema["type"] ?? "object",
                    description: schema["description"] ?? null,
                    properties: schema["properties"]
                        ? Object.keys(schema["properties"] as object)
                        : [],
                };
            }),
        };

        return {
            uri: `${RESOURCE_PREFIX}current/schemas`,
            mimeType: "application/json",
            text: JSON.stringify(content, null, 2),
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            uri: `${RESOURCE_PREFIX}current/schemas`,
            mimeType: "application/json",
            text: JSON.stringify({ error: message }, null, 2),
        };
    }
}

/**
 * Resource handler mapping
 *
 * @author zerry
 */
export async function readResource(uri: string): Promise<ResourceContent | null> {
    switch (uri) {
        case `${RESOURCE_PREFIX}services`:
            return readServicesResource();
        case `${RESOURCE_PREFIX}current/info`:
            return readCurrentInfoResource();
        case `${RESOURCE_PREFIX}current/endpoints`:
            return readCurrentEndpointsResource();
        case `${RESOURCE_PREFIX}current/schemas`:
            return readCurrentSchemasResource();
        default:
            return null;
    }
}
