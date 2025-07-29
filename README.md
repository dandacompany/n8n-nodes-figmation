# n8n-nodes-figmation

n8n custom nodes package for Figma workflow automation. Connects to Figma plugin via WebSocket server to execute 36 Figma API commands.

## Key Features

- **36 Figma API Commands Support**: create_rectangle, create_text, move_node, and more
- **WebSocket Server**: Real-time communication with Figma plugin
- **Channel-based Isolation**: Multi-channel support for workflow separation
- **MCP Integration**: Tool nodes for AI agent compatibility
- **Dynamic UI**: Auto-generate parameter fields based on selected command

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

## Node Types

### FigmationConnector (Trigger Node)

Starts WebSocket server and manages connection with Figma plugin.

**Key Features:**
- Start/stop WebSocket server
- Channel creation and management
- Plugin registration and status monitoring
- Connection event triggering

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