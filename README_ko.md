# 🔌 Swagger MCP 서버

AI와 대화하며 Swagger/OpenAPI를 탐색하고, API를 직접 테스트하세요. Postman 없이 채팅만으로 API 개발이 가능합니다.

[![npm version](https://img.shields.io/npm/v/@zerry_jin/swagger-mcp)](https://www.npmjs.com/package/@zerry_jin/swagger-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@zerry_jin/swagger-mcp)](https://www.npmjs.com/package/@zerry_jin/swagger-mcp)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://ongjin.github.io/swagger-mcp)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.x-green)
![Swagger](https://img.shields.io/badge/Swagger-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

**[English](./README.md)** | **[📚 Documentation](https://ongjin.github.io/swagger-mcp)**

---

## 왜 필요한가요?

MSA 환경에서 여러 서비스의 API 문서를 오가며 개발하는 것은 번거롭습니다.

이 MCP 서버를 사용하면:
- 🔄 **서비스 전환이 자유로움** - 채팅으로 "payment 서버 연결해줘"
- 🧪 **API 직접 테스트** - Postman 없이 채팅에서 바로 호출
- 📋 **cURL 자동 생성** - 복사해서 터미널에 붙여넣기
- 📊 **스키마/DTO 조회** - TypeScript 인터페이스 생성에 활용
- ⚡ **동적 URL 지원** - 설정 없이 바로 URL 입력 가능

---

## ✨ 사용 가능한 도구

### 🔌 서비스 관리
| 도구 | 설명 |
|------|------|
| `swagger_select_service` | 서비스 선택 (설정 파일의 alias 또는 직접 URL) |
| `swagger_list_services` | 등록된 서비스 목록 조회 |
| `swagger_get_current` | 현재 서비스 정보 표시 |

### 🔍 API 탐색
| 도구 | 설명 |
|------|------|
| `swagger_list_endpoints` | 모든 엔드포인트 나열 (태그 필터 가능) |
| `swagger_get_endpoint` | 엔드포인트 상세 정보 (파라미터, 바디, 응답) |
| `swagger_search` | 키워드로 엔드포인트 검색 |

### 📊 스키마 조회
| 도구 | 설명 |
|------|------|
| `swagger_get_schema` | 스키마/DTO 구조 조회 |
| `swagger_list_schemas` | 모든 스키마 목록 |

### 🧪 API 테스트
| 도구 | 설명 |
|------|------|
| `swagger_test` | **실제 HTTP 요청 실행** |
| `swagger_curl` | **cURL 명령어 생성** |

---

## 🚀 설치

```bash
# 설치 없이 바로 사용
npx @zerry_jin/swagger-mcp

# 또는 전역 설치
npm install -g @zerry_jin/swagger-mcp
```

---

## ⚙️ 설정

### Claude Code (CLI)

```bash
# MCP 서버 등록
claude mcp add swagger-mcp -- npx @zerry_jin/swagger-mcp -s project

# 확인
claude mcp list
```

### Claude Desktop 앱

`claude_desktop_config.json`에 추가:

<details>
<summary>📁 설정 파일 위치</summary>

| OS | 경로 |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

</details>

```json
{
  "mcpServers": {
    "swagger-mcp": {
      "command": "npx",
      "args": ["-y", "@zerry_jin/swagger-mcp"]
    }
  }
}
```

---

## 📋 서비스 설정 (swagger-targets.json)

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
사용자: payment 서버 연결해줘
Claude: ✅ "payment" 서비스에 연결되었습니다 (http://localhost:3001/api-docs)
```

### 설정 파일 탐색 순서

1. **`--config` 인자** - 명시적 경로
2. **`SWAGGER_MCP_CONFIG`** - 환경 변수
3. **현재 작업 디렉토리**
4. **`~/.swagger-mcp/swagger-targets.json`** - 홈 디렉토리

> 💡 **Tip**: Claude Desktop에서는 `--config`로 프로젝트 경로를 지정하세요:
> ```json
> "args": ["-y", "@zerry_jin/swagger-mcp", "--config", "/path/to/project"]
> ```

---

## 🎯 빠른 권한 설정

### Claude Code (CLI)

```bash
# claude에서 다음 입력:
/permissions

# Allowed Tools에 추가:
mcp__swagger-mcp__*
```

### Claude Desktop 앱

처음 도구 사용 시 **"Always allow requests from this server"** 체크.

---

## 💡 사용 예시

### 1️⃣ 서비스 선택

```
사용자: petstore API 연결해줘

Claude: [swagger_select_service name="petstore"]

✅ "petstore"에 연결됨
- 제목: Swagger Petstore
- 버전: 1.0.0
- 엔드포인트: 20개
- 태그: pet, store, user
```

### 2️⃣ 엔드포인트 목록

```
사용자: pet 관련 엔드포인트 보여줘

Claude: [swagger_list_endpoints tag="pet"]

🏷️ "pet" 태그 8개 엔드포인트:
| 메서드 | 경로 | 요약 |
|--------|------|------|
| POST | /pet | 새 펫 추가 |
| PUT | /pet | 펫 수정 |
| GET | /pet/findByStatus | 상태로 검색 |
| GET | /pet/{petId} | ID로 조회 |
| DELETE | /pet/{petId} | 펫 삭제 |
...
```

### 3️⃣ 엔드포인트 상세 정보

```
사용자: POST /pet 상세 정보 알려줘

Claude: [swagger_get_endpoint method="post" path="/pet"]

📖 POST /pet - 스토어에 새 펫 추가

요청 바디 (application/json):
{
  "name": string (필수),
  "photoUrls": string[] (필수),
  "status": "available" | "pending" | "sold"
}

응답:
- 200: 성공
- 405: 잘못된 입력
```

### 4️⃣ 스키마/DTO 조회

```
사용자: Pet 스키마 보여줘

Claude: [swagger_get_schema schemaName="Pet"]

📊 Pet 스키마:
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

### 5️⃣ API 테스트 (🔥 Postman 필요 없음!)

```
사용자: GET /pet/1 호출해봐

Claude: [swagger_test method="GET" path="/pet/{petId}" pathParams={"petId":"1"}]

🧪 API 테스트 결과:

요청: GET /pet/1
상태: 200 OK
소요시간: 127ms

응답:
{
  "id": 1,
  "name": "doggie",
  "status": "available"
}

cURL:
curl 'https://petstore.swagger.io/v2/pet/1'
```

### 6️⃣ cURL 생성

```
사용자: 펫 생성 curl 명령어 만들어줘

Claude: [swagger_curl method="POST" path="/pet" body={...}]

📋 cURL 명령어:

curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "doggie",
    "photoUrls": ["https://example.com/photo.jpg"],
    "status": "available"
  }' \
  'https://petstore.swagger.io/v2/pet'
```

### 7️⃣ 서비스 전환

```
사용자: 이제 payment 서버로 바꿔줘

Claude: [swagger_select_service name="payment"]

✅ "payment"로 전환됨 (http://localhost:3001/api-docs)
- 제목: Payment API
- 엔드포인트: 12개
```

---

## 🔧 지원 스펙

| 포맷 | 버전 |
|------|------|
| OpenAPI | 3.0.x, 3.1.x |
| Swagger | 2.0 |

---

## 🏗️ 아키텍처

```
src/
├── index.ts                 # MCP 서버 진입점
├── services/
│   ├── config-loader.ts     # swagger-targets.json 로더
│   ├── swagger-parser.ts    # OpenAPI 파싱
│   └── http-client.ts       # API 테스트 & cURL 생성
├── tools/
│   └── swagger-tools.ts     # 10개 MCP 도구
└── types/
    └── swagger.ts           # TypeScript 타입 정의
```

---

## 📚 문서

**[https://ongjin.github.io/swagger-mcp](https://ongjin.github.io/swagger-mcp)**

- [시작하기](https://ongjin.github.io/swagger-mcp/ko/getting-started)
- [도구 레퍼런스](https://ongjin.github.io/swagger-mcp/ko/tools/)
- [예제 & 모범 사례](https://ongjin.github.io/swagger-mcp/ko/examples)
- [API 명세](https://ongjin.github.io/swagger-mcp/ko/api/)

---

## 🤝 기여하기

기여를 환영합니다!
- 🐛 버그 제보
- 💡 기능 제안
- 🔧 Pull Request

---

## 📄 라이선스

MIT License

---

Made with ❤️ by **zerry**
