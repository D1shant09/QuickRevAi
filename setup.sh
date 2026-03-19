#!/bin/bash
echo "Installing server dependencies..."
cd server && npm install
echo "Installing client dependencies..."
cd ../client && npm install
echo "Setup complete. Add your credentials to server/.env before running."
