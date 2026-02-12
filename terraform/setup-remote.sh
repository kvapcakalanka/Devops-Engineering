#!/bin/bash

# Remote setup script to copy files and deploy the application
# Run this script from your local machine after Terraform apply

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if instance IP is provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: $0 <instance-ip> <path-to-key.pem>${NC}"
    echo -e "${YELLOW}Example: $0 54.123.45.67 ~/.ssh/react-devops-key.pem${NC}"
    exit 1
fi

INSTANCE_IP=$1
KEY_PATH=${2:-~/.ssh/react-devops-key.pem}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Setting up Full Stack Application${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Instance IP: ${INSTANCE_IP}${NC}"
echo -e "${BLUE}SSH Key: ${KEY_PATH}${NC}"
echo ""

# Wait for instance to be ready
echo -e "${BLUE}Waiting for instance to be ready...${NC}"
sleep 30

# Test SSH connection
echo -e "${BLUE}Testing SSH connection...${NC}"
ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${INSTANCE_IP} "echo 'SSH connection successful'"

# Copy project files to EC2
echo -e "${BLUE}Copying project files to EC2 instance...${NC}"

# Copy from parent directory (one level up from terraform)
cd ..

# Create remote directory structure
ssh -i ${KEY_PATH} ubuntu@${INSTANCE_IP} "mkdir -p /home/ubuntu/app"

# Copy entire project (excluding terraform directory and node_modules)
echo -e "${BLUE}Copying Backend files...${NC}"
scp -i ${KEY_PATH} -r Backend ubuntu@${INSTANCE_IP}:/home/ubuntu/app/

echo -e "${BLUE}Copying Frontend files...${NC}"
scp -i ${KEY_PATH} -r Frontend ubuntu@${INSTANCE_IP}:/home/ubuntu/app/

echo -e "${BLUE}Copying docker-compose.yml...${NC}"
scp -i ${KEY_PATH} docker-compose.yml ubuntu@${INSTANCE_IP}:/home/ubuntu/app/

# Copy deployment script
echo -e "${BLUE}Copying deployment script...${NC}"
scp -i ${KEY_PATH} terraform/deploy.sh ubuntu@${INSTANCE_IP}:/home/ubuntu/app/
ssh -i ${KEY_PATH} ubuntu@${INSTANCE_IP} "chmod +x /home/ubuntu/app/deploy.sh"

# Run deployment script on remote instance
echo -e "${BLUE}Running deployment script on EC2 instance...${NC}"
ssh -i ${KEY_PATH} ubuntu@${INSTANCE_IP} "cd /home/ubuntu/app && ./deploy.sh"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Your application should now be running at:${NC}"
echo -e "  Frontend: ${GREEN}http://${INSTANCE_IP}:3000${NC}"
echo -e "  Backend API: ${GREEN}http://${INSTANCE_IP}:5000${NC}"
echo ""
echo -e "${BLUE}To SSH into your instance:${NC}"
echo -e "  ${GREEN}ssh -i ${KEY_PATH} ubuntu@${INSTANCE_IP}${NC}"
echo -e "${GREEN}========================================${NC}"
