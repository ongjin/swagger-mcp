/**
 * HTTP Client Service
 *
 * Provides HTTP request functionality for testing API endpoints.
 * Generates cURL commands and executes actual HTTP requests.
 *
 * @author zerry
 * @module services/http-client
 */

/**
 * Supported HTTP methods
 *
 * @author zerry
 */
export type HttpMethodType =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "OPTIONS"
    | "HEAD";

/**
 * Request configuration for API calls
 *
 * @author zerry
 */
export interface RequestConfig {
    /** Base URL of the API server */
    baseUrl: string;
    /** HTTP method */
    method: HttpMethodType;
    /** API path (e.g., /users/{id}) */
    path: string;
    /** Path parameters to substitute */
    pathParams?: Record<string, string> | undefined;
    /** Query parameters */
    queryParams?: Record<string, string> | undefined;
    /** Request headers */
    headers?: Record<string, string> | undefined;
    /** Request body (for POST, PUT, PATCH) */
    body?: unknown;
    /** Request timeout in milliseconds */
    timeout?: number | undefined;
}

/**
 * Response from API call
 *
 * @author zerry
 */
export interface ApiResponse {
    /** HTTP status code */
    status: number;
    /** Status text */
    statusText: string;
    /** Response headers */
    headers: Record<string, string>;
    /** Response body */
    body: unknown;
    /** Time taken in milliseconds */
    duration: number;
    /** Generated cURL command */
    curl: string;
}

/**
 * Substitutes path parameters in a URL path
 *
 * @author zerry
 * @param path - URL path with placeholders (e.g., /users/{id})
 * @param params - Parameter values to substitute
 * @returns Path with substituted values
 */
export function substitutePath(
    path: string,
    params: Record<string, string>
): string {
    let result = path;
    for (const [key, value] of Object.entries(params)) {
        // Handle both {param} and :param styles
        result = result.replace(`{${key}}`, encodeURIComponent(value));
        result = result.replace(`:${key}`, encodeURIComponent(value));
    }
    return result;
}

/**
 * Builds query string from parameters
 *
 * @author zerry
 * @param params - Query parameters
 * @returns Query string (without leading ?)
 */
export function buildQueryString(params: Record<string, string>): string {
    const entries = Object.entries(params);
    if (entries.length === 0) return "";

    return entries
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
}

/**
 * Generates a cURL command from request configuration
 *
 * @author zerry
 * @param config - Request configuration
 * @returns cURL command string
 */
export function generateCurl(config: RequestConfig): string {
    const {
        baseUrl,
        method,
        path,
        pathParams,
        queryParams,
        headers,
        body,
    } = config;

    // Build the full URL
    let resolvedPath = path;
    if (pathParams) {
        resolvedPath = substitutePath(path, pathParams);
    }

    let fullUrl = `${baseUrl.replace(/\/$/, "")}${resolvedPath}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
        fullUrl += `?${buildQueryString(queryParams)}`;
    }

    // Start building curl command
    const parts: string[] = ["curl"];

    // Add method
    if (method !== "GET") {
        parts.push(`-X ${method}`);
    }

    // Add headers
    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            parts.push(`-H '${key}: ${value}'`);
        }
    }

    // Add content-type for body requests
    if (body && !headers?.["Content-Type"]) {
        parts.push("-H 'Content-Type: application/json'");
    }

    // Add body
    if (body) {
        const bodyStr =
            typeof body === "string" ? body : JSON.stringify(body, null, 2);
        // Escape single quotes in body
        const escapedBody = bodyStr.replace(/'/g, "'\\''");
        parts.push(`-d '${escapedBody}'`);
    }

    // Add URL
    parts.push(`'${fullUrl}'`);

    return parts.join(" \\\n  ");
}

/**
 * Executes an HTTP request
 *
 * @author zerry
 * @param config - Request configuration
 * @returns API response with status, body, headers, and timing
 */
export async function executeRequest(
    config: RequestConfig
): Promise<ApiResponse> {
    const {
        baseUrl,
        method,
        path,
        pathParams,
        queryParams,
        headers,
        body,
        timeout = 30000,
    } = config;

    // Build the full URL
    let resolvedPath = path;
    if (pathParams) {
        resolvedPath = substitutePath(path, pathParams);
    }

    let fullUrl = `${baseUrl.replace(/\/$/, "")}${resolvedPath}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
        fullUrl += `?${buildQueryString(queryParams)}`;
    }

    // Generate curl for reference
    const curl = generateCurl(config);

    // Prepare fetch options
    const fetchHeaders: Record<string, string> = {
        ...headers,
    };

    if (body && !fetchHeaders["Content-Type"]) {
        fetchHeaders["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
        method,
        headers: fetchHeaders,
        signal: AbortSignal.timeout(timeout),
    };

    if (body && method !== "GET" && method !== "HEAD") {
        fetchOptions.body =
            typeof body === "string" ? body : JSON.stringify(body);
    }

    // Execute request with timing
    const startTime = Date.now();

    try {
        const response = await fetch(fullUrl, fetchOptions);
        const duration = Date.now() - startTime;

        // Parse response headers
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // Parse response body
        let responseBody: unknown;
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
            try {
                responseBody = await response.json();
            } catch {
                responseBody = await response.text();
            }
        } else {
            responseBody = await response.text();
        }

        return {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseBody,
            duration,
            curl,
        };
    } catch (error) {
        const duration = Date.now() - startTime;
        const message = error instanceof Error ? error.message : String(error);

        return {
            status: 0,
            statusText: "Request Failed",
            headers: {},
            body: { error: message },
            duration,
            curl,
        };
    }
}

/**
 * Extracts base URL from Swagger spec servers or host
 *
 * @author zerry
 * @param servers - Server URLs from spec
 * @param specUrl - Original spec URL as fallback
 * @returns Base URL for API calls
 */
export function extractBaseUrl(
    servers: string[] | undefined,
    specUrl: string
): string {
    // If servers are defined, use the first one
    const firstServer = servers?.[0];
    if (firstServer) {
        // Handle relative URLs
        if (firstServer.startsWith("/")) {
            const url = new URL(specUrl);
            return `${url.protocol}//${url.host}${firstServer}`;
        }
        return firstServer;
    }

    // Extract from spec URL
    try {
        const url = new URL(specUrl);
        return `${url.protocol}//${url.host}`;
    } catch {
        return specUrl;
    }
}
