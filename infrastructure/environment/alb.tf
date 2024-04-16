resource "aws_lb" "default" {
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public.*.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_lb_target_group" "udon" {
  target_type          = "ip"
  vpc_id               = aws_vpc.main.id
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 30

  health_check {
    interval            = 5
    path                = "/internal/health"
    protocol            = "HTTP"
    timeout             = 3
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-299"
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}

resource "aws_lb_target_group" "miso" {
  target_type          = "ip"
  vpc_id               = aws_vpc.main.id
  port                 = 80
  protocol             = "HTTP"
  deregistration_delay = 30

  health_check {
    interval            = 5
    path                = "/health"
    protocol            = "HTTP"
    timeout             = 3
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-299"
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "miso"
  }
}

resource "aws_lb_listener" "default" {
  load_balancer_arn = aws_lb.default.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = var.alb_certificate_arn
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "udon" {
  listener_arn = aws_lb_listener.default.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.udon.arn
  }

  condition {
    host_header {
      values = [var.udon_hostname]
    }
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}

resource "aws_lb_listener_rule" "miso" {
  listener_arn = aws_lb_listener.default.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.miso.arn
  }

  condition {
    host_header {
      values = [var.miso_hostname]
    }
  }

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "miso"
  }
}

resource "aws_lb_listener" "ssl_redirect" {
  load_balancer_arn = aws_lb.default.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
