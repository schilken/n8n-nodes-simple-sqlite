#!/bin/bash

# Install script for SimpleSqlite n8n community node

echo "Installing SimpleSqlite n8n community node..."

# Build the project
echo "Building the node..."
npm install
npm run build

DIST_DIR="./dist"

# Check if n8n custom directory exists
N8N_NODES_DIR="$HOME/.n8n/custom"
if [ ! -d "$N8N_NODES_DIR" ]; then
    echo "Creating n8n custom directory: $N8N_NODES_DIR"
    mkdir -p "$N8N_NODES_DIR"
fi

PACKAGE_NAME=$(node -p "require('./package.json').name")
# Install the node directly to n8n nodes directory
TARGET_DIR="$N8N_NODES_DIR/$PACKAGE_NAME"

echo "Installing to n8n nodes directory: $TARGET_DIR"
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
cp -r "$DIST_DIR/"* "$TARGET_DIR/"