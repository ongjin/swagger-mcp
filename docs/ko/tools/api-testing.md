# API 테스트

API를 테스트하고 cURL 명령어를 생성하는 도구입니다.

## swagger_test

API에 실제 HTTP 요청을 실행합니다.

**파라미터:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `method` | string | 예 | HTTP 메서드 |
| `path` | string | 예 | 엔드포인트 경로 |
| `pathParams` | object | 아니오 | 경로 파라미터 값 |
| `queryParams` | object | 아니오 | 쿼리 파라미터 값 |
| `headers` | object | 아니오 | 요청 헤더 |
| `body` | object | 아니오 | 요청 바디 (JSON) |

**예시 프롬프트:**
- "GET /pet/1 호출해봐"
- "name이 'doggie'인 POST /pet 테스트해봐"
- "createUser 엔드포인트 실행해봐"

**응답 내용:**
- HTTP 상태 코드
- 응답 헤더
- 응답 바디
- 요청 소요 시간
- 생성된 cURL 명령어

**실제 사용 예시:**
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

::: warning 주의
이 도구는 실제 HTTP 요청을 실행합니다. 데이터를 수정하는 엔드포인트를 테스트할 때는 주의하세요.
:::

### 고급 사용법

**쿼리 파라미터 포함:**
```
사용자: status가 'available'인 펫 검색해줘

Claude: [swagger_test method="GET" path="/pet/findByStatus" queryParams={"status":"available"}]
```

**요청 바디 포함:**
```
사용자: 'Max'라는 이름의 새 펫 생성해줘

Claude: [swagger_test method="POST" path="/pet" body={"name":"Max","photoUrls":["http://example.com/max.jpg"],"status":"available"}]
```

**커스텀 헤더 포함:**
```
사용자: bearer 토큰으로 API 호출해줘

Claude: [swagger_test method="GET" path="/pet/1" headers={"Authorization":"Bearer xxx"}]
```

---

## swagger_curl

엔드포인트에 대한 cURL 명령어를 생성합니다.

**파라미터:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `method` | string | 예 | HTTP 메서드 |
| `path` | string | 예 | 엔드포인트 경로 |
| `pathParams` | object | 아니오 | 경로 파라미터 값 |
| `queryParams` | object | 아니오 | 쿼리 파라미터 값 |
| `headers` | object | 아니오 | 요청 헤더 |
| `body` | object | 아니오 | 요청 바디 (JSON) |

**예시 프롬프트:**
- "GET /pet/1 curl 만들어줘"
- "펫 생성하는 curl 명령어 만들어줘"
- "POST /pet curl 줘"

**실제 사용 예시:**
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

::: tip
생성된 cURL 명령어를 터미널에 바로 복사해서 수동 테스트하거나 스크립트에 통합할 수 있습니다.
:::
