# Jenkins Setup Guide for New EC2 Instance (with GitHub Webhooks)

## Prerequisites
- New EC2 instance (Amazon Linux 2 recommended)
- Security group allows ports: 22 (SSH), 8080 (Jenkins), 80 (HTTP), 443 (HTTPS)
- SSH key pair for accessing the instance
- GitHub Personal Access Token (for webhooks)

## Step 1: Connect to Your New EC2 Instance

```bash
ssh -i your-key.pem ec2-user@<new-ec2-public-ip>
```

## Step 2: Update System and Install Java

Jenkins requires Java. Run these commands:

```bash
sudo yum update -y
sudo yum install -y java-17-amazon-corretto-devel
java -version
```

## Step 3: Install Jenkins

```bash
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum install -y jenkins
```

## Step 4: Install Docker

Jenkins needs Docker to build images:

```bash
sudo yum install -y docker git
sudo usermod -aG docker jenkins
sudo usermod -aG docker ec2-user
sudo systemctl start docker
sudo systemctl enable docker
```

## Step 5: Start Jenkins

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```

Wait 30-60 seconds for Jenkins to fully start.

## Step 6: Get Jenkins Initial Admin Password

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy this password - you'll need it to log in.

## Step 7: Access Jenkins Web Interface

Open your browser and go to:
```
http://<new-ec2-public-ip>:8080
```

1. Paste the password from Step 6
2. Click "Continue"
3. Click "Install suggested plugins" (let it complete)
4. Create your first admin user (or skip and use admin account)
5. Jenkins URL: `http://<new-ec2-public-ip>:8080`
6. Click "Save and Finish"

## Step 8: Configure Jenkins Credentials

### Add Docker Hub Credentials:
1. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **+ Add Credentials**
3. Kind: **Username with password**
4. Username: Your Docker Hub username
5. Password: Your Docker Hub password
6. ID: `dockerhub`
7. Click **Create**

### Add SSH Key for EC2 (Deployment Server):
1. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **+ Add Credentials**
3. Kind: **SSH Username with private key**
4. Username: `ec2-user`
5. ID: `app-server-ssh-key`
6. Private Key: Paste your `~/.ssh/react-devops-key` content (the one you use for deployment EC2)
7. Click **Create**

### Add GitHub Personal Access Token (Optional, for webhook security):
1. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **+ Add Credentials**
3. Kind: **Secret text**
4. Secret: Your GitHub Personal Access Token
5. ID: `github-token`
6. Click **Create**

## Step 9: Create a New Pipeline Job

1. Click **+ New Item** on Jenkins home
2. Name: `devops-engineering-pipeline`
3. Select **Pipeline**
4. Click **OK**

### Configure the Job:

**General Tab:**
- Check **GitHub project**
- Project URL: `https://github.com/kvapcakalanka/Devops-Engineering`

**Build Triggers Tab:**
- Check **GitHub hook trigger for GITScm polling**

**Pipeline Tab:**
- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/kvapcakalanka/Devops-Engineering.git`
- Branch: `*/main`
- Script Path: `Jenkinsfile`
- Click **Save**

## Step 10: Set Up GitHub Webhook

1. Go to your GitHub repository: `https://github.com/kvapcakalanka/Devops-Engineering`
2. Click **Settings** → **Webhooks**
3. Click **Add webhook**
4. Fill in:
   - **Payload URL**: `http://<new-ec2-public-ip>:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: Select **Just the push event**
   - Check **Active**
5. Click **Add webhook**

Now GitHub will automatically trigger Jenkins builds whenever you push to the main branch!

## Step 11: Update Jenkinsfile (If Needed)

Your current Jenkinsfile should work as-is, but verify:
- `APP_SERVER = "98.93.104.219"` (your deployment EC2 IP)
- `EC2_USER = "ec2-user"`
- `DOCKER_REGISTRY = "pasan2001/devops-engineering"`

## Step 12: Test the Setup

### Manual Test:
1. In Jenkins, click your job name
2. Click **Build Now**
3. Watch the console output

### Automatic Webhook Test:
1. Make a small change to a file in your repo
2. Commit and push to main branch
3. GitHub webhook should trigger Jenkins automatically
4. Check Jenkins logs to confirm

## Troubleshooting

### Jenkins Won't Start:
```bash
sudo systemctl restart jenkins
sudo tail -f /var/log/jenkins/jenkins.log
```

### Docker Permission Denied:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### SSH to Deployment EC2 Fails:
- Verify SSH key is correct in Jenkins credentials
- Check deployment EC2 security group allows inbound SSH from Jenkins server

### Webhook Not Triggering:
1. Go to GitHub repo → Settings → Webhooks
2. Click the webhook
3. Scroll to **Recent Deliveries** to see if requests are being sent
4. Check the response (Jenkins IP might need to be updated)

## Security Notes

- Change the default Jenkins admin password after setup
- Consider setting up HTTPS (use AWS Application Load Balancer)
- Restrict Jenkins UI access to your IP only (if possible)
- Store sensitive credentials securely in Jenkins

## Useful Commands

```bash
# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Restart Jenkins
sudo systemctl restart jenkins

# Check if port 8080 is listening
sudo netstat -tlnp | grep 8080
```

## Next Steps

After setup:
1. Verify the first build runs successfully
2. Test the webhook by pushing a code change
3. Monitor the deployment to your app server (98.93.104.219)
4. Access your site at `http://98.93.104.219:3000`
