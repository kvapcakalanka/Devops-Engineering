output "app_public_ip" {
  description = "Public IP of application server"
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "Application URL"
  value       = "http://${aws_instance.app.public_ip}"
}
