#!/bin/bash

# Configuration
REMOTE_USER="subhan"
REMOTE_HOST="aifin.tolor.com"
REMOTE_PORT="1022"
REMOTE_DIR="~/apps/sungwoo-warehouse-poc"
APP_PORT="8081" # Avoiding 8000/8080 as requested

echo "🚀 Starting Deployment to $REMOTE_HOST..."

# Connect via SSH and execute commands
ssh -p $REMOTE_PORT -t $REMOTE_USER@$REMOTE_HOST << EOF
    set -e # Exit on error

    echo "📂 Setup remote directory..."
    mkdir -p ~/apps
    
    if [ -d "$REMOTE_DIR" ]; then
        echo "⬇️ Pulling latest code..."
        cd $REMOTE_DIR
        git pull origin main
    else
        echo "⬇️ Cloning repository..."
        cd ~/apps
        git clone https://github.com/alsubhan/sungwoo-warehouse-poc.git
        cd $REMOTE_DIR
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
