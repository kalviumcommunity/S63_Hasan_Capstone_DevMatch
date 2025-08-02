#!/bin/bash
set -e

echo "=== DevMatch Frontend Build Script ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Installing dependencies ==="
cd frontend
npm ci --legacy-peer-deps --no-audit

echo "=== Building application ==="
npm run build

echo "=== Build completed successfully ==="
ls -la dist/ 