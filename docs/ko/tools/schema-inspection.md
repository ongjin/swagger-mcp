# 스키마 조회

데이터 스키마와 DTO를 조회하는 도구입니다.

## swagger_get_schema

스키마/DTO의 상세 구조를 가져옵니다.

**파라미터:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `schemaName` | string | 예 | 조회할 스키마 이름 |

**예시 프롬프트:**
- "Pet 스키마 보여줘"
- "Order 구조가 어떻게 돼?"
- "User DTO 가져와"

**응답 내용:**
- 전체 스키마 정의
- 프로퍼티 타입 및 제약조건
- 필수 필드
- 중첩 참조

**실제 사용 예시:**
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

::: tip TypeScript 인터페이스 생성
스키마 정보를 활용하여 TypeScript 인터페이스를 생성할 수 있습니다:

```
사용자: Pet 스키마를 TypeScript 인터페이스로 변환해줘

Claude: [swagger_get_schema로 스키마 조회 후 변환]

interface Pet {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
```
:::

---

## swagger_list_schemas

현재 서비스의 모든 스키마를 나열합니다.

**파라미터:** 없음

**예시 프롬프트:**
- "어떤 스키마가 있어?"
- "모든 DTO 보여줘"
- "데이터 모델 보여줘"

**실제 사용 예시:**
```
사용자: 모든 스키마 보여줘

Claude: [swagger_list_schemas]

📋 사용 가능한 스키마 (6개):
- Pet
- Category
- Tag
- Order
- User
- ApiResponse
```
