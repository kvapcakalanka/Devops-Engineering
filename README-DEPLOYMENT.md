# 🚀 Full Stack DevOps Application - AWS EC2 Deployment

A complete Full Stack application deployment solution using Docker, Terraform, and AWS EC2.

## 📦 Stack

- **Frontend:** React + Vite (Port 3000)
- **Backend:** Node.js + Express (Port 5000)
- **Database:** MongoDB (Port 27017)
- **Infrastructure:** AWS EC2 + Terraform
- **Containerization:** Docker + Docker Compose

---

## 🎯 Quick Start

### Prerequisites
- AWS account with credentials configured
- Terraform installed
- SSH key pair created

### Deploy in 5 Minutes

```bash
# 1. Configure Terraform
cd terraform
# Edit terraform.tfvars with your settings

# 2. Create backend .env file
cd ../Backend
cp .env.example .env
cd ../terraform

# 3. Deploy infrastructure
terraform init
terraform apply

# 4. Note the instance IP from output

# 5. Deploy application (Windows)
.\setup-remote.ps1 <INSTANCE_IP> "$env:USERPROFILE\.ssh\react-devops-key.pem"

# Or (Linux/Mac)
chmod +x setup-remote.sh
./setup-remote.sh <INSTANCE_IP> ~/.ssh/react-devops-key.pem

# 6. Access your app
# Frontend: http://<INSTANCE_IP>:3000
# Backend:  http://<INSTANCE_IP>:5000
```

---

## 📚 Documentation

### Essential Guides
1. **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
2. **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Comprehensive deployment guide
3. **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** - Step-by-step checklist
4. **[DEPLOYMENT-SUMMARY.md](DEPLOYMENT-SUMMARY.md)** - What's configured and how to use it

### Choose Your Path

**🏃 I want to deploy now:**  
→ Follow [QUICKSTART.md](QUICKSTART.md)

