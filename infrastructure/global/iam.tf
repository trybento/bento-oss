resource "aws_iam_role" "restart_ecs_on_ssm_change" {
  name = "${var.environment_prefix}-ssm-ecs-restarter"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "ecs-restart"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "ecs:UpdateService",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
          ]
          Effect   = "Allow"
          Resource = "*"
        },
      ]
    })
  }
}
