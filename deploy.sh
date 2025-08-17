#!/bin/bash

# This script automates deployment to GitHub

echo "🚀 Starting deployment..."

# 1. Add all changes
git add .

# 2. Commit changes with a message you provide
# The "$1" takes the first argument you pass to the script
git commit -m "$1"

# 3. Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push

echo "✅ Deployment complete!"