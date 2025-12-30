# 코드 생성

API 스펙에서 코드를 생성하는 도구입니다.

## swagger_generate_code

API 엔드포인트를 호출하기 위한 TypeScript 또는 JavaScript 코드를 axios 또는 fetch로 생성합니다.

**파라미터:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `method` | string | 예 | HTTP 메서드 (get, post, put, delete, patch) |
| `path` | string | 예 | 엔드포인트 경로 (예: /users/{id}) |
| `language` | string | 아니오 | 출력 언어: `typescript` (기본값) 또는 `javascript` |
| `httpClient` | string | 아니오 | HTTP 클라이언트: `axios` (기본값) 또는 `fetch` |

**예시 프롬프트:**
- "POST /pet TypeScript 코드 생성해줘"
- "GET /users/{id} axios 함수 만들어줘"
- "로그인 엔드포인트 fetch 코드 생성해줘"

**응답 내용:**
- Import 문
- TypeScript 인터페이스 (경로 파라미터, 쿼리 파라미터, 요청 바디, 응답)
- 적절한 타입이 지정된 async 함수
- 엔드포인트 설명이 포함된 JSDoc 주석

**실제 사용 예시:**
```
사용자: POST /pet TypeScript 코드 생성해줘

Claude: [swagger_generate_code method="post" path="/pet"]

📝 생성된 TypeScript 코드:

import axios, { AxiosResponse } from 'axios';

interface PostPetRequest {
  name: string;
  photoUrls: string[];
  status?: string;
}

/**
 * 스토어에 새 펫 추가
 */
export async function postPet(data: PostPetRequest): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet`;
  return axios.post(url, data);
}

// Note: BASE_URL 상수를 정의하거나 설정에서 import하세요
// const BASE_URL = 'http://localhost:8080';
```

---

### 경로 파라미터 포함

```
사용자: GET /pet/{petId} 코드 생성해줘

Claude: [swagger_generate_code method="get" path="/pet/{petId}"]

📝 생성된 TypeScript 코드:

import axios, { AxiosResponse } from 'axios';

interface GetPetByidPathParams {
  petId: number;
}

/**
 * ID로 펫 조회
 */
export async function getPetByid(pathParams: GetPetByidPathParams): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet/${pathParams.petId}`;
  return axios.get(url);
}
```

---

### 쿼리 파라미터 포함

```
사용자: GET /pet/findByStatus 코드 생성해줘

Claude: [swagger_generate_code method="get" path="/pet/findByStatus"]

📝 생성된 TypeScript 코드:

import axios, { AxiosResponse } from 'axios';

interface GetPetFindbystatusQueryParams {
  status?: string;
}

/**
 * 상태로 펫 검색
 */
export async function getPetFindbystatus(queryParams: GetPetFindbystatusQueryParams): Promise<AxiosResponse> {
  const url = `${BASE_URL}/pet/findByStatus`;
  return axios.get(url, { params: queryParams });
}
```

---

### Axios 대신 Fetch 사용

```
사용자: POST /pet fetch 코드 생성해줘

Claude: [swagger_generate_code method="post" path="/pet" httpClient="fetch"]

📝 생성된 TypeScript 코드:

interface PostPetRequest {
  name: string;
  photoUrls: string[];
  status?: string;
}

/**
 * 스토어에 새 펫 추가
 */
export async function postPet(data: PostPetRequest): Promise<Response> {
  return fetch(`${BASE_URL}/pet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
```

---

### JavaScript 출력

```
사용자: GET /pet/{petId} JavaScript 코드 생성해줘

Claude: [swagger_generate_code method="get" path="/pet/{petId}" language="javascript"]

📝 생성된 JavaScript 코드:

import axios from 'axios';

/**
 * ID로 펫 조회
 */
export async function getPetByid(pathParams) {
  const url = `${BASE_URL}/pet/${pathParams.petId}`;
  return axios.get(url);
}
```

::: tip
생성된 코드는 시작점을 제공합니다. 다음 사항을 조정해야 할 수 있습니다:
- `BASE_URL` 상수 정의
- 에러 처리 추가
- 헤더 커스터마이징 (예: 인증)
- 프로젝트 설정에 맞게 타입 정의 조정
:::

::: info 지원 기능
- **경로 파라미터**: URL 템플릿에 자동 포함
- **쿼리 파라미터**: axios config 또는 URLSearchParams로 전달
- **요청 바디**: POST, PUT, PATCH 메서드용
- **TypeScript 인터페이스**: OpenAPI 스키마에서 생성
:::
