output "application_url" {
  value = aws_lb.default.dns_name
}

output "bastion_ip" {
  value = aws_instance.bastion.public_ip
}

output "rds_url" {
  value = aws_db_instance.primary.endpoint
}
