#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! 🎉"
    echo ""
    echo "IMPORTANT: If you get a 'blocked request' error with ngrok,"
    echo "make sure your ngrok domain is added to vite.config.ts allowedHosts"
    echo ""
    echo "To serve the application for ngrok, run one of these commands:"
    echo ""
    echo "1. Using npm script:"
    echo "   npm run serve"
    echo ""
    echo "2. Using npx (direct):"
    echo "   npx vite preview --host 0.0.0.0 --port 4173"
    echo ""
    echo "3. Using serve (if installed globally):"
    echo "   npx serve -s dist -l 4173"
    echo ""
    echo "Then run ngrok:"
    echo "   ngrok http 4173"
    echo ""
    echo "Your ngrok URL will be something like:"
    echo "   https://fitting-singularly-heron.ngrok-free.app"
    echo ""
    echo "If you get connection errors, restart the server after running ngrok."
else
    echo "Build failed! ❌"
    exit 1
fi