resource "aws_ecs_task_definition" "udon_web" {
  family                   = "${var.environment_name}-udon-web"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.udon_web_cpu
  memory                   = var.udon_web_memory
  execution_role_arn       = aws_iam_role.execution_role.arn
  task_role_arn            = aws_iam_role.task_role.arn
  skip_destroy             = true

  container_definitions = templatefile("./assets/udon-web.json.tpl", {
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

resource "aws_ecs_service" "udon_web" {
  name                               = "${var.environment_name}-udon-web"
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.udon_web.arn
  desired_count                      = var.udon_web_count
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
    target_group_arn = aws_lb_target_group.udon.arn
    container_name   = "udon-web"
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
    ApplicationName = "udon"
  }
}
