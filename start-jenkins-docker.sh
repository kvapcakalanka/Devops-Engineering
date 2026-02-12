#!/bin/bash
# Start Docker and Jenkins in WSL

echo "🐋 Starting Docker daemon..."
sudo dockerd > /tmp/dockerd.log 2>&1 &

# Wait for Docker
for i in {1..15}; do
    if docker ps > /dev/null 2>&1; then
        echo "✅ Docker is running!"
        break
    fi
    sleep 1
done

echo ""
echo "🚀 Starting Jenkins..."
echo "   Jenkins will be available at: http://localhost:8080"
echo "   Press Ctrl+C to stop (but keep this terminal open)"
echo ""

# Start Jenkins in foreground (so you see logs)
cd ~/.jenkins || cd ~ 
java -jar jenkins.war --httpPort=8080
