resource "aws_ecs_task_definition" "miso" {
  family                   = "${var.environment_name}-miso"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.miso_cpu
  memory                   = var.miso_memory
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn

  container_definitions = templatefile("./assets/miso.json.tpl", {
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
    ApplicationName = "miso"
  }
}

resource "aws_ecs_service" "miso" {
  name                               = "${var.environment_name}-miso"
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.miso.arn
  desired_count                      = var.miso_count
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 300
  launch_type                        = "FARGATE"

  network_configuration {
    assign_public_ip = false
    subnets          = aws_subnet.private.*.id
    security_groups  = [aws_security_group.ecs.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.miso.arn
    container_name   = "miso"
    container_port   = 80
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
    ApplicationName = "miso"
  }
}
