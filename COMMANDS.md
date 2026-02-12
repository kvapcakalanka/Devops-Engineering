# 🎯 Deployment Commands Reference

Quick reference for all deployment commands.

---

## 📋 Initial Setup

### 1. AWS Configuration
```bash
# Configure AWS credentials
aws configure

# Test connection
aws sts get-caller-identity

# List available regions
aws ec2 describe-regions --output table
```

### 2. SSH Key Creation
```bash
# Create new SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-devops-key -N ""

# Windows (PowerShell)
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\react-devops-key" -N ""

# Set permissions (Linux/Mac)
chmod 400 ~/.ssh/react-devops-key

# View public key
cat ~/.ssh/react-devops-key.pub
```

---

## 🏗️ Terraform Commands

### Navigate to Terraform Directory
```bash
cd terraform
```

### Initialize
```bash
# Initialize Terraform (first time)
terraform init

# Reinitialize (after provider changes)
terraform init -upgrade
```

### Validate
```bash
# Validate configuration
terraform validate

# Format configuration files
terraform fmt
```

### Plan
```bash
# Preview changes
terraform plan

# Save plan to file
terraform plan -out=tfplan

# Apply saved plan
terraform apply tfplan
```

### Apply (Deploy)
```bash
# Deploy infrastructure (interactive)
terraform apply

# Deploy without confirmation
terraform apply -auto-approve

# Deploy with specific variable file
terraform apply -var-file="production.tfvars"
```

### Outputs
```bash
# Show all outputs
terraform output

# Show specific output
terraform output app_public_ip

# Show in JSON format
terraform output -json
```

### State Management
```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show aws_instance.app

# Refresh state
terraform refresh
```

### Destroy
```bash
# Destroy all resources (interactive)
terraform destroy

# Destroy without confirmation
terraform destroy -auto-approve

# Destroy specific resource
terraform destroy -target=aws_instance.app
```

---

## 🚀 Deployment Scripts

### Windows PowerShell
```powershell
# Make sure you're in the terraform directory
cd terraform

# Run deployment script
.\setup-remote.ps1 <INSTANCE_IP> "$env:USERPROFILE\.ssh\react-devops-key.pem"

# Example
.\setup-remote.ps1 54.123.45.67 "$env:USERPROFILE\.ssh\react-devops-key.pem"

# With custom key path
.\setup-remote.ps1 54.123.45.67 "C:\Users\YourName\my-key.pem"
```

### Linux/Mac Bash
```bash
# Make sure you're in the terraform directory
cd terraform

# Make script executable
chmod +x setup-remote.sh

# Run deployment script
./setup-remote.sh <INSTANCE_IP> ~/.ssh/react-devops-key.pem

# Example
./setup-remote.sh 54.123.45.67 ~/.ssh/react-devops-key.pem

# With custom key path
./setup-remote.sh 54.123.45.67 /path/to/my-key.pem
```

---

## 🔌 SSH Commands

### Connect to Instance
```bash
# Basic SSH connection
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Windows
ssh -i "$env:USERPROFILE\.ssh\react-devops-key.pem" ubuntu@<INSTANCE_IP>

# Verbose mode (for debugging)
ssh -v -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Disable host key checking (first time)
ssh -o StrictHostKeyChecking=no -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>
```

### Copy Files to Instance
```bash
# Copy single file
scp -i ~/.ssh/react-devops-key.pem file.txt ubuntu@<INSTANCE_IP>:/home/ubuntu/

# Copy directory recursively
scp -i ~/.ssh/react-devops-key.pem -r ./Backend ubuntu@<INSTANCE_IP>:/home/ubuntu/app/

# Copy from instance to local
scp -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>:/home/ubuntu/file.txt ./
```

---

## 🐳 Docker Commands (On EC2 Instance)

### Navigate to App Directory
```bash
cd /home/ubuntu/app
```

### Docker Compose
```bash
# Start containers (detached)
docker-compose up -d

# Start with build
docker-compose up -d --build

# Start with force recreate
docker-compose up -d --force-recreate

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running containers
docker-compose ps

# View logs (all services)
docker-compose logs

# View logs (follow mode)
docker-compose logs -f

# View logs (specific service)
docker-compose logs backend
docker-compose logs -f frontend

# View last 50 lines
docker-compose logs --tail=50

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend bash
docker-compose exec mongo mongosh

# View container stats
docker-compose stats
```

### Docker Commands
```bash
# List containers
docker ps
docker ps -a  # Include stopped

# List images
docker images

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune

# View container logs
docker logs <container_id>
docker logs -f backend

# Execute command in container
docker exec -it backend bash
docker exec -it mongo mongosh

# Stop container
docker stop <container_id>

# Remove container
docker rm <container_id>

# View container details
docker inspect <container_id>

# View Docker disk usage
docker system df
```

---

## 🔍 Monitoring Commands

### System Health (On EC2)
```bash
# Check system status
uptime

# CPU and memory usage
top
htop  # if installed

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tulpn
ss -tulpn

# Process list
ps aux | grep docker
ps aux | grep node

# Check Docker service
sudo systemctl status docker

# View Docker daemon logs
sudo journalctl -u docker -f
```

### Application Health
```bash
# Test services locally (on EC2)
curl localhost:3000
curl localhost:5000
curl localhost:5000/api/auth

# Test from local machine
curl http://<INSTANCE_IP>:3000
curl http://<INSTANCE_IP>:5000

# Check ports listening
sudo netstat -tulpn | grep LISTEN
sudo lsof -i :3000
sudo lsof -i :5000
```