**📖 I want to understand everything:**  
→ Read [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

**✅ I want a checklist to follow:**  
→ Use [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

**🔍 I want to know what's been configured:**  
→ Check [DEPLOYMENT-SUMMARY.md](DEPLOYMENT-SUMMARY.md)

---

## 🏗️ Project Structure

```
.
├── Backend/                 # Node.js backend
│   ├── Dockerfile
│   ├── server.js
│   ├── .env.example
│   ├── models/
│   └── routes/
├── Frontend/                # React frontend
│   ├── Dockerfile
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── terraform/               # Infrastructure as Code
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Variable definitions
│   ├── outputs.tf          # Output values
│   ├── terraform.tfvars    # Your configuration (edit this!)
│   ├── deploy.sh           # EC2 deployment script
│   ├── setup-remote.sh     # Linux/Mac setup script
│   └── setup-remote.ps1    # Windows setup script
├── docker-compose.yml       # Container orchestration
├── QUICKSTART.md           # Quick start guide
├── DEPLOYMENT-GUIDE.md     # Comprehensive guide
├── DEPLOYMENT-CHECKLIST.md # Step-by-step checklist
└── DEPLOYMENT-SUMMARY.md   # Configuration summary
```

---

## 🌐 Architecture

```
                    Internet
                       │
                       ▼
              AWS Security Group
          (Ports: 22, 80, 443, 3000, 5000, 27017)
                       │
                       ▼
                 EC2 Instance
              (Ubuntu + Docker)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   Frontend       Backend         MongoDB
   (React)      (Node.js)        (Database)
   Port 3000    Port 5000       Port 27017
```

---

## ⚙️ Configuration

### 1. AWS Credentials
```bash
aws configure
```

### 2. SSH Key Pair
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-devops-key
```

### 3. Terraform Variables
Edit `terraform/terraform.tfvars`:
```hcl
aws_region        = "us-east-1"
key_name          = "react-devops-key"
app_instance_type = "t2.small"
```

### 4. Backend Environment
Create `Backend/.env`:
```env
MONGO_URI=mongodb://mongo:27017/devops-app
PORT=5000
NODE_ENV=production
```

---

## 🚀 Deployment Commands

### Deploy Infrastructure
```bash
cd terraform
terraform init
terraform apply
```

### Deploy Application
**Windows:**
```powershell
.\setup-remote.ps1 <INSTANCE_IP> <PATH_TO_KEY>
```

**Linux/Mac:**
```bash
./setup-remote.sh <INSTANCE_IP> <PATH_TO_KEY>
```

### Manual Deployment
```bash
# SSH into instance
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>

# Copy files and deploy
cd /home/ubuntu/app
docker-compose up -d --build
```

---

## 🔧 Management

### View Status
```bash
ssh -i ~/.ssh/react-devops-key.pem ubuntu@<INSTANCE_IP>
cd /home/ubuntu/app
docker-compose ps
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Update Application
```bash
docker-compose down
docker-compose up -d --build
```

### Destroy Infrastructure
```bash
cd terraform
terraform destroy
```

---

## 📊 Terraform Outputs

After deployment, Terraform provides:
- Instance public IP
- Frontend URL (http://IP:3000)
- Backend URL (http://IP:5000)
- SSH command
- Next steps

View outputs:
```bash
terraform output
```

---

## 🔒 Security Features

- ✅ Security groups configured
- ✅ SSH key authentication
- ✅ Docker container isolation
- ✅ Network segmentation
- ✅ Environment variable management

### Production Hardening
- Restrict SSH to specific IPs
- Use HTTPS/SSL certificates
- Enable MongoDB authentication
- Use AWS Secrets Manager
- Set up CloudWatch monitoring

---

## 💰 Cost Estimate

**Default Configuration (t2.small):**
- EC2 Instance: ~$17/month
- EBS Storage: ~$0.80/month
- Data Transfer: Varies

**Free Tier (t2.micro):**
- 750 hours/month free for first 12 months
- Change `app_instance_type = "t2.micro"` in terraform.tfvars

---

## 🧪 Testing

### Health Checks
```bash
# Frontend
curl http://<INSTANCE_IP>:3000

# Backend
curl http://<INSTANCE_IP>:5000

# Backend API
curl http://<INSTANCE_IP>:5000/api/auth
```

### Container Status
```bash
docker-compose ps
docker-compose logs
```

---

## 🐛 Troubleshooting

### Common Issues

**Terraform fails:**
- Check AWS credentials
- Verify AMI ID for your region
- Ensure key_name matches AWS

**Can't SSH:**
- Wait 3-5 minutes after creation
- Check key permissions
- Verify security group rules

**Containers not starting:**
- Check logs: `docker-compose logs`
- Verify Docker is running
- Check disk space: `df -h`

**Application not accessible:**
- Wait 5 minutes after deployment
- Check containers: `docker-compose ps`
- Verify security group allows traffic

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md#troubleshooting) for detailed solutions.

---

## 📁 Key Files

### Terraform
- `terraform/main.tf` - Infrastructure definition
- `terraform/variables.tf` - Configuration variables
- `terraform/outputs.tf` - Output values
- `terraform/terraform.tfvars` - Your settings (**edit this!**)

### Deployment Scripts
- `terraform/deploy.sh` - Runs on EC2 to start containers
- `terraform/setup-remote.sh` - Linux/Mac deployment script
- `terraform/setup-remote.ps1` - Windows PowerShell script

### Application
- `docker-compose.yml` - Container orchestration
- `Backend/.env` - Backend environment variables
- `Backend/Dockerfile` - Backend container image
- `Frontend/Dockerfile` - Frontend container image

---

## 🔄 CI/CD

This project includes a `Jenkinsfile` for CI/CD automation. To use:

1. Set up Jenkins server
2. Configure Jenkins pipeline
3. Connect to your repository
4. Automated build and deploy

---

## 📖 Learning Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 🤝 Support

1. Check documentation in this repository
2. Review [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
3. Check CloudWatch logs in AWS Console
4. Review container logs: `docker-compose logs`

---

## ✅ Pre-Deployment Checklist

- [ ] AWS account configured
- [ ] Terraform installed
- [ ] SSH key created
- [ ] `terraform.tfvars` configured
- [ ] `Backend/.env` created
- [ ] Read documentation

Ready? Start with [QUICKSTART.md](QUICKSTART.md)!

---

## 🎓 What You'll Learn

By deploying this project, you'll gain hands-on experience with:
- ☁️ AWS EC2 instance management
- 🏗️ Infrastructure as Code with Terraform
- 🐳 Docker and Docker Compose
- 🔧 DevOps best practices
- 🌐 Full-stack application deployment
- 🔒 Cloud security fundamentals

---

## 📝 License

This project is provided as-is for educational and deployment purposes.

---

## 🌟 Features

✅ Complete full-stack deployment  
✅ Infrastructure as Code  
✅ Automated setup scripts  
✅ Comprehensive documentation  
✅ Windows and Linux support  
✅ Production-ready security  
✅ Easy to customize  
✅ Cost-effective  

---

**Ready to deploy? Start here:** [QUICKSTART.md](QUICKSTART.md)

**Need help? Read:** [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

**Want a checklist? Use:** [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

---

**Status:** ✅ Ready for Production Deployment  
**Last Updated:** February 12, 2026
