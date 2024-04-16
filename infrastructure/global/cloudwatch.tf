resource "aws_cloudwatch_log_group" "restart_ecs_on_ssm_change" {
  name              = "/aws/lambda/${aws_lambda_function.restart_ecs_on_ssm_change.function_name}"
  retention_in_days = 3
}