### Container Health
```bash
# View container health status
docker inspect --format='{{.State.Health.Status}}' backend

# View container resource usage
docker stats

# Check container exit codes
docker ps -a
```

---

## 🛠️ Troubleshooting Commands

### Debug Docker Issues
```bash
# View Docker info
docker info

# Check Docker service logs
sudo journalctl -u docker --no-pager | tail -50

# Restart Docker service
sudo systemctl restart docker

# Rebuild containers from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Debug Network Issues
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Test port connectivity
telnet <INSTANCE_IP> 3000
nc -zv <INSTANCE_IP> 3000

# Check iptables rules (on EC2)
sudo iptables -L -n
```

### Debug Application Issues
```bash
# View environment variables in container
docker-compose exec backend env

# Check backend .env file
cat Backend/.env

# View MongoDB logs
docker-compose logs mongo

# Connect to MongoDB
docker-compose exec mongo mongosh
# In mongosh:
show dbs
use devops-app
show collections
```

---

## 📊 AWS CLI Commands

### EC2 Management
```bash
# List instances
aws ec2 describe-instances --output table

# Get instance by tag
aws ec2 describe-instances --filters "Name=tag:Name,Values=react-devops-app-server"

# Get instance public IP
aws ec2 describe-instances --instance-ids <instance-id> --query 'Reservations[0].Instances[0].PublicIpAddress'

# Stop instance
aws ec2 stop-instances --instance-ids <instance-id>

# Start instance
aws ec2 start-instances --instance-ids <instance-id>

# Reboot instance
aws ec2 reboot-instances --instance-ids <instance-id>

# Terminate instance
aws ec2 terminate-instances --instance-ids <instance-id>
```

### Security Groups
```bash
# List security groups
aws ec2 describe-security-groups --output table

# Get specific security group
aws ec2 describe-security-groups --group-ids <sg-id>

# Add SSH rule for your IP
aws ec2 authorize-security-group-ingress --group-id <sg-id> --protocol tcp --port 22 --cidr <YOUR_IP>/32
```

---

## 🔄 Update & Maintenance

### Update Application Code
```bash
# From local machine, copy updated files
cd "c:\My project\Devops-Engineering-main\Devops-Engineering-main"
scp -i ~/.ssh/react-devops-key.pem -r Backend ubuntu@<INSTANCE_IP>:/home/ubuntu/app/
scp -i ~/.ssh/react-devops-key.pem -r Frontend ubuntu@<INSTANCE_IP>:/home/ubuntu/app/

# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Rebuild and restart
cd /home/ubuntu/app
docker-compose up -d --build
```

### Update System Packages
```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Update package list
sudo apt-get update

# Upgrade packages
sudo apt-get upgrade -y

# Reboot if needed
sudo reboot
```

---

## 🧹 Cleanup Commands

### Remove Application (Keep Instance)
```bash
# SSH into instance
cd /home/ubuntu/app
docker-compose down -v
docker system prune -a -f
```

### Complete Cleanup
```bash
# Destroy Terraform resources
cd terraform
terraform destroy

# Remove local Terraform files (optional)
rm -rf .terraform
rm terraform.tfstate*
rm tfplan
```

---

## 💾 Backup Commands

### Backup MongoDB
```bash
# On EC2 instance
docker-compose exec mongo mongodump --out=/data/backup

# Copy backup to local machine
scp -i ~/.ssh/react-devops-key.pem -r ubuntu@<INSTANCE_IP>:/data/backup ./mongodb-backup
```

### Backup Application Files
```bash
# From local machine
scp -i ~/.ssh/react-devops-key.pem -r ubuntu@<INSTANCE_IP>:/home/ubuntu/app ./app-backup
```

---

## 📈 Performance Commands

### Monitor Resources
```bash
# Real-time resource monitoring
docker stats

# Memory usage by container
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Disk usage
docker system df -v
```

---

## 🔐 Security Commands

### Update SSH Key Permissions
```bash
# Linux/Mac
chmod 400 ~/.ssh/react-devops-key.pem

# Windows (PowerShell)
icacls "$env:USERPROFILE\.ssh\react-devops-key.pem" /inheritance:r
icacls "$env:USERPROFILE\.ssh\react-devops-key.pem" /grant:r "$($env:USERNAME):(R)"
```

### Generate New Secrets
```bash
# Generate random JWT secret
openssl rand -base64 32

# Generate UUID
uuidgen  # Linux/Mac
[guid]::NewGuid()  # PowerShell
```

---

## 📝 Quick Reference

### Common Workflow
```bash
# 1. Deploy infrastructure
cd terraform
terraform init
terraform apply

# 2. Get instance IP
terraform output app_public_ip

# 3. Deploy application
.\setup-remote.ps1 <IP> "$env:USERPROFILE\.ssh\react-devops-key.pem"

# 4. SSH and check status
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<IP>
cd /home/ubuntu/app
docker-compose ps
docker-compose logs -f

# 5. Destroy when done
cd terraform
terraform destroy
```

---

## 🆘 Emergency Commands

### Service Not Responding
```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<IP>

# Restart everything
cd /home/ubuntu/app
docker-compose restart

# Or rebuild from scratch
docker-compose down
docker-compose up -d --build
```

### Out of Disk Space
```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<IP>

# Clean Docker resources
docker system prune -a -f

# Check disk usage
df -h
```

### Instance Not Accessible
```bash
# From AWS Console or CLI
# Reboot instance
aws ec2 reboot-instances --instance-ids <instance-id>

# If still not working, recreate from Terraform
cd terraform
terraform destroy
terraform apply
```

---

**For more details, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)**
