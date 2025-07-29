# n8n-nodes-figmation Usage Guide

This document provides detailed usage instructions for the n8n-nodes-figmation project.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Detailed Node Guides](#detailed-node-guides)
3. [Workflow Examples](#workflow-examples)
4. [MCP Integration](#mcp-integration)
5. [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### 1. Installation

```bash
# Clone project
git clone <repository-url>
cd n8n-nodes-figmation

# Install dependencies and build
npm install
npm run build

# Install to n8n
./install.sh
```

### 2. Restart n8n

After installation, restart your n8n instance to recognize the new nodes.

### 3. Verify Nodes

Check that the following nodes appear in the n8n workflow editor:
- FigmationConnector
- FigmationCommander
- FigmationStrategy

## 🔧 Detailed Node Guides

### FigmationConnector

#### Basic Configuration

1. **Server Settings**
   - WebSocket Port: 3055 (default)
   - WebSocket Host: localhost (default)
   - Webhook Port: 3056 (default)
   - Webhook Host: localhost (default)

2. **Channel Settings**
   - Channel ID: Auto-generated or manual input
   - Channel Name: Optional

3. **Event Settings**
   - Event Types: Select events to receive
     - ✅ Webhook Commands
     - ✅ Figma Events
     - ✅ Connection Events

#### Usage Example

```javascript
// Handle events in workflow
if ($json.eventType === 'webhook_command') {
  // Handle webhook command
  return {
    command: $json.command,
    params: $json.params,
    channelId: $json.channelId
  };
} else if ($json.eventType === 'figma_event') {
  // Handle Figma event
  return {
    figmaData: $json.data,
    timestamp: $json.timestamp
  };
}
```

### FigmationCommander

#### Connection Settings

1. **Connection Method Selection**
   - Use Existing Server Connection: Use existing server connection
   - Inherit from Previous Node: Inherit from previous node

2. **Command Selection**
   - Choose from 40+ Figma commands
   - Set parameters for each command

#### Major Command Categories

##### Basic Shape Creation
```javascript
// Create rectangle
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

// Create frame
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

##### UI Component Creation
```javascript
// Create button
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

// Create input field
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

##### Node Manipulation
```javascript
// Move node
{
  "command": "move_node",
  "params": {
    "nodeId": "node_id_here",
    "x": 200,
    "y": 200
  }
}

// Resize node
{
  "command": "resize_node",
  "params": {
    "nodeId": "node_id_here",
    "width": 300,
    "height": 200
  }
}
```

##### Information Retrieval
```javascript
// Get selected elements
{
  "command": "get_selection",
  "params": {}
}

// Get detailed node information
{
  "command": "get_node_info",
  "params": {
    "nodeId": "node_id_here"
  }
}
```

### FigmationStrategy

#### Strategy Types

1. **Reaction to Connector Strategy**
   - Convert prototype reactions to visual connectors
   - Provides step-by-step process

2. **Design System Strategy**
   - Design system implementation guidance
   - Component architecture design

3. **Component Library Strategy**
   - Component library organization
   - Atomic Design principles application

4. **Custom Strategy**
   - User-defined strategies
   - Markdown format support

#### Output Formats

- **Full Strategy Document**: Complete strategy document
- **Process Steps Only**: Step-by-step process only
- **Summary**: Strategy summary

## 🔄 Workflow Examples

### 1. Basic Figma Automation

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

### 2. MCP Integration Workflow

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

### 3. Responsive UI Generation

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

## 🔗 MCP Integration

### MCP Server Setup

1. **Install MCP Server**
```bash
npm install -g @modelcontextprotocol/server
```

2. **MCP Configuration File**
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

### Using Tool Type Nodes

#### FigmationCommander Tool
```javascript
// Call from MCP client
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
// Request strategy guidance
const strategy = await mcpClient.callTool({
  name: "figmation_strategy",
  arguments: {
    strategyType: "design_system",
    outputFormat: "full"
  }
});
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Failure
**Symptoms**: WebSocket connection fails or Figma plugin cannot connect

**Solutions**:
- Check if port is available: `lsof -i :3055`
- Verify firewall settings
- Restart Figma plugin

#### 2. Command Execution Failure
**Symptoms**: Commands don't execute in FigmationCommander

**Solutions**:
- Check if Figma plugin is connected
- Verify command parameters are correct
- Check error messages in logs

#### 3. MCP Integration Issues
**Symptoms**: Tool nodes not recognized by MCP server

**Solutions**:
- Verify Tool type nodes are configured correctly
- Check if MCP server is running
- Verify workflow connections are correct

### Debugging Tips

#### 1. Check Logs
```bash
# Check n8n logs
tail -f ~/.n8n/logs/n8n.log

# WebSocket server logs
# Check log output from FigmationConnector node
```

#### 2. Status Check
```bash
# WebSocket server status
curl http://localhost:3056/status

# Check port usage
netstat -an | grep 3055
netstat -an | grep 3056
```

#### 3. Test Connection
```javascript
// Test WebSocket connection
const ws = new WebSocket('ws://localhost:3055');
ws.onopen = () => console.log('Connected');
ws.onerror = (error) => console.error('Connection failed:', error);
```

### Performance Optimization

#### 1. Batch Processing
To execute multiple commands at once:
```javascript
// Execute multiple commands sequentially
const commands = [
  { command: 'create_rectangle', params: {...} },
  { command: 'create_text', params: {...} },
  { command: 'move_node', params: {...} }
];

for (const cmd of commands) {
  await executeCommand(cmd);
}
```

#### 2. Connection Reuse
Improve performance by reusing WebSocket connections:
```javascript
// Use connection pool
const connectionPool = new Map();

function getConnection(channelId) {
  if (!connectionPool.has(channelId)) {
    connectionPool.set(channelId, createConnection(channelId));
  }
  return connectionPool.get(channelId);
}
```

## 📚 Additional Resources

### Official Documentation
- [n8n Official Documentation](https://docs.n8n.io/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [MCP Official Documentation](https://modelcontextprotocol.io/)

### Example Projects
- [Basic Workflow Examples](./examples/connector-workflow.json)
- [MCP Workflow Examples](./examples/mcp-workflow.json)

### Community
- [n8n Community](https://community.n8n.io/)
- [GitHub Issues](https://github.com/your-repo/n8n-nodes-figmation/issues)

## 🔄 Updates and Maintenance

### Regular Updates
- Check n8n version compatibility
- Reflect Figma API changes
- Apply security patches

### Bug Reports
If you find bugs or have improvement suggestions:
1. Report with detailed description in GitHub Issues
2. Provide reproducible minimal examples
3. Include environment information (n8n version, OS, etc.)

### Contributing
To contribute to the project:
1. Fork and create development branch
2. Implement changes and test
3. Create Pull Request

---

Use this guide to effectively utilize n8n-nodes-figmation. For additional questions or help, please contact us through GitHub Issues anytime. 