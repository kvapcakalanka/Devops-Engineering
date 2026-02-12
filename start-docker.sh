#!/bin/bash
# Start Docker daemon in WSL

echo "Starting Docker daemon..."
sudo dockerd > /tmp/dockerd.log 2>&1 &

# Wait for Docker to be ready
for i in {1..30}; do
    if docker ps > /dev/null 2>&1; then
        echo "✅ Docker is running!"
        docker --version
        exit 0
    fi
    echo "Waiting for Docker to start... ($i/30)"
    sleep 1
done

echo "❌ Docker failed to start. Check logs:"
cat /tmp/dockerd.log
exit 1
