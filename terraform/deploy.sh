#!/bin/bash

# Deployment script for Full Stack Application on AWS EC2
# This script should be run on the EC2 instance after Terraform provisioning

set -e

echo "🚀 Starting Full Stack Application Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the EC2 instance public IP
INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo -e "${BLUE}Instance IP: ${INSTANCE_IP}${NC}"

# Application directory
APP_DIR="/home/ubuntu/app"

# Navigate to app directory
cd ${APP_DIR}

# Clone or update repository (if using git)
# Uncomment and update with your repository URL
# if [ ! -d ".git" ]; then
#     echo -e "${BLUE}Cloning repository...${NC}"
#     git clone YOUR_REPO_URL .
# else
#     echo -e "${BLUE}Updating repository...${NC}"
#     git pull
# fi

echo -e "${BLUE}Creating necessary directories...${NC}"
mkdir -p Backend Frontend

# Create Backend .env file if it doesn't exist
if [ ! -f "Backend/.env" ]; then
    echo -e "${BLUE}Creating Backend .env file...${NC}"
    cat > Backend/.env <<EOL
# MongoDB Configuration
MONGO_URI=mongodb://mongo:27017/devops-app

# Server Configuration
PORT=5000
NODE_ENV=production

# Add other environment variables as needed
EOL
fi

# Create docker-compose.yml if not present
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${BLUE}Docker Compose file not found. Please upload your application files.${NC}"
    exit 1
fi

# Stop any running containers
echo -e "${BLUE}Stopping existing containers...${NC}"
docker-compose down || true

# Pull latest images (if using pre-built images)
# docker-compose pull

# Build and start containers
echo -e "${BLUE}Building and starting containers...${NC}"
docker-compose up -d --build

# Wait for containers to be healthy
echo -e "${BLUE}Waiting for services to start...${NC}"
sleep 15

# Check container status
echo -e "${BLUE}Checking container status...${NC}"
docker-compose ps

# Show logs
echo -e "${BLUE}Recent logs:${NC}"
docker-compose logs --tail=50

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Access your application:${NC}"
echo -e "  Frontend: ${GREEN}http://${INSTANCE_IP}:3000${NC}"
echo -e "  Backend API: ${GREEN}http://${INSTANCE_IP}:5000${NC}"
echo -e "  MongoDB: ${GREEN}mongodb://${INSTANCE_IP}:27017${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  View logs: ${GREEN}docker-compose logs -f${NC}"
echo -e "  Restart: ${GREEN}docker-compose restart${NC}"
echo -e "  Stop: ${GREEN}docker-compose down${NC}"
echo -e "  Rebuild: ${GREEN}docker-compose up -d --build${NC}"
