# n8n-nodes-figmation 사용 가이드

이 문서는 n8n-nodes-figmation 프로젝트의 상세한 사용 방법을 제공합니다.

## 📋 목차

1. [시작하기](#시작하기)
2. [노드별 상세 가이드](#노드별-상세-가이드)
3. [워크플로우 예시](#워크플로우-예시)
4. [MCP 연동](#mcp-연동)
5. [문제 해결](#문제-해결)

## 🚀 시작하기

### 1. 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd n8n-nodes-figmation

# 의존성 설치 및 빌드
npm install
npm run build

# n8n에 설치
./install.sh
```

### 2. n8n 재시작

설치 후 n8n 인스턴스를 재시작하여 새 노드들을 인식하도록 합니다.

### 3. 노드 확인

n8n 워크플로우 편집기에서 다음 노드들이 나타나는지 확인:
- FigmationConnector
- FigmationCommander
- FigmationStrategy

## 🔧 노드별 상세 가이드

### FigmationConnector

#### 기본 설정

1. **서버 설정**
   - WebSocket Port: 3055 (기본값)
   - WebSocket Host: localhost (기본값)
   - Webhook Port: 3056 (기본값)
   - Webhook Host: localhost (기본값)

2. **채널 설정**
   - Channel ID: 자동 생성 또는 수동 입력
   - Channel Name: 선택사항

3. **이벤트 설정**
   - Event Types: 수신할 이벤트 선택
     - ✅ Webhook Commands
     - ✅ Figma Events
     - ✅ Connection Events

#### 사용 예시

```javascript
// 워크플로우에서 이벤트 처리
if ($json.eventType === 'webhook_command') {
  // 웹훅 명령 처리
  return {
    command: $json.command,
    params: $json.params,
    channelId: $json.channelId
  };
} else if ($json.eventType === 'figma_event') {
  // Figma 이벤트 처리
  return {
    figmaData: $json.data,
    timestamp: $json.timestamp
  };
}
```

### FigmationCommander

#### 연결 설정

1. **연결 방법 선택**
   - Use Existing Server Connection: 기존 서버 연결 사용
   - Inherit from Previous Node: 이전 노드에서 상속

2. **명령 선택**
   - 40+ 개의 Figma 명령 중 선택
   - 명령별 매개변수 설정

#### 주요 명령 카테고리

##### 기본 도형 생성
```javascript
// 사각형 생성
{
  "command": "create_rectangle",
  "params": {
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 150,
    "name": "My Rectangle"
  }
}

// 프레임 생성
{
  "command": "create_frame",
  "params": {
    "x": 0,
    "y": 0,
    "width": 400,
    "height": 300,
    "name": "Main Frame"
  }
}
```

##### UI 컴포넌트 생성
```javascript
// 버튼 생성
{
  "command": "create_button",
  "params": {
    "x": 50,
    "y": 50,
    "width": 120,
    "height": 40,
    "text": "Click Me",
    "name": "Primary Button"
  }
}

// 입력 필드 생성
{
  "command": "create_input_field",
  "params": {
    "x": 50,
    "y": 100,
    "width": 200,
    "height": 32,
    "placeholder": "Enter text...",
    "name": "Text Input"
  }
}
```

##### 노드 조작
```javascript
// 노드 이동
{
  "command": "move_node",
  "params": {
    "nodeId": "node_id_here",
    "x": 200,
    "y": 200
  }
}

// 노드 크기 조정
{
  "command": "resize_node",
  "params": {
    "nodeId": "node_id_here",
    "width": 300,
    "height": 200
  }
}
```

##### 정보 조회
```javascript
// 선택된 요소 조회
{
  "command": "get_selection",
  "params": {}
}

// 노드 상세 정보 조회
{
  "command": "get_node_info",
  "params": {
    "nodeId": "node_id_here"
  }
}
```

### FigmationStrategy

#### 전략 타입

1. **Reaction to Connector Strategy**
   - 프로토타입 반응을 시각적 커넥터로 변환
   - 단계별 프로세스 제공

2. **Design System Strategy**
   - 디자인 시스템 구현 가이던스
   - 컴포넌트 아키텍처 설계

3. **Component Library Strategy**
   - 컴포넌트 라이브러리 조직
   - Atomic Design 원칙 적용

4. **Custom Strategy**
   - 사용자 정의 전략
   - 마크다운 형식 지원

#### 출력 형식

- **Full Strategy Document**: 완전한 전략 문서
- **Process Steps Only**: 단계별 프로세스만
- **Summary**: 전략 요약

## 🔄 워크플로우 예시

### 1. 기본 Figma 자동화

```json
{
  "name": "Basic Figma Automation",
  "nodes": [
    {
      "type": "CUSTOM.figmationConnector",
      "name": "Figma Connector",
      "parameters": {
        "websocketPort": 3055,
        "webhookPort": 3056,
        "eventTypes": ["webhook_command", "figma_event"]
      }
    },
    {
      "type": "n8n-nodes-base.switch",
      "name": "Event Router",
      "parameters": {
        "rules": {
          "rules": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "id": "eventType",
                    "leftValue": "={{ $json.eventType }}",
                    "rightValue": "webhook_command",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              }
            }
          ]
        }
      }
    },
    {
      "type": "CUSTOM.figmationCommander",
      "name": "Execute Command",
      "parameters": {
        "connectionMethod": "inherit",
        "command": "get_selection"
      }
    }
  ]
}
```

### 2. MCP 연동 워크플로우

```json
{
  "name": "MCP Figma Integration",
  "nodes": [
    {
      "type": "@n8n/n8n-nodes-langchain.mcpTrigger",
      "name": "MCP Server Trigger"
    },
    {
      "type": "CUSTOM.figmationCommanderTool",
      "name": "Create UI Component",
      "parameters": {
        "toolDescription": "Creates UI components in Figma based on requirements",
        "command": "create_button",
        "parameters": {
          "params": {
            "x": "={{ $fromAI('X Position', 'X coordinate for button placement', 'number') }}",
            "y": "={{ $fromAI('Y Position', 'Y coordinate for button placement', 'number') }}",
            "width": "={{ $fromAI('Width', 'Button width in pixels', 'number') }}",
            "height": "={{ $fromAI('Height', 'Button height in pixels', 'number') }}",
            "text": "={{ $fromAI('Button Text', 'Text to display on button', 'string') }}"
          }
        }
      }
    },
    {
      "type": "CUSTOM.figmationStrategyTool",
      "name": "Design Strategy",
      "parameters": {
        "toolDescription": "Provides design system implementation strategy",
        "strategyType": "design_system",
        "outputFormat": "full"
      }
    }
  ]
}
```

### 3. 반응형 UI 생성

```json
{
  "name": "Responsive UI Generation",
  "nodes": [
    {
      "type": "CUSTOM.figmationConnector",
      "name": "Figma Connector"
    },
    {
      "type": "CUSTOM.figmationCommander",
      "name": "Create Frame",
      "parameters": {
        "command": "create_frame",
        "parameters": {
          "params": {
            "x": 0,
            "y": 0,
            "width": 375,
            "height": 812,
            "name": "Mobile Screen"
          }
        }
      }
    },
    {
      "type": "CUSTOM.figmationCommander",
      "name": "Create Header",
      "parameters": {
        "command": "create_rectangle",
        "parameters": {
          "params": {
            "x": 0,
            "y": 0,
            "width": 375,
            "height": 80,
            "name": "Header"
          }
        }
      }
    },
    {
      "type": "CUSTOM.figmationCommander",
      "name": "Create Button",
      "parameters": {
        "command": "create_button",
        "parameters": {
          "params": {
            "x": 20,
            "y": 100,
            "width": 335,
            "height": 48,
            "text": "Get Started",
            "name": "Primary Button"
          }
        }
      }
    }
  ]
}
```

## 🔗 MCP 연동

### MCP 서버 설정

1. **MCP 서버 설치**
```bash
npm install -g @modelcontextprotocol/server
```

2. **MCP 설정 파일**
```json
{
  "mcpServers": {
    "figmation": {
      "command": "n8n",
      "args": ["start"],
      "env": {
        "N8N_WORKFLOW": "path/to/figmation-workflow.json"
      }
    }
  }
}
```

### Tool 타입 노드 사용

#### FigmationCommander Tool
```javascript
// MCP 클라이언트에서 호출
const result = await mcpClient.callTool({
  name: "figmation_commander",
  arguments: {
    command: "create_rectangle",
    params: {
      x: 100,
      y: 100,
      width: 200,
      height: 150
    }
  }
});
```

#### FigmationStrategy Tool
```javascript
// 전략 가이던스 요청
const strategy = await mcpClient.callTool({
  name: "figmation_strategy",
  arguments: {
    strategyType: "design_system",
    outputFormat: "full"
  }
});
```

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 연결 실패
**증상**: WebSocket 연결이 실패하거나 Figma 플러그인이 연결되지 않음

**해결 방법**:
- 포트가 사용 가능한지 확인: `lsof -i :3055`
- 방화벽 설정 확인
- Figma 플러그인 재시작

#### 2. 명령 실행 실패
**증상**: FigmationCommander에서 명령이 실행되지 않음

**해결 방법**:
- Figma 플러그인이 연결되어 있는지 확인
- 명령 매개변수가 올바른지 확인
- 로그에서 오류 메시지 확인

#### 3. MCP 연동 문제
**증상**: MCP 서버에서 Tool 노드가 인식되지 않음

**해결 방법**:
- Tool 타입 노드가 올바르게 설정되었는지 확인
- MCP 서버가 실행 중인지 확인
- 워크플로우 연결이 올바른지 확인

### 디버깅 팁

#### 1. 로그 확인
```bash
# n8n 로그 확인
tail -f ~/.n8n/logs/n8n.log

# WebSocket 서버 로그
# FigmationConnector 노드의 로그 출력 확인
```

#### 2. 상태 확인
```bash
# WebSocket 서버 상태
curl http://localhost:3056/status

# 포트 사용 확인
netstat -an | grep 3055
netstat -an | grep 3056
```

#### 3. 테스트 연결
```javascript
// WebSocket 연결 테스트
const ws = new WebSocket('ws://localhost:3055');
ws.onopen = () => console.log('Connected');
ws.onerror = (error) => console.error('Connection failed:', error);
```

### 성능 최적화

#### 1. 배치 처리
여러 명령을 한 번에 실행하려면:
```javascript
// 여러 명령을 순차적으로 실행
const commands = [
  { command: 'create_rectangle', params: {...} },
  { command: 'create_text', params: {...} },
  { command: 'move_node', params: {...} }
];

for (const cmd of commands) {
  await executeCommand(cmd);
}
```

#### 2. 연결 재사용
WebSocket 연결을 재사용하여 성능 향상:
```javascript
// 연결 풀 사용
const connectionPool = new Map();

function getConnection(channelId) {
  if (!connectionPool.has(channelId)) {
    connectionPool.set(channelId, createConnection(channelId));
  }
  return connectionPool.get(channelId);
}
```

## 📚 추가 리소스

### 공식 문서
- [n8n 공식 문서](https://docs.n8n.io/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [MCP 공식 문서](https://modelcontextprotocol.io/)

### 예시 프로젝트
- [기본 워크플로우 예시](./examples/connector-workflow.json)
- [MCP 워크플로우 예시](./examples/mcp-workflow.json)

### 커뮤니티
- [n8n 커뮤니티](https://community.n8n.io/)
- [GitHub Issues](https://github.com/your-repo/n8n-nodes-figmation/issues)

## 🔄 업데이트 및 유지보수

### 정기 업데이트
- n8n 버전 호환성 확인
- Figma API 변경사항 반영
- 보안 패치 적용

### 버그 리포트
버그를 발견하거나 개선 제안이 있으시면:
1. GitHub Issues에 상세한 설명과 함께 리포트
2. 재현 가능한 최소 예시 제공
3. 환경 정보 포함 (n8n 버전, OS 등)

### 기여하기
프로젝트에 기여하고 싶으시면:
1. Fork 후 개발 브랜치 생성
2. 변경사항 구현 및 테스트
3. Pull Request 생성

---

이 가이드를 통해 n8n-nodes-figmation을 효과적으로 활용하시기 바랍니다. 추가 질문이나 도움이 필요하시면 언제든지 GitHub Issues를 통해 문의해 주세요. 