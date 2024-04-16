resource "aws_ecs_cluster" "default" {
  name = "bento-${var.environment_name}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}
