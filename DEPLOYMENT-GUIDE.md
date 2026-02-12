# AWS EC2 Deployment Guide - Full Stack Application

This guide will help you deploy your Full Stack Application (Frontend, Backend, and MongoDB) to AWS EC2 using Terraform.

## 📋 Prerequisites

Before starting, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** installed (v1.0+)
4. **SSH Key Pair** for EC2 access

## 🏗️ Architecture

The deployment creates:
- **1 EC2 Instance** (t2.micro) running Ubuntu
- **Security Group** with ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (Frontend), 5000 (Backend), 27017 (MongoDB)
- **Docker & Docker Compose** pre-installed via user_data
- **3 Docker Containers**: Frontend (React), Backend (Node.js), MongoDB

---

## 🚀 Deployment Steps

### Step 1: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

### Step 2: Create SSH Key Pair

```bash
# Create a new SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-devops-key -N ""

# This creates:
# - Private key: ~/.ssh/react-devops-key
# - Public key: ~/.ssh/react-devops-key.pub
```

### Step 3: Configure Terraform Variables

Navigate to the terraform directory and edit `terraform.tfvars`:

```bash
cd terraform
```

Create or edit `terraform.tfvars`:

```hcl
aws_region          = "us-east-1"
project_name        = "react-devops"
ami_id              = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS in us-east-1
key_name            = "react-devops-key"
ssh_public_key      = "" # Leave empty if using existing key, or paste public key content
app_instance_type   = "t2.micro"
```

**Note:** Update the `ami_id` based on your region. Find Ubuntu AMIs here: https://cloud-images.ubuntu.com/locator/ec2/

### Step 4: Create Backend Environment File

Before deploying, create the backend `.env` file:

```bash
cd ../Backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGO_URI=mongodb://mongo:27017/devops-app
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Step 5: Initialize and Deploy with Terraform

```bash
cd ../terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply configuration (deploy to AWS)
terraform apply
# Type 'yes' when prompted
```

**Wait time:** Terraform will take 2-3 minutes to create resources.

### Step 6: Deploy Application to EC2

After Terraform completes, you'll see the instance IP in the output.

#### Option A: Automated Setup (Recommended)

```bash
# Make the setup script executable
chmod +x setup-remote.sh

# Run the setup script
./setup-remote.sh <INSTANCE_IP> ~/.ssh/react-devops-key.pem

# Example:
# ./setup-remote.sh 54.123.45.67 ~/.ssh/react-devops-key.pem
```

This script will:
1. Copy all project files to EC2
2. Deploy the application using Docker Compose
3. Display access URLs

#### Option B: Manual Setup

```bash
# SSH into the instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# On the EC2 instance, create app directory
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# From your local machine, copy files
scp -i ~/.ssh/react-devops-key.pem -r Backend ubuntu@<INSTANCE_IP>:/home/ubuntu/app/
scp -i ~/.ssh/react-devops-key.pem -r Frontend ubuntu@<INSTANCE_IP>:/home/ubuntu/app/
scp -i ~/.ssh/react-devops-key.pem docker-compose.yml ubuntu@<INSTANCE_IP>:/home/ubuntu/app/

# Back on EC2 instance, start containers
cd /home/ubuntu/app
docker-compose up -d --build

# Check container status
docker-compose ps
docker-compose logs -f
```

---

## 🌐 Access Your Application

After deployment, access your application at:

- **Frontend:** `http://<INSTANCE_IP>:3000`
- **Backend API:** `http://<INSTANCE_IP>:5000`
- **MongoDB:** `mongodb://<INSTANCE_IP>:27017` (for external tools)

Replace `<INSTANCE_IP>` with your EC2 instance public IP from Terraform output.

---

## 🔧 Useful Commands

### On EC2 Instance (SSH in first)

```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Navigate to app directory
cd /home/ubuntu/app

# View running containers
docker-compose ps

# View logs
docker-compose logs -f              # All services
docker-compose logs -f backend      # Backend only
docker-compose logs -f frontend     # Frontend only
docker-compose logs -f mongo        # MongoDB only

# Restart services
docker-compose restart              # All services
docker-compose restart backend      # Backend only

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View Docker images
docker images

# Remove unused images
docker image prune -a
```

### On Local Machine

```bash
# View Terraform outputs
cd terraform
terraform output

# Get instance IP
terraform output app_public_ip

# Get all access URLs
terraform output deployment_instructions

# Destroy infrastructure (⚠️ WARNING: This deletes everything!)
terraform destroy
# Type 'yes' when prompted
```

---

## 🔍 Troubleshooting

### Issue: Can't SSH into instance

**Solution:**
```bash
# Check security group allows SSH (port 22)
# Verify key permissions
chmod 400 ~/.ssh/react-devops-key.pem

# Try verbose SSH
ssh -v -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>
```

### Issue: Containers not starting

**Solution:**
```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Check Docker status
sudo systemctl status docker

# Check logs
cd /home/ubuntu/app
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Issue: Application not accessible

**Solution:**
```bash
# Check if containers are running
docker-compose ps

# Check security group allows ports 3000, 5000
# Verify from Terraform: terraform output security_group_id

# Test from EC2 instance itself
curl localhost:3000
curl localhost:5000
```

### Issue: MongoDB connection failed

**Solution:**
```bash
# Check if MongoDB container is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo

# Verify MONGO_URI in Backend/.env
cat Backend/.env | grep MONGO_URI
# Should be: mongodb://mongo:27017/devops-app
```

---

## 📊 Monitoring

### Check Resource Usage

```bash
# On EC2 instance
# CPU and Memory usage
docker stats

# Disk usage
df -h
docker system df
```

### CloudWatch Metrics

Access CloudWatch in AWS Console:
1. Go to EC2 > Instances
2. Select your instance
3. Click "Monitoring" tab
4. View CPU, Network, Disk metrics

---

## 🔒 Security Best Practices

1. **Restrict SSH Access:**
   - Edit security group to allow SSH only from your IP
   - Current setting: `0.0.0.0/0` (open to all)

2. **Use HTTPS:**
   - Add SSL certificate using Let's Encrypt
   - Configure Nginx as reverse proxy

3. **Secure MongoDB:**
   - Don't expose port 27017 publicly in production
   - Use authentication (username/password)

4. **Environment Variables:**
   - Never commit `.env` files to git
   - Use AWS Secrets Manager or Parameter Store

5. **Regular Updates:**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

---

## 💰 Cost Estimate

With default configuration (t2.micro):
- **EC2 t2.micro:** $0.0116/hour (~$8.5/month)
- **Data Transfer:** First 1GB free, then $0.09/GB
- **EBS Storage:** 8GB (~$0.80/month)

**Total:** ~$9-10/month

---

## 🗑️ Cleanup

To delete all AWS resources and avoid charges:

```bash
cd terraform
terraform destroy
# Type 'yes' when prompted
```

This will remove:
- EC2 instance
- Security groups
- SSH key pair (if created by Terraform)

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Ubuntu Cloud Images](https://cloud-images.ubuntu.com/locator/ec2/)

---

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review CloudWatch logs
3. Check EC2 instance system logs in AWS Console
4. Review Docker container logs: `docker-compose logs`

---

## 📝 Notes

- Default instance type is `t2.micro` (Free tier eligible)
- MongoDB data is persisted in Docker volume `mongo-data`
- To persist data across deployments, consider using AWS RDS or DocumentDB
- For production, consider using AWS ECS, EKS, or App Runner

---

**Happy Deploying! 🚀**
