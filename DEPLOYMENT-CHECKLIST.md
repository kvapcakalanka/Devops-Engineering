# ✅ Deployment Checklist

Use this checklist to ensure you complete all steps correctly before deploying.

---

## 📋 Pre-Deployment

### AWS Setup
- [ ] AWS account created and verified
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS credentials configured (`aws configure`)
- [ ] Test AWS connection: `aws sts get-caller-identity`

### Local Tools
- [ ] Terraform installed (`terraform --version`)
- [ ] SSH client available (Git Bash, WSL, or PowerShell)
- [ ] SCP/RSYNC available for file transfer

### SSH Key Pair
- [ ] SSH key pair created (`ssh-keygen -t rsa -b 4096 -f ~/.ssh/react-devops-key`)
- [ ] Private key: `~/.ssh/react-devops-key` (or `react-devops-key.pem`)
- [ ] Public key: `~/.ssh/react-devops-key.pub`
- [ ] Key permissions set correctly (`chmod 400` on Linux/Mac)

---

## ⚙️ Configuration

### Terraform Variables (`terraform/terraform.tfvars`)
- [ ] `aws_region` set (default: "us-east-1")
- [ ] `project_name` set (default: "react-devops")
- [ ] `key_name` updated to your key name
- [ ] `ami_id` matches your region (Ubuntu 22.04 LTS)
- [ ] `app_instance_type` set (recommended: "t2.small")

**AMI IDs by Region:**
- us-east-1: `ami-0c7217cdde317cfec`
- us-west-2: `ami-0aff18ec83b712f05`
- Find yours: https://cloud-images.ubuntu.com/locator/ec2/

### Backend Environment (`Backend/.env`)
- [ ] File created from `.env.example`
- [ ] `MONGO_URI` set (default: `mongodb://mongo:27017/devops-app`)
- [ ] `PORT` set (default: 5000)
- [ ] `NODE_ENV` set (production)
- [ ] JWT secret and other variables configured

### Docker Compose (`docker-compose.yml`)
- [ ] File exists in root directory
- [ ] Backend build path is `./Backend` (capital B)
- [ ] Frontend build path is `./Frontend` (capital F)
- [ ] Port mappings correct (3000, 5000, 27017)

---

## 🚀 Deployment Steps

### Step 1: Terraform Initialization
```bash
cd terraform
terraform init
```
- [ ] Terraform initialized successfully
- [ ] No errors in initialization

### Step 2: Terraform Validation
```bash
terraform validate
```
- [ ] Configuration is valid

### Step 3: Terraform Plan
```bash
terraform plan
```
- [ ] Plan shows resources to be created
- [ ] No errors in plan
- [ ] Security group rules look correct
- [ ] EC2 instance configuration is correct

### Step 4: Terraform Apply
```bash
terraform apply
```
- [ ] Type 'yes' to confirm
- [ ] Wait 2-3 minutes for completion
- [ ] Note the instance public IP from output
- [ ] Save the instance IP: `_________________`

### Step 5: Wait for Instance Initialization
- [ ] Wait 2-3 minutes for user_data script to complete
- [ ] Docker and Docker Compose installing on instance

### Step 6: Deploy Application

**Choose your method:**

**Option A - Windows PowerShell:**
```powershell
.\setup-remote.ps1 <INSTANCE_IP> "$env:USERPROFILE\.ssh\react-devops-key.pem"
```
- [ ] Script executed successfully
- [ ] Files copied to EC2
- [ ] Docker containers started

**Option B - Linux/Mac Bash:**
```bash
chmod +x setup-remote.sh
./setup-remote.sh <INSTANCE_IP> ~/.ssh/react-devops-key.pem
```
- [ ] Script executed successfully
- [ ] Files copied to EC2
- [ ] Docker containers started

### Step 7: Verify Deployment
- [ ] SSH into instance: `ssh -i <key> ubuntu@<IP>`
- [ ] Check containers: `docker-compose ps`
- [ ] All 3 containers running (frontend, backend, mongo)
- [ ] View logs: `docker-compose logs`

---

## 🌐 Access & Testing

