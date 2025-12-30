# API 명세

Swagger MCP 서버의 TypeDoc 생성 API 문서입니다.

::: info 참고
API 문서는 TypeScript 소스 코드에서 자동 생성되어 영어로 제공됩니다.
:::

## 모듈

소스 코드에서 자동 생성된 문서입니다.

### 사용 가능한 모듈

| 모듈 | 설명 |
|------|------|
| [Globals](/ko/api/globals) | 전역 export 및 타입 정의 |

## 소스 구조

```
src/
├── index.ts                 # MCP 서버 진입점
├── services/
│   ├── config-loader.ts     # swagger-targets.json 로더
│   ├── swagger-parser.ts    # OpenAPI 파싱
│   └── http-client.ts       # API 테스트 & cURL 생성
├── tools/
│   └── swagger-tools.ts     # 10개 MCP 도구 구현
└── types/
    └── swagger.ts           # TypeScript 타입 정의
```

## 주요 Export

### 타입

| 타입 | 설명 |
|------|------|
| `SwaggerSpec` | 파싱된 Swagger/OpenAPI 스펙 |
| `EndpointInfo` | API 엔드포인트 정보 |
| `RequestConfig` | HTTP 요청 설정 |
| `ApiResponse` | API 응답 구조 |

### 서비스

| 서비스 | 설명 |
|--------|------|
| `SwaggerParserService` | Swagger/OpenAPI 스펙 파싱 및 캐싱 |
| `loadTargets()` | swagger-targets.json 설정 로드 |
| `executeRequest()` | HTTP 요청 실행 |
| `generateCurl()` | cURL 명령어 생성 |

### 도구

Swagger/OpenAPI 상호작용을 위한 10개 MCP 도구:

| 도구 | 기능 |
|------|------|
| `swagger_select_service` | 서비스 연결 |
| `swagger_list_services` | 설정된 서비스 목록 |
| `swagger_get_current` | 현재 서비스 정보 |
| `swagger_list_endpoints` | API 엔드포인트 목록 |
| `swagger_get_endpoint` | 엔드포인트 상세 정보 |
| `swagger_search` | 엔드포인트 검색 |
| `swagger_get_schema` | 스키마 구조 조회 |
| `swagger_list_schemas` | 모든 스키마 목록 |
| `swagger_test` | HTTP 요청 실행 |
| `swagger_curl` | cURL 명령어 생성 |

## 상세 API 문서

TypeDoc으로 생성된 상세 문서:

- [Globals](/ko/api/globals) - 전역 export 상세

## 참고

- [도구 레퍼런스](/ko/tools/) - 상세 도구 문서
- [예제](/ko/examples) - 사용 예제 및 모범 사례
