#!/bin/bash

# Remove node_modules if it exists
if [ -d "node_modules" ]; then
  echo "Removing existing node_modules directory..."
  rm -rf node_modules
fi

# Remove package-lock.json if it exists
if [ -f "package-lock.json" ]; then
  echo "Removing package-lock.json..."
  rm package-lock.json
fi

# Install Python dependencies if needed for node-gyp
echo "Installing Python dependencies..."
pip3 install setuptools

# Install dependencies with legacy peer deps flag
echo "Installing npm dependencies..."
npm install --legacy-peer-deps

echo "Setup complete!"
