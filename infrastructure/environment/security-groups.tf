resource "aws_security_group" "database" {
  description = "Controls access to/from the AWS RDS database instance(s)"
  name        = "${var.environment_name}-rds"
  vpc_id      = aws_vpc.main.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_security_group" "alb" {
  description = "Access to the load balancer that sits in front of ECS"
  vpc_id      = aws_vpc.main.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_security_group" "ecs" {
  description = "Access to the ECS services and the tasks/containers that run in them"
  vpc_id      = aws_vpc.main.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_security_group" "redis" {
  description = "Access to Redis"
  vpc_id      = aws_vpc.main.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_security_group" "bastion" {
  description = "Access to the Bastion host"
  vpc_id      = aws_vpc.main.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_security_group_rule" "database_ecs_incoming" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  source_security_group_id = aws_security_group.ecs.id
  security_group_id        = aws_security_group.database.id
}

resource "aws_security_group_rule" "database_bastion_incoming" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  source_security_group_id = aws_security_group.bastion.id
  security_group_id        = aws_security_group.database.id
}

resource "aws_security_group_rule" "database_outgoing" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.database.id
}

resource "aws_security_group_rule" "redis_ecs_incoming" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  source_security_group_id = aws_security_group.ecs.id
  security_group_id        = aws_security_group.redis.id
}

resource "aws_security_group_rule" "redis_bastion_incoming" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "-1"
  source_security_group_id = aws_security_group.bastion.id
  security_group_id        = aws_security_group.redis.id
}

resource "aws_security_group_rule" "ecs_incoming" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  source_security_group_id = aws_security_group.alb.id
  security_group_id        = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "ecs_outgoing" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
  security_group_id = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "alb_incoming" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "alb_ecs" {
  type                     = "egress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ecs.id
  security_group_id        = aws_security_group.alb.id
}

resource "aws_security_group_rule" "bastion_incoming_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.bastion.id
}

resource "aws_security_group_rule" "bastion_outgoing" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.bastion.id
}
