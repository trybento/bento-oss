resource "aws_ecs_task_definition" "udon_worker" {
  family                   = "${var.environment_name}-udon-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.udon_worker_cpu
  memory                   = var.udon_worker_memory
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = templatefile("./assets/udon-worker.json.tpl", {
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

resource "aws_ecs_service" "udon_worker" {
  name                               = "${var.environment_name}-udon-worker"
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.udon_worker.arn
  desired_count                      = var.udon_worker_count
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  launch_type                        = "FARGATE"

  network_configuration {
    assign_public_ip = false
    subnets          = aws_subnet.private.*.id
    security_groups  = [aws_security_group.ecs.id]
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}
