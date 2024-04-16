data "archive_file" "restart_ecs_on_ssm_change" {
  type        = "zip"
  source_file = "lambda/restart-ecs-on-ssm-change.js"
  output_path = "restart-ecs-on-ssm-change.zip"
}

resource "aws_lambda_function" "restart_ecs_on_ssm_change" {
  filename         = data.archive_file.restart_ecs_on_ssm_change.output_path
  function_name    = "${var.environment_prefix}-restart_ecs_on_ssm_change"
  role             = aws_iam_role.restart_ecs_on_ssm_change.arn
  source_code_hash = data.archive_file.restart_ecs_on_ssm_change.output_base64sha256
  runtime          = "nodejs16.x"
  handler          = "restart-ecs-on-ssm-change.handler"
  timeout          = 30

  environment {
    variables = {
      ENVIRONMENT_NAMES = jsonencode(var.ssm_environment_names)
    }
  }
}
