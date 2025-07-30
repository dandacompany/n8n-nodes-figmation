# n8n-nodes-figmation

n8n custom nodes package for Figma workflow automation. Connects to Figma plugin via WebSocket server to execute 36 Figma API commands.

## 🎯 Core Architecture

```mermaid
graph TB
    subgraph "External AI Agent"
        A[AI Agent<br/>Claude/GPT/Gemini]
    end
    
    subgraph "n8n Workflow"
        B[MCP Server Trigger<br/>AI Agent Connection]
        C[n8n Command Node<br/>Figma Command Execution]
    end
    
    subgraph "Communication Layer"
        D[WebSocket Connector<br/>Real-time Communication]
    end
    
    subgraph "Figma Plugin"
        E[Figma Plugin<br/>Command Reception & Execution]
    end
    
    subgraph "Figma Design"
        F[Figma Canvas<br/>Design Output]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    style A fill:#ff6b6b
    style B fill:#4ecdc4
    style C fill:#45b7d1
    style D fill:#ffd93d
    style E fill:#96ceb4
    style F fill:#f8f9fa
```

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant AI as External AI Agent
    participant MCP as MCP Server Trigger
    participant CMD as n8n Command Node
    participant WS as WebSocket Connector
    participant PLG as Figma Plugin
    participant FIG as Figma Design
    
    Note over AI,FIG: 1. AI Agent sends natural language command
    AI->>MCP: "Create a blue button"
    MCP->>CMD: Parse and convert command
    
    Note over AI,FIG: 2. Execute Figma command in n8n
    CMD->>WS: Send create_rectangle command
    WS->>PLG: Forward command via WebSocket
    
    Note over AI,FIG: 3. Generate design in Figma
    PLG->>FIG: Call Figma API
    FIG->>PLG: Return created button
    PLG->>WS: Send execution result
    WS->>CMD: Receive result
    CMD->>MCP: Report completion
    MCP->>AI: Notify design completion
```

## ⚡ Key Features

- **36 Figma API Commands Support**: create_rectangle, create_text, move_node, and more
- **WebSocket Server**: Real-time communication with Figma plugin
- **Channel-based Isolation**: Multi-channel support for workflow separation
- **MCP Integration**: Tool nodes for AI agent compatibility
- **Dynamic UI**: Auto-generate parameter fields based on selected command
- **Localhost-only Connections**: Simplified configuration for enhanced security and stability
- **Fixed Host Configuration**: WebSocket host fixed to localhost for reliable local development

## 🏗️ Component Architecture

```mermaid
graph LR
    subgraph "AI Layer"
        A1[AI Agent<br/>Natural Language Commands]
    end
    
    subgraph "n8n Layer"
        B1[MCP Server Trigger<br/>AI Agent Connection Point]
        B2[Command Node<br/>Figma Command Processing]
    end
    
    subgraph "Communication Layer"
        C1[WebSocket Connector<br/>Real-time Bidirectional Communication]
    end
    
    subgraph "Figma Layer"
        D1[Figma Plugin<br/>Command Execution Engine]
        D2[Figma Design<br/>Final Output]
    end
    
    A1 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> D1
    D1 --> D2
    
    style A1 fill:#ff6b6b
    style B1 fill:#4ecdc4
    style B2 fill:#45b7d1
    style C1 fill:#ffd93d
    style D1 fill:#96ceb4
    style D2 fill:#f8f9fa
```

## 🎯 Node Architecture

```mermaid
mindmap
  root((n8n-nodes-figmation<br/>Node Architecture))
    FigmationConnector
      WebSocket Server Management
      Channel Creation & Management
      Plugin Registration
      Connection Event Triggering
    FigmationCommander
      36 Figma API Commands
      Dynamic Parameter UI
      Command Execution
      Result Handling
    FigmationCommanderTool
      MCP Protocol Support
      AI Agent Integration
      Tool Node Compatibility
      Natural Language Processing
    WebSocketServer
      Real-time Communication
      Channel Isolation
      Client Management
      Message Routing
