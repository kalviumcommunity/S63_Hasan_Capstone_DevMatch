#!/bin/bash
set -e

echo "Starting Netlify build..."

# Install dependencies
echo "Installing dependencies..."
cd frontend
npm install --legacy-peer-deps

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
ls -la dist/ 