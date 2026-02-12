output "app_public_ip" {
  description = "Public IP of application server"
  value       = aws_instance.app.public_ip
}

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.app.id
}
