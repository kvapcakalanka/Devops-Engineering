# 🎯 EXECUTE NOW - Step by Step Deployment

Follow these exact steps to deploy your application RIGHT NOW.

---

## ✅ Pre-Flight Checklist

- [ ] I have an AWS account
- [ ] I have AWS CLI installed (`aws --version`)
- [ ] I have Terraform installed (`terraform --version`)
- [ ] I'm ready to deploy!

---

## 🚀 STEP 1: Configure AWS Credentials (5 minutes)

Open PowerShell and run:

```powershell
aws configure
```

When prompted, enter:
- **AWS Access Key ID**: [Your AWS Access Key]
- **AWS Secret Access Key**: [Your AWS Secret Key]
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

**Test it works:**
```powershell
aws sts get-caller-identity
```

You should see your AWS account information.

---

## 🚀 STEP 2: Create SSH Key Pair (2 minutes)

```powershell
# Create .ssh directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"

# Generate SSH key
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\react-devops-key" -N ""
```

**Verify:**
```powershell
Test-Path "$env:USERPROFILE\.ssh\react-devops-key"
Test-Path "$env:USERPROFILE\.ssh\react-devops-key.pub"
```

Both should return `True`.

---

## 🚀 STEP 3: Configure Terraform (3 minutes)

```powershell
# Navigate to terraform directory
cd "c:\My project\Devops-Engineering-main\Devops-Engineering-main\terraform"
```

**Option A: Quick Setup (Use Defaults)**

The `terraform.tfvars` file is already configured with defaults. Just verify:

```powershell
Get-Content terraform.tfvars
```

**Option B: Customize (Recommended)**

Open `terraform.tfvars` in VS Code:
```powershell
code terraform.tfvars
```

Update these values:
- `aws_region` - Your AWS region (e.g., "us-east-1")
- `key_name` - Keep as "react-devops-key"
- `app_instance_type` - "t2.small" (or "t2.micro" for free tier)

**Important:** Update `ami_id` if NOT using us-east-1:
- us-east-1: `ami-0c7217cdde317cfec`
- us-west-2: `ami-0aff18ec83b712f05`
- Find others: https://cloud-images.ubuntu.com/locator/ec2/

**Save the file.**

---

## 🚀 STEP 4: Verify Backend Configuration (1 minute)

```powershell
# Check Backend .env exists and is configured
Get-Content "..\Backend\.env"
```

Should show:
```
MONGO_URI=mongodb://mongo:27017/devops-app
PORT=5000
NODE_ENV=production
...
```

If empty or missing, it's already configured, but you can verify:
```powershell
Copy-Item "..\Backend\.env.example" "..\Backend\.env" -Force
```

---

## 🚀 STEP 5: Deploy Infrastructure (5-7 minutes)

**Initialize Terraform:**
```powershell
terraform init
```

**Expected Output:** 
```
Terraform has been successfully initialized!
```

**Preview what will be created:**
```powershell
terraform plan
```

**Review the output.** You should see:
- 1 EC2 instance to be created
- 1 Security group to be created
- 1 Key pair to be created

**Deploy to AWS:**
```powershell
terraform apply
```

**Type `yes` when prompted.**

⏱️ **WAIT 2-3 MINUTES** for Terraform to complete.

**Expected Final Output:**
```
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.

Outputs:
app_public_ip = "54.XXX.XXX.XXX"
...
```

**📝 IMPORTANT: Copy the instance IP address shown in the output!**

Write it here: `_________________________`

---

## 🚀 STEP 6: Wait for Instance to Initialize (2-3 minutes)

The EC2 instance is now starting up and installing Docker. Wait 2-3 minutes.

```powershell
# Wait 3 minutes
Start-Sleep -Seconds 180

# Test SSH connection
ssh -o StrictHostKeyChecking=no -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP> "echo 'Ready!'"
```

Replace `<YOUR_INSTANCE_IP>` with the IP from Step 5.

If you see "Ready!", continue. If not, wait another minute and try again.

---

## 🚀 STEP 7: Deploy Application (3-5 minutes)

**Run the deployment script:**

```powershell
.\setup-remote.ps1 <YOUR_INSTANCE_IP> "$env:USERPROFILE\.ssh\react-devops-key"
```

**Example:**
```powershell
.\setup-remote.ps1 54.123.45.67 "$env:USERPROFILE\.ssh\react-devops-key"
```

The script will:
1. ✅ Test SSH connection
2. ✅ Copy Backend files
3. ✅ Copy Frontend files
4. ✅ Copy docker-compose.yml
5. ✅ Build Docker images
6. ✅ Start all containers

