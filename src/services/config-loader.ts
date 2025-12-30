/**
 * Configuration Loader Service
 *
 * Loads and manages swagger-targets.json configuration file
 * for multi-service MSA environment support.
 *
 * Search order:
 * 1. Explicit path via args (--config or positional)
 * 2. Environment variable: SWAGGER_MCP_CONFIG
 * 3. Current working directory
 * 4. Home directory: ~/.swagger-mcp/swagger-targets.json
 *
 * @author zerry
 * @module services/config-loader
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

/**
 * Type definition for swagger targets configuration
 * Key is the service alias, value is the URL or file path
 *
 * @author zerry
 */
export type SwaggerTargets = Record<string, string>;

/**
 * Default configuration file name
 */
const CONFIG_FILE_NAME = "swagger-targets.json";

/**
 * Global state for current source
 *
 * @author zerry
 */
let currentSource: string | null = null;

/**
 * Cached targets configuration
 */
let cachedTargets: SwaggerTargets | null = null;

/**
 * Cached config path (set via initConfig)
 */
let explicitConfigPath: string | null = null;

/**
 * Initializes config with explicit path from args
 *
 * @author zerry
 * @param configPath - Explicit path to swagger-targets.json
 */
export function initConfig(configPath?: string): void {
    if (configPath) {
        explicitConfigPath = configPath;
        console.error(`[swagger-mcp] Using config path: ${configPath}`);
    }
}

/**
 * Gets all possible config file paths in priority order
 *
 * @author zerry
 * @returns Array of possible config paths
 */
export function getConfigSearchPaths(): string[] {
    const paths: string[] = [];

    // 1. Explicit path (highest priority)
    if (explicitConfigPath) {
        // If it's a directory, append filename; if it's a file, use directly
        if (existsSync(explicitConfigPath)) {
            const stats = require("fs").statSync(explicitConfigPath);
            if (stats.isDirectory()) {
                paths.push(join(explicitConfigPath, CONFIG_FILE_NAME));
            } else {
                paths.push(explicitConfigPath);
            }
        } else {
            // Path doesn't exist yet, assume it's intended path
            paths.push(explicitConfigPath);
        }
    }

    // 2. Environment variable
    const envPath = process.env["SWAGGER_MCP_CONFIG"];
    if (envPath) {
        paths.push(envPath);
    }

    // 3. Current working directory
    paths.push(join(process.cwd(), CONFIG_FILE_NAME));

    // 4. Home directory
    paths.push(join(homedir(), ".swagger-mcp", CONFIG_FILE_NAME));

    return paths;
}

/**
 * Gets the path to the configuration file
 * Searches multiple locations and returns the first existing one
 *
 * @author zerry
 * @returns Full path to swagger-targets.json or null if not found
 */
function getConfigPath(): string | null {
    const searchPaths = getConfigSearchPaths();

    for (const path of searchPaths) {
        if (existsSync(path)) {
            return path;
        }
    }

    return null;
}

/**
 * Loads swagger targets from configuration file
 *
 * @author zerry
 * @param forceReload - Force reload from file system
 * @returns SwaggerTargets configuration object
 */
export function loadTargets(forceReload = false): SwaggerTargets {
    if (cachedTargets && !forceReload) {
        return cachedTargets;
    }

    const configPath = getConfigPath();

    if (!configPath) {
        const searchPaths = getConfigSearchPaths();
        console.error(
            `[swagger-mcp] ${CONFIG_FILE_NAME} not found in any of these locations:`
        );
        searchPaths.forEach((p) => console.error(`   • ${p}`));
        console.error(
            "[swagger-mcp] You can create it with service aliases for quick switching."
        );
        console.error(
            "[swagger-mcp] Or pass --config <path> to specify location."
        );
        cachedTargets = {};
        return cachedTargets;
    }

    try {
        const content = readFileSync(configPath, "utf-8");
        cachedTargets = JSON.parse(content) as SwaggerTargets;
        console.error(
            `[swagger-mcp] Loaded ${Object.keys(cachedTargets).length} service(s) from ${configPath}`
        );
        return cachedTargets;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(
            `[swagger-mcp] Error reading ${configPath}: ${message}`
        );
        cachedTargets = {};
        return cachedTargets;
    }
}

/**
 * Gets the current source URL
 *
 * @author zerry
 * @returns Current source URL or null if not set
 */
export function getCurrentSource(): string | null {
    return currentSource;
}

/**
 * Sets the current source URL
 *
 * @author zerry
 * @param source - URL or file path to set as current source
 */
export function setCurrentSource(source: string): void {
    currentSource = source;
}

/**
 * Clears the current source
 *
 * @author zerry
 */
export function clearCurrentSource(): void {
    currentSource = null;
}

/**
 * Resolves a service name to its URL
 * First checks swagger-targets.json, then treats as direct URL
 *
 * @author zerry
 * @param nameOrUrl - Service alias or direct URL
 * @returns Resolved URL or file path
 */
export function resolveServiceUrl(nameOrUrl: string): {
    resolved: string;
    isAlias: boolean;
    aliasName?: string | undefined;
} {
    const targets = loadTargets();

    // Check if it's a registered alias
    if (targets[nameOrUrl]) {
        return {
            resolved: targets[nameOrUrl],
            isAlias: true,
            aliasName: nameOrUrl,
        };
    }

    // Treat as direct URL or file path
    return {
        resolved: nameOrUrl,
        isAlias: false,
    };
}

/**
 * Lists all available service aliases
 *
 * @author zerry
 * @returns Array of service entries with alias and URL
 */
export function listServices(): Array<{ alias: string; url: string }> {
    const targets = loadTargets();
    return Object.entries(targets).map(([alias, url]) => ({ alias, url }));
}

/**
 * Reloads the configuration from file
 *
 * @author zerry
 * @returns Updated SwaggerTargets
 */
export function reloadConfig(): SwaggerTargets {
    return loadTargets(true);
}
