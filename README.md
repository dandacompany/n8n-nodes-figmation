# n8n-nodes-figmation

n8n 워크플로우 자동화를 위한 Figma 커스텀 노드 패키지입니다. WebSocket 서버를 통해 Figma 플러그인과 연결되어 36개의 Figma API 명령을 실행할 수 있습니다.

## 주요 기능

- **36개 Figma API 명령 지원**: create_rectangle, create_text, move_node 등
- **WebSocket 서버**: Figma 플러그인과의 실시간 통신
- **채널 기반 격리**: 워크플로우별 멀티 채널 지원
- **MCP 통합**: AI 에이전트와의 호환성을 위한 도구 노드
- **동적 UI**: 선택한 명령에 따라 파라미터 필드 자동 생성

## 설치 및 사용법

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# TypeScript 빌드 및 에셋 복사
npm run build

# 개발 모드 (감시 모드)
npm run dev

# n8n 인스턴스에 설치
./install.sh
```

### n8n에서 사용

1. n8n 인스턴스 재시작
2. "Figma Connector" 및 "Figma Commander" 노드 사용 가능
3. 워크플로우에서 Figma 이벤트 기반 자동화 구축

## 노드 타입

### FigmationConnector (트리거 노드)

WebSocket 서버를 시작하고 Figma 플러그인과의 연결을 관리합니다.

**주요 기능:**
- WebSocket 서버 시작/중지
- 채널 생성 및 관리
- 플러그인 등록 및 상태 모니터링
- 연결 이벤트 트리거

### FigmationCommander (액션 노드)

Figma API 명령을 실행하는 메인 액션 노드입니다.

**지원 명령 (36개):**

#### 생성 명령
- `create_rectangle`: 사각형 생성
- `create_frame`: 프레임 생성
- `create_text`: 텍스트 생성
- `create_circle`: 원형 생성
- `create_line`: 선 생성

#### 조작 명령
- `move_node`: 노드 이동
- `resize_node`: 노드 크기 조정
- `set_fill_color`: 채우기 색상 설정
- `set_stroke_color`: 테두리 색상 설정
- `set_text_content`: 텍스트 내용 변경

#### 정보 명령
- `get_document_info`: 문서 정보 조회
- `get_selection`: 선택된 요소 정보
- `get_node_info`: 특정 노드 정보

#### 관리 명령
- `delete_node`: 노드 삭제
- `clone_node`: 노드 복제
- `export_node_as_image`: 노드를 이미지로 내보내기

### FigmationCommanderTool (도구 노드)

AI 에이전트와의 호환성을 위한 도구 노드입니다. MCP(Model Context Protocol) 통합을 지원합니다.

## 워크플로우 예제

### 기본 연결 워크플로우

```json
{
  "nodes": [
    {
      "type": "CUSTOM.figmationConnector",
      "position": [100, 100],
      "parameters": {
        "port": 3055,
        "channelName": "my-project"
      }
    },
    {
      "type": "CUSTOM.figmationCommander",
      "position": [300, 100],
      "parameters": {
        "command": "create_rectangle",
        "params": {
          "x": 100,
          "y": 100,
          "width": 200,
          "height": 150,
          "name": "My Rectangle"
        }
      }
    }
  ]
}
```

### MCP 통합 워크플로우

`examples/mcp-workflow.json` 파일에서 36개 도구 노드가 포함된 완전한 MCP 워크플로우를 확인할 수 있습니다.

## 아키텍처

### WebSocket 통신 흐름

```
n8n 워크플로우 → FigmationCommander → WebSocketServer → Figma 플러그인 → Figma API
```

### 채널 시스템

각 워크플로우는 고유한 채널을 통해 격리된 통신을 제공합니다:

1. **채널 생성**: FigmationConnector가 이름이 있는 채널 생성
2. **클라이언트 등록**: Figma 플러그인이 특정 채널에 연결
3. **명령 라우팅**: FigmationCommander가 채널 ID로 특정 채널 지정
4. **격리**: 각 채널은 별도의 클라이언트 목록 유지

## 개발 가이드

### 새로운 명령 추가

1. `src/nodes/FigmationCommander/FigmationCommander.node.ts`에 명령 추가:
```typescript
{
  name: 'New Command',
  value: 'new_command',
  description: '새 명령에 대한 설명'
}
```

2. 파라미터 정의: 노드의 properties 배열에 파라미터 필드 추가

3. Figma 플러그인에도 동일한 명령 핸들러 추가 (별도 레포지토리)

### 에러 처리

- **연결 실패**: 타임아웃 및 재시도 메커니즘
- **명령 타임아웃**: 10초 타임아웃 및 정리
- **채널 에러**: 채널 존재 및 권한 검증
- **Figma API 에러**: 디자인 모드 검증 및 파라미터 체크

## 기술 스택

- **런타임**: Node.js
- **언어**: TypeScript
- **WebSocket**: ws 라이브러리
- **빌드 도구**: TypeScript 컴파일러
- **패키징**: npm

## 라이선스

MIT License

## 관련 프로젝트

- [figma-plugin-figmation](https://github.com/dandacompany/figma-plugin-figmation): Figma 플러그인 