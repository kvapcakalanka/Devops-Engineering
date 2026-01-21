variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource tagging and naming"
  type        = string
  default     = "react-devops"
}

variable "ami_id" {
  description = "Ubuntu AMI ID for EC2 instances"
  type        = string
  default     = "ami-0c7217cdde317cfec"
}

variable "key_name" {
  description = "Existing AWS key pair name for SSH"
  type        = string
}

variable "ssh_public_key" {
  description = "Public key content to create/import EC2 key pair (e.g., contents of ~/.ssh/react-devops-key-2.pub)"
  type        = string
  default     = ""
}

variable "jenkins_instance_type" {
  description = "EC2 instance type for Jenkins"
  type        = string
  default     = "t2.medium"
}

variable "app_instance_type" {
  description = "EC2 instance type for the React app host"
  type        = string
  default     = "t2.micro"
}