⏱️ **WAIT 3-5 MINUTES** for Docker to build images.

**Expected Final Output:**
```
========================================
✅ Setup Complete!
========================================
Your application should now be running at:
  Frontend: http://54.XXX.XXX.XXX:3000
  Backend API: http://54.XXX.XXX.XXX:5000
========================================
```

---

## 🚀 STEP 8: Access Your Application! 🎉

Open your web browser and navigate to:

### Frontend:
```
http://<YOUR_INSTANCE_IP>:3000
```

### Backend API:
```
http://<YOUR_INSTANCE_IP>:5000
```

**You should see your React application running!**

---

## ✅ Verify Everything is Working

### Check Container Status

```powershell
# SSH into your instance
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP>
```

Once connected:
```bash
# Navigate to app directory
cd /home/ubuntu/app

# Check containers
docker-compose ps
```

**You should see:**
```
NAME       IMAGE     STATUS
frontend   ...       Up X minutes
backend    ...       Up X minutes
mongo      ...       Up X minutes
```

**View logs:**
```bash
docker-compose logs -f
```

Press `Ctrl+C` to stop viewing logs.

**Exit SSH:**
```bash
exit
```

---

## 🎯 What You Just Deployed

✅ **EC2 Instance**: Ubuntu server on AWS  
✅ **Security Groups**: Firewall rules configured  
✅ **Docker**: Container runtime installed  
✅ **Frontend**: React app running on port 3000  
✅ **Backend**: Node.js API running on port 5000  
✅ **Database**: MongoDB running on port 27017  

---

## 📊 Useful Commands

### View Terraform Outputs
```powershell
cd "c:\My project\Devops-Engineering-main\Devops-Engineering-main\terraform"
terraform output
```

### SSH into Instance
```powershell
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP>
```

### View Application Logs
```powershell
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP> "cd /home/ubuntu/app && docker-compose logs -f"
```

### Restart Application
```powershell
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP> "cd /home/ubuntu/app && docker-compose restart"
```

---

## 🛑 When You're Done (Cleanup)

**To avoid AWS charges, destroy the infrastructure when done:**

```powershell
cd "c:\My project\Devops-Engineering-main\Devops-Engineering-main\terraform"
terraform destroy
```

Type `yes` when prompted.

This will:
- ❌ Delete the EC2 instance
- ❌ Delete the security group
- ❌ Delete the SSH key from AWS

---

## 🐛 Troubleshooting

### Issue: SSH Connection Failed
**Solution:**
```powershell
# Wait 5 minutes for instance to fully start
Start-Sleep -Seconds 300

# Try again
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP>
```

### Issue: Application Not Loading
**Solution:**
```powershell
# SSH into instance
ssh -i "$env:USERPROFILE\.ssh\react-devops-key" ubuntu@<YOUR_INSTANCE_IP>

# Check container status
cd /home/ubuntu/app
docker-compose ps

# View logs
docker-compose logs

# Restart if needed
docker-compose restart
```

### Issue: Terraform Apply Failed
**Solution:**
```powershell
# Check AWS credentials
aws sts get-caller-identity

# Check AMI ID is correct for your region
# Update terraform.tfvars if needed

# Try again
terraform apply
```

---

## 🎉 Success Criteria

✅ Terraform applied successfully  
✅ Can SSH into EC2 instance  
✅ All 3 containers are running  
✅ Frontend accessible at http://IP:3000  
✅ Backend accessible at http://IP:5000  
✅ No errors in logs  

**If all checks pass: CONGRATULATIONS! 🎊**

---

## 📚 Next Steps

1. Explore the application
2. Test the signup/login functionality
3. Review the logs: `docker-compose logs`
4. Read [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for advanced features
5. When done, run `terraform destroy` to cleanup

---

## 💡 Pro Tips

- **Bookmark your instance IP** for easy access
- **Save your SSH key** in a secure location
- **Set up AWS billing alerts** to monitor costs
- **Check CloudWatch** for instance metrics in AWS Console
- **Use `t2.micro`** instance type for free tier eligibility

---

## ⏱️ Total Time: ~20-25 minutes

- AWS Setup: 5 min
- SSH Key: 2 min
- Configuration: 3 min
- Terraform Deploy: 7 min
- Application Deploy: 8 min

---

## 🆘 Need Help?

- **Detailed Guide:** [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
- **Command Reference:** [COMMANDS.md](COMMANDS.md)
- **Checklist:** [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

---

**You're all set! Start with STEP 1 above. Good luck! 🚀**
