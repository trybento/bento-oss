resource "aws_cloudwatch_event_rule" "restart_ecs_on_ssm_change" {
  name        = "${var.environment_prefix}-restart-ecs-on-ssm-change"
  description = "Triggers a Lambda to restart the relevent ECS services when a SSM parameter changes"

  event_pattern = jsonencode({
    source      = ["aws.ssm"]
    detail-type = ["Parameter Store Change"]
  })
}

resource "aws_cloudwatch_event_target" "restart_ecs_on_ssm_change" {
  rule = aws_cloudwatch_event_rule.restart_ecs_on_ssm_change.name
  arn  = aws_lambda_function.restart_ecs_on_ssm_change.arn
}

resource "aws_lambda_permission" "restart_ecs_on_ssm_change" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.restart_ecs_on_ssm_change.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.restart_ecs_on_ssm_change.arn
}
