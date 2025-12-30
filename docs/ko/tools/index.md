# 도구 개요

Swagger MCP 서버는 5개 카테고리로 구성된 11개의 도구를 제공합니다.

## 카테고리

### 🔌 [서비스 관리](./service-management)

여러 API 서비스 연결을 관리합니다.

| 도구 | 설명 |
|------|------|
| `swagger_select_service` | 서비스 선택 (설정 파일의 alias 또는 직접 URL) |
| `swagger_list_services` | 등록된 서비스 목록 조회 |
| `swagger_get_current` | 현재 서비스 정보 표시 |

### 🔍 [API 탐색](./api-discovery)

API 엔드포인트를 탐색하고 검색합니다.

| 도구 | 설명 |
|------|------|
| `swagger_list_endpoints` | 모든 엔드포인트 나열 (태그 필터 가능) |
| `swagger_get_endpoint` | 엔드포인트 상세 정보 (파라미터, 바디, 응답) |
| `swagger_search` | 키워드로 엔드포인트 검색 |

### 📊 [스키마 조회](./schema-inspection)

데이터 스키마와 DTO를 조회합니다.

| 도구 | 설명 |
|------|------|
| `swagger_get_schema` | 스키마/DTO 구조 조회 |
| `swagger_list_schemas` | 모든 스키마 목록 |

### 🧪 [API 테스트](./api-testing)

API를 테스트하고 cURL 명령어를 생성합니다.

| 도구 | 설명 |
|------|------|
| `swagger_test` | **실제 HTTP 요청 실행** |
| `swagger_curl` | **cURL 명령어 생성** |

### 🛠️ 코드 생성

API 스펙에서 코드를 생성합니다.

| 도구 | 설명 |
|------|------|
| `swagger_generate_code` | **TypeScript/axios 코드 생성** |

## 빠른 참조

```
# 서비스 관리
swagger_select_service  → 서비스 연결
swagger_list_services   → 서비스 목록 조회
swagger_get_current     → 현재 연결 정보

# API 탐색
swagger_list_endpoints  → 모든 엔드포인트 나열
swagger_get_endpoint    → 엔드포인트 상세 정보
swagger_search          → 키워드 검색

# 스키마 조회
swagger_get_schema      → 스키마 구조 조회
swagger_list_schemas    → 모든 스키마 나열

# API 테스트
swagger_test            → HTTP 요청 실행
swagger_curl            → cURL 명령어 생성

# 코드 생성
swagger_generate_code   → TypeScript/axios 코드 생성
```