```

## 📋 Changelog

### v1.2.1 (Latest)
- 🏠 **Localhost Only**: Simplified to localhost-only connections for better stability
- 🗑️ **Removed Complex Features**: Eliminated connection types, host configuration, and path settings
- 🔧 **Fixed Parameter Dependencies**: Resolved n8n displayOptions circular dependency issues
- ⚡ **Simplified WebSocket**: Direct port-based connections without paths
- 🛡️ **Enhanced Security**: Local-only connections prevent external access issues

### v1.2.0
- 🔗 **Connection Type Support**: Added standalone (port-based) and integrated (path-based) connection modes
- 🛣️ **Path-based WebSocket**: Support for WebSocket paths (e.g., `/ws`) for reverse proxy setups
- 🔧 **Enhanced Parameter Handling**: Fixed "Could not get parameter" errors with conditional UI fields
- 🌐 **Improved Domain Support**: Better handling of external domains and localhost path connections
- 📝 **Better Error Messages**: Enhanced logging and error reporting for connection issues

### v1.1.0
- ✨ **External Server Access**: Added support for cloud deployments and remote connections
- 🔧 **Flexible Host Configuration**: Configurable WebSocket host (localhost or 0.0.0.0)
- 🌐 **Cloud Deployment Support**: Enable n8n.cloud and custom domain connections
- 🔒 **Security Protocols**: Support for both ws:// and wss:// protocols
- 📚 **Enhanced Documentation**: Updated setup instructions for external access

### v1.0.0
- 🎉 **Initial Release**: 36 Figma API commands support
- 🔌 **WebSocket Communication**: Real-time connection with Figma plugin
- 📡 **Channel-based Isolation**: Multi-channel support for workflow separation
- 🤖 **MCP Integration**: Tool nodes for AI agent compatibility
- 🎨 **Dynamic UI**: Auto-generate parameter fields based on selected command

## Installation and Usage

### Development Environment Setup

```bash
# Install dependencies
npm install

# TypeScript build and asset copy
npm run build

# Development mode (watch mode)
npm run dev

# Install to n8n instance
./install.sh
```

### Using in n8n

1. Restart n8n instance
2. "Figma Connector" and "Figma Commander" nodes available
3. Build Figma event-based automation workflows

### Configuration

The nodes are configured for **localhost-only connections** for enhanced security and stability:

- **Host**: Fixed to `localhost` (cannot be changed)
- **Port**: Configurable (default: 3055)
- **Connection URL**: `ws://localhost:{port}` (no path)

This simplified configuration eliminates external server access issues and ensures reliable local development.

## Node Types

### FigmationConnector (Trigger Node)

Starts WebSocket server and manages connection with Figma plugin.

**Key Features:**
- Start/stop WebSocket server on localhost
- Channel creation and management
- Plugin registration and status monitoring
- Connection event triggering
- Simplified localhost-only configuration

### FigmationCommander (Action Node)

Main action node that executes Figma API commands.

**Supported Commands (36):**

#### Creation Commands
- `create_rectangle`: Create rectangle
- `create_frame`: Create frame
- `create_text`: Create text
- `create_circle`: Create circle
- `create_line`: Create line

#### Manipulation Commands
- `move_node`: Move node
- `resize_node`: Resize node
- `set_fill_color`: Set fill color
- `set_stroke_color`: Set stroke color
- `set_text_content`: Change text content

#### Information Commands
- `get_document_info`: Get document information
- `get_selection`: Get selected elements information
- `get_node_info`: Get specific node information

#### Management Commands
- `delete_node`: Delete node
- `clone_node`: Clone node
- `export_node_as_image`: Export node as image

### FigmationCommanderTool (Tool Node)

Tool node for AI agent compatibility. Supports MCP (Model Context Protocol) integration.

## Workflow Examples

### Basic Connection Workflow

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

### MCP Integration Workflow

Check `examples/mcp-workflow.json` file for complete MCP workflow with 36 tool nodes.

## Architecture

### WebSocket Communication Flow

```
n8n Workflow → FigmationCommander → WebSocketServer → Figma Plugin → Figma API
```

### Channel System

Each workflow provides isolated communication through unique channels:

1. **Channel Creation**: FigmationConnector creates a named channel
2. **Client Registration**: Figma plugin connects to a specific channel
3. **Command Routing**: FigmationCommander specifies channel ID for specific channel
4. **Isolation**: Each channel maintains separate client lists

## Development Guide

### Adding New Commands

1. Add command in `src/nodes/FigmationCommander/FigmationCommander.node.ts`:
```typescript
{
  name: 'New Command',
  value: 'new_command',
  description: 'Description for new command'
}
```

2. Define parameters: Add parameter fields to node's properties array

3. Add same command handler to Figma plugin (separate repository)

### Error Handling

- **Connection Failure**: Timeout and retry mechanisms
- **Command Timeout**: 10-second timeout and cleanup
- **Channel Error**: Channel existence and permission validation
- **Figma API Error**: Design mode validation and parameter checking

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **WebSocket**: ws library
- **Build Tool**: TypeScript compiler
- **Packaging**: npm

## License

MIT License

## Developer Information

- **Name**: Dante
- **Company**: Dante Labs
- **Email**: datapod.k@gmail.com
- **Company Homepage**: https://dante-datalab.com
- **YouTube**: https://youtube.com/@dante-labs

## Related Projects

- [figma-plugin-figmation](https://github.com/dandacompany/figma-plugin-figmation): Figma plugin

## Acknowledgments

This project was inspired by [Cursor Talk to Figma MCP](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp) by [@sonnylazuardi](https://github.com/sonnylazuardi). We extend our gratitude for the innovative MCP integration approach that enabled us to create an n8n workflow-compatible version for Figma automation.

Special thanks to the original project for demonstrating the power of Model Context Protocol (MCP) in bridging AI tools with design workflows. 