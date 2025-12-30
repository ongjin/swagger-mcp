# 서비스 관리

여러 API 서비스 연결을 관리하는 도구입니다.

## swagger_select_service

작업할 서비스를 선택합니다. `swagger-targets.json`의 alias 또는 직접 URL을 사용합니다.

**파라미터:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | string | 예 | 서비스 alias 또는 직접 URL |

**예시 프롬프트:**
- "petstore API에 연결해줘"
- "http://localhost:3000/api-docs 사용해줘"
- "payment 서비스로 전환해줘"

**응답 내용:**
- API 제목 및 버전
- 설명
- 서버 URL
- 총 엔드포인트 수
- 사용 가능한 태그

**실제 사용 예시:**
```
사용자: petstore API 연결해줘

Claude: [swagger_select_service name="petstore"]

✅ "petstore"에 연결됨
- 제목: Swagger Petstore
- 버전: 1.0.0
- 엔드포인트: 20개
- 태그: pet, store, user
```

---

## swagger_list_services

`swagger-targets.json`에 설정된 모든 서비스를 나열합니다.

**파라미터:** 없음

**예시 프롬프트:**
- "어떤 서비스가 있어?"
- "설정된 API 목록 보여줘"
- "서비스 리스트 보여줘"

**실제 사용 예시:**
```
사용자: 등록된 서비스 목록 보여줘

Claude: [swagger_list_services]

📋 등록된 서비스 (5개):
- auth: http://localhost:3000/api-docs
- payment: http://localhost:3001/api-docs
- order: http://localhost:3002/api-docs
- petstore: https://petstore.swagger.io/v2/swagger.json
- local: ./docs/openapi.yaml
```

---

## swagger_get_current

현재 선택된 서비스의 정보를 보여줍니다.

**파라미터:** 없음

**예시 프롬프트:**
- "지금 어떤 서비스에 연결되어 있어?"
- "현재 API 정보 보여줘"
- "현재 서비스가 뭐야?"

**실제 사용 예시:**
```
사용자: 지금 어떤 서비스에 연결되어 있어?

Claude: [swagger_get_current]

📌 현재 서비스: petstore
- URL: https://petstore.swagger.io/v2/swagger.json
- 제목: Swagger Petstore
- 버전: 1.0.6
- 엔드포인트: 20개
```
