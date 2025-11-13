# 채팅 API Postman 테스트 가이드

## 📋 개요
프론트엔드에서 사용하는 채팅 관련 REST API 엔드포인트 목록입니다.
백엔드 개발자가 Postman으로 테스트할 수 있도록 정리했습니다.

---

## 🔐 인증 설정

모든 API 요청에는 JWT 토큰이 필요합니다.

### 1단계: 로그인하여 토큰 받기

**로그인 API:**
```
POST http://localhost:8080/api/auth/login
```

**Request Body (JSON):**

방법 1: username 사용
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

방법 2: email 사용
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**예상 응답:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoi...",
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoi...",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "username": "user123",
    "fullName": "홍길동",
    ...
  }
}
```

**Postman 테스트:**
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "testuser",
  "password": "password123"
}
```
또는
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**응답에서 `access_token` 값을 복사하세요!**

---

### 2단계: Postman에 토큰 설정하기

**방법 1: Authorization 탭 사용 (권장)**
1. Collection 또는 Request의 **Authorization** 탭 선택
2. Type: **Bearer Token** 선택
3. Token: 위에서 받은 `access_token` 값 입력

**방법 2: Headers에 직접 추가**
```
Authorization: Bearer {access_token}
```

**방법 3: 환경 변수 사용 (여러 요청에 사용 시)**
1. Postman에서 **Environments** 생성
2. 변수명: `accessToken`
3. 각 Request에서 `{{accessToken}}` 사용

---

## 📡 REST API 엔드포인트

### 1. 채팅방 생성 및 입장
**프론트엔드에서 사용:** `ChatListPage.jsx` → `joinChatRoom()`

```
POST http://localhost:8080/api/chating/join?userId={userId}
```

**Query Parameters:**
- `userId` (required): 사용자 ID (예: 2)

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**예상 응답:**
```json
{
  "roomId": 1,
  "userId": 2,
  "createdAt": "2024-01-01T00:00:00",
  ...
}
```

**Postman 테스트:**
- Method: `POST`
- URL: `http://localhost:8080/api/chating/join?userId=2`
- Headers: `Authorization: Bearer {token}`

---

### 2. 텍스트 메시지 전송
**프론트엔드에서 사용:** `ChatInput.jsx` → `sendTextMessage()`

```
POST http://localhost:8080/api/chating/message/text
```

**Request Body (JSON):**
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "안녕하세요",
  "messageType": "TEXT",
  "metadata": null,
  "userId": 2,
  "adminId": null
}
```

**필수 필드:**
- `roomId`: 채팅방 ID (숫자)
- `userId`: 사용자 ID (숫자)
- `message`: 메시지 내용
- `sender`: "USER" 또는 "ADMIN"
- `messageType`: "TEXT"

**Postman 테스트:**
- Method: `POST`
- URL: `http://localhost:8080/api/chating/message/text`
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "테스트 메시지입니다",
  "messageType": "TEXT",
  "metadata": null,
  "userId": 2,
  "adminId": null
}
```

---

### 3. 이미지 메시지 전송
**프론트엔드에서 사용:** `ChatInput.jsx` → `sendImageMessage()`

```
POST http://localhost:8080/api/chating/message/image
```

**Request Body (JSON):**
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "https://example.com/image.jpg",
  "messageType": "IMAGE",
  "metadata": null,
  "userId": 2,
  "adminId": null
}
```

**필수 필드:**
- `roomId`: 채팅방 ID
- `userId`: 사용자 ID
- `message`: 이미지 URL
- `messageType`: "IMAGE"
- `sender`: "USER" 또는 "ADMIN"

**Postman 테스트:**
- Method: `POST`
- URL: `http://localhost:8080/api/chating/message/image`
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "https://example.com/image.jpg",
  "messageType": "IMAGE",
  "metadata": null,
  "userId": 2,
  "adminId": null
}
```

---

### 4. 파일 메시지 전송
**프론트엔드에서 사용:** `ChatInput.jsx` → `sendFileMessage()`

```
POST http://localhost:8080/api/chating/message/file
```

**Request Body (JSON):**
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "https://example.com/file.pdf",
  "messageType": "FILE",
  "metadata": {
    "fileName": "document.pdf",
    "fileSize": 1024000
  },
  "userId": 2,
  "adminId": null
}
```

**필수 필드:**
- `roomId`: 채팅방 ID
- `userId`: 사용자 ID
- `message`: 파일 URL
- `messageType`: "FILE"
- `sender`: "USER" 또는 "ADMIN"
- `metadata`: 파일 메타데이터 (선택)

**Postman 테스트:**
- Method: `POST`
- URL: `http://localhost:8080/api/chating/message/file`
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "https://example.com/file.pdf",
  "messageType": "FILE",
  "metadata": {
    "fileName": "document.pdf",
    "fileSize": 1024000
  },
  "userId": 2,
  "adminId": null
}
```

---

### 5. 채팅방 메시지 목록 조회
**프론트엔드에서 사용:** `ChatRoomPage.jsx` → `getChatMessages()`

```
GET http://localhost:8080/api/chating/messages?roomId={roomId}
```

**Query Parameters:**
- `roomId` (required): 채팅방 ID (예: 1)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**예상 응답:**
```json
[
  {
    "id": 1,
    "roomId": 1,
    "sender": "USER",
    "message": "안녕하세요",
    "messageType": "TEXT",
    "userId": 2,
    "adminId": null,
    "createdAt": "2024-01-01T00:00:00",
    ...
  }
]
```

**Postman 테스트:**
- Method: `GET`
- URL: `http://localhost:8080/api/chating/messages?roomId=1`
- Headers: `Authorization: Bearer {token}`

