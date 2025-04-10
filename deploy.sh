#!/bin/bash
# Script to deploy pitch-accent-viz application
# Usage: ./deploy.sh

SESSION_NAME="pitch-accent"
REMOTE_HOST="jiyanjs"
APP_DIR="/home/ubuntu/websites/pitch-accent-viz"

# Check if tmux is available locally
if ! command -v tmux &>/dev/null; then
    echo "Error: tmux is not installed on this machine."
    exit 1
fi

# Connect to remote server and execute commands directly
ssh $REMOTE_HOST "
    cd $APP_DIR || { echo 'Error: Unable to navigate to $APP_DIR'; exit 1; }
    echo 'Current directory:' \$(pwd)

    # Pull latest changes
    echo 'Pulling latest changes...'
    git pull

    # Check if tmux session exists
    if tmux has-session -t $SESSION_NAME 2>/dev/null; then
        echo 'Found existing tmux session: $SESSION_NAME'
        tmux send-keys -t $SESSION_NAME:0 C-c
        sleep 2
        tmux send-keys -t $SESSION_NAME:0 'NODE_ENV=production bun src/index.tsx' C-m
    else
        echo 'Creating new tmux session: $SESSION_NAME'
        tmux new-session -d -s $SESSION_NAME
        tmux send-keys -t $SESSION_NAME:0 'cd $APP_DIR' C-m
        tmux send-keys -t $SESSION_NAME:0 'NODE_ENV=production bun src/index.tsx' C-m
    fi

    echo 'Deployment completed successfully!'
"
