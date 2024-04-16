resource "aws_key_pair" "bastion" {
  key_name   = "${var.environment_name}-bastion-key"
  public_key = var.bastion_public_key

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_instance" "bastion" {
  ami                         = var.bastion_ami
  instance_type               = var.bastion_instance_type
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.bastion.key_name
  subnet_id                   = aws_subnet.public[0].id

  root_block_device {
    volume_size = "8"
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_eip_association" "bastion" {
  instance_id   = aws_instance.bastion.id
  allocation_id = aws_eip.bastion.id
}
