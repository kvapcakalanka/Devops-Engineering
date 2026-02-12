# Remote setup script to copy files and deploy the application (PowerShell version)
# Run this script from your local Windows machine after Terraform apply

param(
    [Parameter(Mandatory=$true)]
    [string]$InstanceIP,
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPath = "$env:USERPROFILE\.ssh\react-devops-key.pem"
)

# Colors
$Green = "`e[32m"
$Blue = "`e[34m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$NC = "`e[0m"

Write-Host "${Blue}========================================${NC}"
Write-Host "${Blue}Setting up Full Stack Application${NC}"
Write-Host "${Blue}========================================${NC}"
Write-Host "${Blue}Instance IP: $InstanceIP${NC}"
Write-Host "${Blue}SSH Key: $KeyPath${NC}"
Write-Host ""

# Check if key file exists
if (-not (Test-Path $KeyPath)) {
    Write-Host "${Red}Error: SSH key file not found at $KeyPath${NC}"
    exit 1
}

# Set correct permissions for SSH key (Windows)
icacls $KeyPath /inheritance:r
icacls $KeyPath /grant:r "$($env:USERNAME):(R)"

# Wait for instance to be ready
Write-Host "${Blue}Waiting for instance to be ready...${NC}"
Start-Sleep -Seconds 30

# Test SSH connection
Write-Host "${Blue}Testing SSH connection...${NC}"
ssh -i $KeyPath -o StrictHostKeyChecking=no ubuntu@$InstanceIP "echo 'SSH connection successful'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}SSH connection failed. Please check your key and instance IP.${NC}"
    exit 1
}

# Copy project files to EC2
Write-Host "${Blue}Copying project files to EC2 instance...${NC}"

# Navigate to parent directory
Push-Location ..

# Create remote directory structure
ssh -i $KeyPath ubuntu@$InstanceIP "mkdir -p /home/ubuntu/app"

# Copy Backend files
Write-Host "${Blue}Copying Backend files...${NC}"
scp -i $KeyPath -r Backend ubuntu@${InstanceIP}:/home/ubuntu/app/

# Copy Frontend files
Write-Host "${Blue}Copying Frontend files...${NC}"
scp -i $KeyPath -r Frontend ubuntu@${InstanceIP}:/home/ubuntu/app/

# Copy docker-compose.yml
Write-Host "${Blue}Copying docker-compose.yml...${NC}"
scp -i $KeyPath docker-compose.yml ubuntu@${InstanceIP}:/home/ubuntu/app/

# Copy deployment script
Write-Host "${Blue}Copying deployment script...${NC}"
scp -i $KeyPath terraform\deploy.sh ubuntu@${InstanceIP}:/home/ubuntu/app/
ssh -i $KeyPath ubuntu@$InstanceIP "chmod +x /home/ubuntu/app/deploy.sh"

# Run deployment script on remote instance
Write-Host "${Blue}Running deployment script on EC2 instance...${NC}"
ssh -i $KeyPath ubuntu@$InstanceIP "cd /home/ubuntu/app && ./deploy.sh"

Pop-Location

Write-Host "${Green}========================================${NC}"
Write-Host "${Green}✅ Setup Complete!${NC}"
Write-Host "${Green}========================================${NC}"
Write-Host "${Blue}Your application should now be running at:${NC}"
Write-Host "  Frontend: ${Green}http://${InstanceIP}:3000${NC}"
Write-Host "  Backend API: ${Green}http://${InstanceIP}:5000${NC}"
Write-Host ""
Write-Host "${Blue}To SSH into your instance:${NC}"
Write-Host "  ${Green}ssh -i $KeyPath ubuntu@$InstanceIP${NC}"
Write-Host "${Green}========================================${NC}"
