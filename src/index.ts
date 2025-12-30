#!/usr/bin/env node

/**
 * Swagger MCP Server
 *
 * A Model Context Protocol (MCP) server that provides Swagger/OpenAPI
 * documentation parsing, API testing, and multi-service support.
 *
 * Features:
 * - Config-based service management (swagger-targets.json)
 * - Dynamic URL input support
 * - API endpoint discovery and search
 * - Schema/DTO inspection
 * - Live API testing
 * - cURL command generation
 *
 * Usage:
 *   swagger-mcp [options]
 *
 * Options:
 *   --config PATH   Path to swagger-targets.json or directory containing it
 *   -c PATH         Short form of --config
 *   --help, -h      Show help message
 *
 * @author zerry
 * @module @zerry_jin/swagger-mcp
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { swaggerTools, toolHandlers } from "./tools/index.js";
import { loadTargets, initConfig } from "./services/index.js";

/**
 * Parses command line arguments
 *
 * @author zerry
 * @returns Parsed arguments object
 */
function parseArgs(): { configPath: string | undefined; showHelp: boolean } {
    const args = process.argv.slice(2);
    let configPath: string | undefined = undefined;
    let showHelp = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i] as string;

        if (arg === "--help" || arg === "-h") {
            showHelp = true;
        } else if (arg === "--config" || arg === "-c") {
            configPath = args[++i];
        } else if (arg.startsWith("--config=")) {
            configPath = arg.split("=")[1];
        } else if (!arg.startsWith("-") && !configPath) {
            // Positional argument as config path
            configPath = arg;
        }
    }

    return { configPath, showHelp };
}

/**
 * Shows help message and exits
 *
 * @author zerry
 */
function showHelpAndExit(): void {
    console.log(`
Swagger MCP Server - Chat-based API Development with Swagger/OpenAPI

USAGE:
  swagger-mcp [options]
  swagger-mcp PATH

OPTIONS:
  --config, -c PATH   Path to swagger-targets.json or directory containing it
  --help, -h          Show this help message

EXAMPLES:
  swagger-mcp --config /path/to/project
  swagger-mcp /path/to/swagger-targets.json
  swagger-mcp -c ./my-project

CONFIG SEARCH ORDER (when no --config provided):
  1. SWAGGER_MCP_CONFIG environment variable
  2. Current working directory
  3. ~/.swagger-mcp/swagger-targets.json

For more information, visit: https://github.com/ongjin/swagger-mcp
`);
    process.exit(0);
}

/**
 * Creates and configures the MCP server with all tools registered
 *
 * @author zerry
 * @returns Configured MCP Server instance
 */
function createServer(): Server {
    const server = new Server(
        {
            name: "@zerry_jin/swagger-mcp",
            version: "0.1.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register ListTools handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: Object.values(swaggerTools),
        };
    });

    // Register CallTool handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        const handler = toolHandlers[name];
        if (!handler) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Error: Unknown tool "${name}"`,
                    },
                ],
                isError: true,
            };
        }

        return handler(args);
    });

    return server;
}

/**
 * Logs startup information
 *
 * @author zerry
 */
function logStartup(): void {
    console.error("═══════════════════════════════════════════════════════");
    console.error("  🔌 Swagger MCP Server v0.1.0");
    console.error("═══════════════════════════════════════════════════════");
    console.error("");

    // Load and display configured services
    const targets = loadTargets();
    const serviceCount = Object.keys(targets).length;

    if (serviceCount > 0) {
        console.error(`📋 Loaded ${serviceCount} service(s) from swagger-targets.json:`);
        for (const [alias, url] of Object.entries(targets)) {
            console.error(`   • ${alias}: ${url}`);
        }
    } else {
        console.error("📋 No swagger-targets.json found. You can:");
        console.error("   • Create one in project root for quick service switching");
        console.error("   • Or use direct URLs with swagger_select_service");
    }

    console.error("");
    console.error("🛠️  Available Tools:");
    console.error("   ├─ swagger_select_service  : Select a service to work with");
    console.error("   ├─ swagger_list_services   : List configured services");
    console.error("   ├─ swagger_get_current     : Show current service info");
    console.error("   ├─ swagger_list_endpoints  : List all API endpoints");
    console.error("   ├─ swagger_get_endpoint    : Get endpoint details");
    console.error("   ├─ swagger_search          : Search endpoints by keyword");
    console.error("   ├─ swagger_get_schema      : Get schema/DTO structure");
    console.error("   ├─ swagger_list_schemas    : List all schemas");
    console.error("   ├─ swagger_test            : Execute API request");
    console.error("   ├─ swagger_curl            : Generate cURL command");
    console.error("   └─ swagger_generate_code   : Generate TypeScript/axios code");
    console.error("");
    console.error("💡 Start by selecting a service:");
    console.error('   "Connect to auth service" or "Use https://api.example.com/docs"');
    console.error("═══════════════════════════════════════════════════════");
}

/**
 * Main entry point for the Swagger MCP server.
 * Initializes the MCP server with stdio transport and starts listening.
 *
 * @author zerry
 * @returns A promise that resolves when the server is running
 */
async function main(): Promise<void> {
    // Parse command line arguments
    const { configPath, showHelp } = parseArgs();

    if (showHelp) {
        showHelpAndExit();
    }

    // Initialize config with explicit path if provided
    initConfig(configPath);

    // Log startup info
    logStartup();

    // Create and start server
    const server = createServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
}

main().catch((error: unknown) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
