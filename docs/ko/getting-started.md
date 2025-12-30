# 시작하기

이 가이드는 Swagger MCP 서버를 설정하고 Claude와 함께 사용하는 방법을 안내합니다.

## 사전 요구사항

- **Node.js** >= 18.0.0
- **Claude Desktop** 또는 **Claude Code CLI**

## 설치

### 옵션 1: npx 사용 (권장)

설치 없이 바로 사용할 수 있습니다:

```bash
npx @zerry_jin/swagger-mcp
```

### 옵션 2: 전역 설치

```bash
npm install -g @zerry_jin/swagger-mcp
```

## 설정

### Claude Code (CLI)

```bash
# MCP 서버 등록
claude mcp add swagger-mcp -- npx @zerry_jin/swagger-mcp -s project

# 확인
claude mcp list
```

### Claude Desktop 앱

Claude Desktop 설정 파일에 다음을 추가하세요:

::: code-group

```json [macOS]
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

```json [Windows]
// %APPDATA%\Claude\claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

```json [Linux]
// ~/.config/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

:::

## 서비스 설정 (swagger-targets.json)

프로젝트 루트에 `swagger-targets.json` 파일을 생성하면 서비스를 빠르게 전환할 수 있습니다:

```json
{
  "auth": "http://localhost:3000/api-docs",
  "payment": "http://localhost:3001/api-docs",
  "order": "http://localhost:3002/api-docs",
  "petstore": "https://petstore.swagger.io/v2/swagger.json",
  "local": "./docs/openapi.yaml"
}
```

이제 이름으로 서비스를 전환할 수 있습니다:
```
사용자: payment 서비스에 연결해줘
Claude: ✅ "payment"에 연결되었습니다 (http://localhost:3001/api-docs)
```

### 설정 파일 탐색 순서

서버는 다음 순서로 `swagger-targets.json` 파일을 찾습니다:

1. **명시적 경로** `--config` 또는 `-c` 인자로 지정
2. **환경 변수** `SWAGGER_MCP_CONFIG`
3. **현재 작업 디렉토리**
4. **홈 디렉토리** `~/.swagger-mcp/swagger-targets.json`

::: tip Claude Desktop에서 사용하기
Claude Desktop의 작업 디렉토리가 프로젝트 루트가 아닐 수 있으므로, `--config` 인자로 경로를 지정하세요:

```json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp", "--config", "/path/to/your/project"]
    }
  }
}
```
:::

## 빠른 권한 설정

### Claude Code (CLI)

```bash
# claude에서 다음 입력:
/permissions

# Allowed Tools에 추가:
mcp__swagger-mcp__*
```

### Claude Desktop 앱

처음 도구 사용 시 **"Always allow requests from this server"**를 체크하세요.

## 설치 확인

설정 후 Claude 클라이언트를 재시작하세요. Swagger MCP 도구가 사용 가능한지 확인할 수 있습니다.

Claude에게 요청해보세요:

> "petstore API에 연결하고 모든 엔드포인트를 보여줘"

정상적으로 설정되었다면, Claude가 `swagger_select_service`로 연결하고 `swagger_list_endpoints`로 API를 보여줄 것입니다.

## 지원하는 스펙

| 포맷 | 버전 |
|------|------|
| OpenAPI | 3.0.x, 3.1.x |
| Swagger | 2.0 |

## 다음 단계

- [도구 레퍼런스](/ko/tools/)에서 상세한 도구 문서를 확인하세요
- [예제 & 모범 사례](/ko/examples)에서 사용 패턴을 살펴보세요
- [API 명세](/api/)에서 TypeDoc 생성 문서를 확인하세요
