# 🚀 Quick Start - AWS Deployment

## Prerequisites
- AWS Account configured
- Terraform installed
- SSH client (Git Bash, WSL, or PowerShell)

## Deploy in 5 Minutes

### 1. Configure Terraform
```bash
cd terraform
```

Create `terraform.tfvars`:
```hcl
aws_region          = "us-east-1"
project_name        = "react-devops"
key_name            = "react-devops-key"
ssh_public_key      = ""
app_instance_type   = "t2.small"  # or t2.micro for free tier
```

### 2. Create SSH Key (if needed)
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-devops-key -N ""
```

### 3. Create Backend .env File
```bash
cd ../Backend
cp .env.example .env
# Edit .env if needed
cd ../terraform
```

### 4. Deploy Infrastructure
```bash
terraform init
terraform apply -auto-approve
```

Wait for completion (~3 minutes). Note the instance IP from output.

### 5. Deploy Application

**On Windows (PowerShell):**
```powershell
.\setup-remote.ps1 <INSTANCE_IP> "$env:USERPROFILE\.ssh\react-devops-key.pem"
```

**On Linux/Mac:**
```bash
chmod +x setup-remote.sh
./setup-remote.sh <INSTANCE_IP> ~/.ssh/react-devops-key.pem
```

### 6. Access Application

Open in browser:
- Frontend: `http://<INSTANCE_IP>:3000`
- Backend: `http://<INSTANCE_IP>:5000`

## Cleanup

```bash
terraform destroy -auto-approve
```

## Need Help?

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for detailed instructions.
