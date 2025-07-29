#!/bin/bash

# n8n Figma WebSocket Nodes Installation Script

echo "🚀 Installing n8n-nodes-figmation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Create n8n custom directory if it doesn't exist
N8N_CUSTOM_DIR="$HOME/.n8n/custom"
if [ ! -d "$N8N_CUSTOM_DIR" ]; then
    echo "📁 Creating n8n custom directory..."
    mkdir -p "$N8N_CUSTOM_DIR"
fi

# Clean up existing installation
TARGET_DIR="$N8N_CUSTOM_DIR/n8n-nodes-figmation"
if [ -d "$TARGET_DIR" ]; then
    echo "🧹 Cleaning up existing installation..."
    echo "  📂 Removing: $TARGET_DIR"
    rm -rf "$TARGET_DIR"
    echo "  ✅ Cleanup completed"
fi

# Copy built nodes to n8n custom directory
echo "📋 Installing fresh copy to n8n custom directory..."
mkdir -p "$TARGET_DIR"
cp -r dist/* "$TARGET_DIR/"
cp package.json "$TARGET_DIR/"

# Copy icon files to n8n custom directory
echo "🎨 Copying icon files..."
for node_dir in dist/nodes/*/; do
    node_name=$(basename "$node_dir")
    if [ -f "dist/nodes/$node_name/figmation.png" ]; then
        cp "dist/nodes/$node_name/figmation.png" "$TARGET_DIR/nodes/$node_name/"
        echo "  ✅ Copied icon for $node_name"
    fi
done

# Clean up any legacy or conflicting node folders in n8n
echo "🔧 Checking for legacy node folders..."
LEGACY_FOLDERS=(
    "FigmationToolCommander"
    "FigmationCommanderTool"
    "FigmaWebSocketAction" 
    "FigmaWebSocketTrigger"
)

for legacy_folder in "${LEGACY_FOLDERS[@]}"; do
    legacy_path="$TARGET_DIR/nodes/$legacy_folder"
    if [ -d "$legacy_path" ]; then
        echo "  🗑️  Removing legacy folder: $legacy_folder"
        rm -rf "$legacy_path"
        echo "  ✅ Removed $legacy_folder"
    fi
done

echo "✅ Installation completed!"
echo ""
echo "📝 Next steps:"
echo "1. Restart your n8n instance"
echo "2. Look for the following nodes in the nodes panel:"
echo "   • Figmation Connector (WebSocket 서버)"
echo "   • Figmation Commander (일반 명령 실행)"
echo "3. Set up your Figma plugin to connect to the WebSocket server"
echo ""
echo "🔗 For more information, see README.md" 