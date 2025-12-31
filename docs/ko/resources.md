# 리소스

MCP 리소스는 Claude가 별도의 도구 호출 없이 컨텍스트로 접근할 수 있는 읽기 전용 데이터를 제공합니다.

## 리소스란?

리소스는 URI를 통해 노출되는 데이터로, Claude가 직접 읽을 수 있습니다. 도구(액션 수행)와 달리, 리소스는 대화 컨텍스트를 풍부하게 하는 정적 또는 동적 데이터를 제공합니다.

**장점:**
- 같은 데이터를 반복해서 도구 호출할 필요 없음
- Claude가 응답에서 자연스럽게 데이터 참조 가능
- 복잡한 작업 중 컨텍스트 전환 감소

## 사용 가능한 리소스

### swagger://services

`swagger-targets.json`에 설정된 모든 서비스 목록을 표시합니다.

**응답 예시:**
```json
{
  "description": "Configured services from swagger-targets.json",
  "count": 3,
  "services": [
    { "alias": "auth", "spec": "http://localhost:3000/api-docs" },
    { "alias": "payment", "spec": "./specs/payment.json", "baseUrl": "http://localhost:3001" }
  ],
  "usage": "Use swagger_select_service with any alias to connect"
}
```

**활용 사례:** 대화 시작 시 사용 가능한 모든 서비스 확인.

---

### swagger://current/info

현재 연결된 서비스의 정보를 표시합니다.

**응답 예시:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "baseUrl": "http://localhost:3000",
  "title": "Auth API",
  "version": "1.0.0",
  "description": "Authentication and authorization service",
  "specVersion": "3.0.0",
  "endpointCount": 15,
  "tags": ["auth", "users", "tokens"]
}
```

**활용 사례:** 도구 호출 없이 현재 API를 빠르게 파악.

---

### swagger://current/endpoints

현재 서비스의 모든 API 엔드포인트 목록을 표시합니다.

**응답 예시:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "count": 15,
  "endpoints": [
    {
      "method": "POST",
      "path": "/auth/login",
      "summary": "User login",
      "tags": ["auth"],
      "operationId": "login"
    },
    {
      "method": "GET",
      "path": "/users/{id}",
      "summary": "Get user by ID",
      "tags": ["users"],
      "operationId": "getUserById"
    }
  ]
}
```

**활용 사례:** 분석 또는 코드 생성을 위한 전체 엔드포인트 목록 조회.

---

### swagger://current/schemas

현재 서비스의 모든 스키마/DTO 목록을 표시합니다.

**응답 예시:**
```json
{
  "source": "http://localhost:3000/api-docs",
  "count": 8,
  "schemas": [
    {
      "name": "User",
      "type": "object",
      "description": "User entity",
      "properties": ["id", "email", "name", "createdAt"]
    },
    {
      "name": "LoginRequest",
      "type": "object",
      "description": null,
      "properties": ["email", "password"]
    }
  ]
}
```

**활용 사례:** TypeScript 인터페이스 생성 또는 데이터 구조 이해.

---

## 리소스 사용 방법

### Claude Desktop에서

`@` 기호를 사용하여 메시지에 리소스를 첨부합니다:

```
@swagger://current/endpoints

사용자 관련 엔드포인트 찾아줘
```

### 대화에서

자연스럽게 리소스를 참조합니다:

```
사용자: 사용 가능한 서비스 목록 보여줘

Claude: (swagger://services 자동 읽기)
설정에 따르면 3개의 서비스가 있습니다...
```

## 리소스 vs 도구

| 항목 | 리소스 | 도구 |
|------|--------|------|
| 목적 | 데이터 제공 | 액션 수행 |
| 호출 방식 | 자동 또는 @ 사용 | 명시적 호출 |
| 읽기/쓰기 | 읽기 전용 | 상태 변경 가능 |
| 예시 | 모든 엔드포인트 목록 | 엔드포인트 테스트 |

## 팁

1. **리소스부터 시작하기**: `swagger://services`를 확인하여 세션 시작

2. **도구와 함께 사용**: 리소스로 컨텍스트를 얻고, 도구로 액션 수행:
   ```
   @swagger://current/endpoints
   로그인 엔드포인트 TypeScript 코드 생성해줘
   ```

3. **스키마 분석**: 타입 생성이나 데이터 구조 검증 시 `swagger://current/schemas` 활용
