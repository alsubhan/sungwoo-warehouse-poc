#!/bin/bash

# Configuration
REMOTE_USER="subhan"
REMOTE_HOST="aifin.tolor.com"
REMOTE_PORT="1022"
APP_PORT="8081"
REPO_URL="https://github.com/alsubhan/sungwoo-warehouse-poc.git"

echo "🚀 Starting Deployment to $REMOTE_HOST..."

# Connect via SSH
# We use 'bash -s' to execute the following commands
ssh -p $REMOTE_PORT -t $REMOTE_USER@$REMOTE_HOST "bash -s" << EOF
    set -e # Exit on error
    
    # Define paths (using \$HOME to use remote home directory)
    APPS_DIR="\$HOME/apps"
    PROJECT_DIR="\$APPS_DIR/sungwoo-warehouse-poc"

    echo "📂 Ensuring apps directory exists..."
    mkdir -p "\$APPS_DIR"
    
    if [ -d "\$PROJECT_DIR" ]; then
        echo "⬇️ Pulling latest code in \$PROJECT_DIR..."
        cd "\$PROJECT_DIR"
        git pull origin main
    else
        echo "⬇️ Cloning repository to \$PROJECT_DIR..."
        cd "\$APPS_DIR"
        git clone $REPO_URL
        cd "\$PROJECT_DIR"
    fi

    echo "🐳 Building Docker image..."
    docker build -t sungwoo-warehouse .

    echo "🛑 Stopping existing container..."
    docker stop sungwoo-warehouse-app || true
    docker rm sungwoo-warehouse-app || true

    echo "▶️ Running new container on port $APP_PORT..."
    docker run -d \
        --name sungwoo-warehouse-app \
        --restart unless-stopped \
        -p $APP_PORT:80 \
        sungwoo-warehouse

    echo "✅ Deployment Successful!"
    docker ps | grep sungwoo-warehouse-app
EOF
