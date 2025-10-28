#!/bin/bash
# Build script для Railway
set -e

echo "📦 Installing dependencies..."
cd /app
pnpm install

echo "🔨 Building packages..."
pnpm --filter @frogface/core-mcp build

echo "✅ Build complete!"

