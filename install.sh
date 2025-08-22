#!/bin/bash

# Install script for SimpleSqlite n8n community node

echo "Installing SimpleSqlite n8n community node..."

# Build the project
echo "Building the node..."
npm install
npm run build

# Check if n8n nodes directory exists
N8N_NODES_DIR="$HOME/.n8n/nodes"
if [ ! -d "$N8N_NODES_DIR" ]; then
    echo "Creating n8n nodes directory: $N8N_NODES_DIR"
    mkdir -p "$N8N_NODES_DIR"
fi

# Initialize package.json if it doesn't exist
if [ ! -f "$N8N_NODES_DIR/package.json" ]; then
    echo "Initializing package.json in n8n nodes directory..."
    cd "$N8N_NODES_DIR"
    npm init -y > /dev/null 2>&1
    cd - > /dev/null
fi

# Install the node directly to n8n nodes directory
echo "Installing to n8n nodes directory: $N8N_NODES_DIR"
cd "$N8N_NODES_DIR"
npm install "$OLDPWD"

echo ""
echo "✅ SimpleSqlite node installed successfully!"
echo "📍 Installed to: $N8N_NODES_DIR/node_modules/n8n-nodes-simple-sqlite"
echo ""
echo "🔄 Restart your n8n instance to see the SimpleSqlite node in the nodes panel."
echo ""
echo "To uninstall, run:"
echo "  cd $N8N_NODES_DIR && npm uninstall n8n-nodes-simple-sqlite"
