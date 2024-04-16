resource "aws_ecs_task_definition" "db_migrations" {
  family                   = "${var.environment_name}-udon-db-migrations"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.udon_worker_cpu
  memory                   = var.udon_worker_memory
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = templatefile("./assets/udon-db-migrations.json.tpl", {
    ecr_image_url    = var.bento_ecr_image_url
    environment_name = var.environment_name
    region           = var.region
  })

  lifecycle {
    create_before_destroy = true
  }

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}
