# Globals (전역 Export)

이 페이지는 TypeDoc으로 자동 생성된 API 문서의 한국어 안내 페이지입니다.

::: warning 자동 생성 문서
아래 내용은 TypeScript 소스 코드에서 자동 생성되어 영어로 제공됩니다.
:::

## 개요

Swagger MCP 서버의 전역 export 및 타입 정의입니다.

## 주요 타입

| 타입 | 설명 |
|------|------|
| `SwaggerTargets` | swagger-targets.json 설정 타입 (키: 서비스 별칭, 값: URL) |
| `SwaggerSpec` | 파싱된 Swagger/OpenAPI 스펙 |
| `EndpointInfo` | API 엔드포인트 정보 |
| `RequestConfig` | HTTP 요청 설정 |
| `ApiResponse` | API 응답 구조 |

## 주요 함수

| 함수 | 설명 |
|------|------|
| `loadTargets()` | swagger-targets.json 설정 로드 |
| `initConfig(path?)` | 설정 경로 초기화 |
| `getCurrentSource()` | 현재 연결된 서비스 URL 반환 |
| `setCurrentSource(url)` | 현재 서비스 URL 설정 |
| `resolveServiceUrl(name)` | 서비스 이름을 URL로 변환 |
| `listServices()` | 등록된 서비스 목록 반환 |
| `reloadConfig()` | 설정 파일 다시 로드 |

## 설정 탐색 순서

`swagger-targets.json` 파일은 다음 순서로 탐색됩니다:

1. `--config` 인자로 지정된 경로
2. `SWAGGER_MCP_CONFIG` 환경 변수
3. 현재 작업 디렉토리
4. `~/.swagger-mcp/swagger-targets.json`

## 상세 API 문서

TypeDoc으로 생성된 원본 영어 문서:

<a href="/swagger-mcp/api/globals.html" target="_blank" rel="noopener">Globals (영어 원본) ↗</a>

## 참고

- [도구 레퍼런스](/ko/tools/) - MCP 도구 상세 문서
- [예제 & 모범 사례](/ko/examples) - 사용 패턴
