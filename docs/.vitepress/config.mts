/**
 * VitePress Configuration
 *
 * Multi-language documentation site configuration for Swagger MCP Server.
 * Supports English (default) and Korean locales.
 *
 * @author zerry
 */

import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Swagger MCP Server",
    description: "Chat-based API Development with Swagger/OpenAPI",
    base: "/swagger-mcp/",

    head: [
        ["link", { rel: "icon", type: "image/svg+xml", href: "/swagger-mcp/favicon.svg" }],
        ["link", { rel: "icon", type: "image/png", href: "/swagger-mcp/favicon.png" }],
        ["link", { rel: "icon", type: "image/x-icon", href: "/swagger-mcp/favicon.ico" }],
        ["meta", { name: "theme-color", content: "#85EA2D" }],
        ["meta", { name: "og:type", content: "website" }],
        ["meta", { name: "og:site_name", content: "Swagger MCP Server" }],
    ],

    ignoreDeadLinks: [
        /^http:\/\/localhost/,
        /LICENSE/,
        /README/,
        /_media\//,
    ],

    lastUpdated: true,

    themeConfig: {
        logo: "/logo.svg",
        siteTitle: "Swagger MCP",

        socialLinks: [
            { icon: "github", link: "https://github.com/ongjin/swagger-mcp" },
            { icon: "npm", link: "https://www.npmjs.com/package/@zerry_jin/swagger-mcp" },
        ],

        footer: {
            message: "Released under the MIT License.",
            copyright: "Copyright © 2024 zerry",
        },

        search: {
            provider: "local",
            options: {
                locales: {
                    ko: {
                        translations: {
                            button: {
                                buttonText: "검색",
                                buttonAriaLabel: "검색",
                            },
                            modal: {
                                noResultsText: "검색 결과 없음",
                                resetButtonTitle: "초기화",
                                footer: {
                                    selectText: "선택",
                                    navigateText: "이동",
                                    closeText: "닫기",
                                },
                            },
                        },
                    },
                },
            },
        },

        editLink: {
            pattern: "https://github.com/ongjin/swagger-mcp/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },
    },

    locales: {
        // English (Root)
        root: {
            label: "English",
            lang: "en",
            themeConfig: {
                nav: [
                    { text: "Home", link: "/" },
                    { text: "Getting Started", link: "/getting-started" },
                    { text: "Tools", link: "/tools/" },
                    { text: "Examples", link: "/examples" },
                    { text: "API Reference", link: "/api/" },
                ],
                sidebar: {
                    "/": [
                        {
                            text: "Introduction",
                            collapsed: false,
                            items: [
                                { text: "Getting Started", link: "/getting-started" },
                            ],
                        },
                        {
                            text: "Tools Reference",
                            collapsed: false,
                            items: [
                                { text: "Overview", link: "/tools/" },
                                { text: "Service Management", link: "/tools/service-management" },
                                { text: "API Discovery", link: "/tools/api-discovery" },
                                { text: "Schema Inspection", link: "/tools/schema-inspection" },
                                { text: "API Testing", link: "/tools/api-testing" },
                                { text: "Code Generation", link: "/tools/code-generation" },
                            ],
                        },
                        {
                            text: "Examples",
                            collapsed: false,
                            items: [
                                { text: "Examples & Best Practices", link: "/examples" },
                            ],
                        },
                        {
                            text: "API Reference",
                            collapsed: true,
                            items: [
                                { text: "Overview", link: "/api/" },
                                { text: "Globals", link: "/api/globals" },
                            ],
                        },
                    ],
                },
                editLink: {
                    pattern: "https://github.com/ongjin/swagger-mcp/edit/main/docs/:path",
                    text: "Edit this page on GitHub",
                },
            },
        },

        // Korean
        ko: {
            label: "한국어",
            lang: "ko",
            link: "/ko/",
            themeConfig: {
                nav: [
                    { text: "홈", link: "/ko/" },
                    { text: "시작하기", link: "/ko/getting-started" },
                    { text: "도구", link: "/ko/tools/" },
                    { text: "예제", link: "/ko/examples" },
                    { text: "API 명세", link: "/ko/api/" },
                ],
                sidebar: {
                    "/ko/": [
                        {
                            text: "소개",
                            collapsed: false,
                            items: [
                                { text: "시작하기", link: "/ko/getting-started" },
                            ],
                        },
                        {
                            text: "도구 레퍼런스",
                            collapsed: false,
                            items: [
                                { text: "개요", link: "/ko/tools/" },
                                { text: "서비스 관리", link: "/ko/tools/service-management" },
                                { text: "API 탐색", link: "/ko/tools/api-discovery" },
                                { text: "스키마 조회", link: "/ko/tools/schema-inspection" },
                                { text: "API 테스트", link: "/ko/tools/api-testing" },
                                { text: "코드 생성", link: "/ko/tools/code-generation" },
                            ],
                        },
                        {
                            text: "예제",
                            collapsed: false,
                            items: [
                                { text: "예제 & 모범 사례", link: "/ko/examples" },
                            ],
                        },
                        {
                            text: "API 명세",
                            collapsed: true,
                            items: [
                                { text: "개요", link: "/ko/api/" },
                                { text: "Globals", link: "/ko/api/globals" },
                            ],
                        },
                    ],
                },
                editLink: {
                    pattern: "https://github.com/ongjin/swagger-mcp/edit/main/docs/:path",
                    text: "GitHub에서 편집하기",
                },
                outline: {
                    label: "목차",
                },
                lastUpdated: {
                    text: "마지막 수정",
                },
                docFooter: {
                    prev: "이전",
                    next: "다음",
                },
                returnToTopLabel: "맨 위로",
                sidebarMenuLabel: "메뉴",
                darkModeSwitchLabel: "다크 모드",
            },
        },
    },
});