---

### 6. 관리자 채팅 목록 조회
**프론트엔드에서 사용:** `AdminChatListPage.jsx` → `getAdminChatList()`

```
GET http://localhost:8080/api/chating/admin
GET http://localhost:8080/api/chating/admin?adminId={adminId}
```

**Query Parameters:**
- `adminId` (optional): 관리자 ID

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**예상 응답:**
```json
[
  {
    "roomId": 1,
    "userId": 2,
    "otherUser": {
      "id": 2,
      "username": "user123",
      "fullName": "홍길동",
      "profileImageUrl": "https://example.com/profile.jpg"
    },
    "lastMessage": "안녕하세요",
    "lastMessageTime": "2024-01-01T00:00:00",
    "unreadCount": 3,
    ...
  }
]
```

**Postman 테스트:**
- Method: `GET`
- URL: `http://localhost:8080/api/chating/admin` 또는 `http://localhost:8080/api/chating/admin?adminId=1`
- Headers: `Authorization: Bearer {token}`

---

## 🔌 WebSocket (STOMP) 연결

**프론트엔드에서 사용:** `useChatSocket.js`

### 연결 정보
- **SockJS URL:** `http://localhost:8080/ws/chat`
- **프로토콜:** STOMP over SockJS
- **인증:** CONNECT 프레임의 `Authorization` 헤더에 JWT 토큰

### STOMP 구독 경로
```
/sub/chatroom/{roomId}
```

### STOMP 발행 경로
```
/pub/chat.sendMessage
```

### 발행 메시지 형식
```json
{
  "roomId": 1,
  "sender": "USER",
  "message": "안녕하세요",
  "messageType": "TEXT",
  "userId": 2,
  "adminId": null
}
```

**Postman WebSocket 테스트:**
1. Postman에서 **New Request** → **WebSocket** 선택
2. URL: `ws://localhost:8080/ws/chat`
3. 연결 후 STOMP CONNECT 프레임 전송:
```
CONNECT
Authorization:Bearer {jwt_token}
accept-version:1.2,1.1,1.0
heart-beat:4000,4000

```

---

## 📝 테스트 순서 추천

### 필수: 먼저 로그인하기
1. **로그인** → `POST /api/auth/login` → `access_token` 받기
2. Postman의 **Authorization** 탭에 토큰 설정

### 채팅 API 테스트
3. **채팅방 생성** → `POST /api/chating/join?userId=2`
4. **메시지 목록 조회** → `GET /api/chating/messages?roomId=1`
5. **텍스트 메시지 전송** → `POST /api/chating/message/text`
6. **WebSocket 연결 테스트** → `ws://localhost:8080/ws/chat`

---

## 💡 토큰 확인 방법

### 브라우저에서 토큰 확인 (개발자 도구)
1. 브라우저에서 로그인
2. 개발자 도구 (F12) → **Application** 탭
3. **Local Storage** → `http://localhost:5173` 선택
4. `accessToken` 키의 값이 JWT 토큰입니다

### 프론트엔드 코드에서 토큰 사용 위치
- **저장:** `src/services/auth.js` → `login()` 함수
- **사용:** `src/services/api.js` → interceptor에서 자동으로 헤더에 추가
- **저장소:** `localStorage.getItem("accessToken")`

---

## ⚠️ 주의사항

1. **모든 API는 JWT 토큰이 필요합니다.**
2. **401 에러 발생 시:** 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인하세요.
3. **403 에러 발생 시:** 접근 권한이 없습니다.
4. **ERR_NETWORK 에러:** 백엔드 서버가 실행 중인지 확인하세요.
5. **WebSocket 연결 실패:** 
   - JWT 토큰이 유효한지 확인
   - 서버의 WebSocket 설정 확인
   - CORS 설정 확인

---

## 🔍 프론트엔드 파일 위치

- **API 호출:** `src/services/chatApi.js`
- **WebSocket 연결:** `src/hooks/useChatSocket.js`
- **채팅방 목록:** `src/pages/ChatListPage.jsx`
- **채팅방 페이지:** `src/pages/ChatRoomPage.jsx`
- **관리자 채팅 목록:** `src/pages/AdminChatListPage.jsx`

---

## 📌 백엔드 구현 체크리스트

백엔드 개발자가 구현해야 할 엔드포인트:

- [ ] `POST /api/chating/join?userId={userId}` - 채팅방 생성
- [ ] `POST /api/chating/message/text` - 텍스트 메시지 전송
- [ ] `POST /api/chating/message/image` - 이미지 메시지 전송
- [ ] `POST /api/chating/message/file` - 파일 메시지 전송
- [ ] `GET /api/chating/messages?roomId={roomId}` - 메시지 목록 조회
- [ ] `GET /api/chating/admin` - 관리자 채팅 목록 조회
- [ ] `GET /api/chating/admin?adminId={adminId}` - 관리자별 채팅 목록 조회
- [ ] `WebSocket /ws/chat` - SockJS 엔드포인트
- [ ] `STOMP /sub/chatroom/{roomId}` - 채팅방 구독
- [ ] `STOMP /pub/chat.sendMessage` - 메시지 발행

