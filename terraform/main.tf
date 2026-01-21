terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Use default VPC
data "aws_vpc" "default" {
  default = true
}

# Use default subnet
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group for React App in default VPC
resource "aws_security_group" "app" {
  name        = "${var.project_name}-app-sg"
  description = "Security group for React application"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "React Dev Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-app-sg"
  }
}

# Create/import an EC2 key pair from provided public key (if given)
resource "aws_key_pair" "app_key" {
  count      = length(trimspace(var.ssh_public_key)) > 0 ? 1 : 0
  key_name   = var.key_name
  public_key = var.ssh_public_key
}

# EC2 Instance for React App
resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = var.app_instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name               = length(aws_key_pair.app_key) > 0 ? aws_key_pair.app_key[0].key_name : var.key_name
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
              
              # Install Docker
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
              sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
              sudo apt-get update
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "${var.project_name}-app-server"
  }
}
