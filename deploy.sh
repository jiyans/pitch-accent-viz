#!/bin/bash
# Script to deploy pitch-accent-viz application
# Usage: ./deploy.sh

REMOTE_HOST="jiyanjs"
APP_DIR="/home/ubuntu/websites/pitch-accent-viz"

echo "Starting deployment..."

# Connect to remote server and execute commands
ssh $REMOTE_HOST "
    cd $APP_DIR || { echo 'Error: Unable to navigate to $APP_DIR'; exit 1; }
    echo 'Current directory:' \$(pwd)

    # Pull latest changes
    echo 'Pulling latest changes...'
    git pull

    # Install dependencies if needed
    echo 'Installing dependencies...'
    bun install

    # Build the application
    echo 'Building application...'
    bun run build

    # Fix permissions for nginx
    echo 'Setting permissions...'
    sudo chown -R www-data:www-data dist/
    sudo chmod -R 755 dist/

    echo 'Deployment completed successfully!'
"