### Access URLs
Update with your instance IP:

- [ ] Frontend: `http://<INSTANCE_IP>:3000`
- [ ] Backend: `http://<INSTANCE_IP>:5000`
- [ ] Backend API test: `http://<INSTANCE_IP>:5000/api/auth`

### Application Testing
- [ ] Frontend loads in browser
- [ ] Can access login page
- [ ] Can access signup page
- [ ] Backend API responds
- [ ] Database connection working

### Network Testing
```bash
# From your local machine
curl http://<INSTANCE_IP>:5000
curl http://<INSTANCE_IP>:3000
```
- [ ] Backend returns response
- [ ] Frontend returns HTML

---

## 🔧 Post-Deployment

### Security Review
- [ ] Review security group rules
- [ ] Consider restricting SSH to your IP only
- [ ] MongoDB port (27017) not publicly accessible in production
- [ ] SSL/TLS certificate installed (if needed)

### Monitoring Setup
- [ ] CloudWatch metrics enabled
- [ ] Log into AWS Console and verify instance status
- [ ] Set up billing alerts (optional)

### Documentation
- [ ] Note instance IP address
- [ ] Save SSH key location
- [ ] Document any custom configurations

---

## 📊 Health Checks

Run these commands on the EC2 instance:

```bash
# SSH into instance
ssh -i <key> ubuntu@<INSTANCE_IP>

# Check Docker status
sudo systemctl status docker

# Check containers
cd /home/ubuntu/app
docker-compose ps

# View logs
docker-compose logs --tail=50

# Check disk space
df -h

# Check memory
free -h

# Check network
curl localhost:3000
curl localhost:5000
```

**All checks passing:**
- [ ] Docker service running
- [ ] 3 containers running and healthy
- [ ] No errors in logs
- [ ] Sufficient disk space (>20% free)
- [ ] Sufficient memory available
- [ ] Services responding locally

---

## 🐛 Troubleshooting

### Issue: Terraform apply fails
- [ ] Check AWS credentials: `aws sts get-caller-identity`
- [ ] Verify AMI ID exists in your region
- [ ] Check if key_name exists in AWS EC2 console
- [ ] Review error message carefully

### Issue: Can't SSH into instance
- [ ] Key file exists at specified path
- [ ] Key permissions correct (`chmod 400`)
- [ ] Security group allows SSH from your IP
- [ ] Wait 3-5 minutes after Terraform apply
- [ ] Try verbose SSH: `ssh -v -i <key> ubuntu@<IP>`

### Issue: Application not accessible
- [ ] Wait 5 minutes after deployment
- [ ] Check containers running: `docker-compose ps`
- [ ] Check logs: `docker-compose logs`
- [ ] Security group allows ports 3000, 5000
- [ ] Try accessing from EC2 instance itself

### Issue: Containers not starting
- [ ] Check Docker logs: `docker-compose logs`
- [ ] Check disk space: `df -h`
- [ ] Check if Docker service is running
- [ ] Try rebuilding: `docker-compose up -d --build`

---

## 🗑️ Cleanup Checklist

When you're done and want to remove everything:

### Terraform Destroy
```bash
cd terraform
terraform destroy
```
- [ ] Type 'yes' to confirm
- [ ] Wait for completion
- [ ] Verify in AWS Console that resources are deleted

### Additional Cleanup
- [ ] Remove local SSH key (if no longer needed)
- [ ] Remove terraform.tfstate files (optional)
- [ ] Check AWS Console for any remaining resources
- [ ] Review AWS billing to confirm no charges

---

## 📝 Deployment Log

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Instance IP:** _______________  
**AWS Region:** _______________  
**Instance Type:** _______________  
**Notes:**

```
_______________________________________________
_______________________________________________
_______________________________________________
```

---

## ✅ Final Checklist

- [ ] All deployment steps completed
- [ ] Application accessible and working
- [ ] Security reviewed and hardened
- [ ] Documentation updated
- [ ] Team notified (if applicable)
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place (if needed)

---

**Deployment Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Completed

**Sign off:** _______________  **Date:** _______________
