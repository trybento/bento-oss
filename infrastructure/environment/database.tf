locals {
  db_backup_window      = "08:00-10:00"
  db_maintenance_window = "Sat:10:00-Sat:14:00"
}

resource "aws_db_subnet_group" "default" {
  name       = "${var.environment_name}-udon"
  subnet_ids = aws_subnet.private.*.id

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_db_instance" "primary" {
  identifier                            = "${var.environment_name}-udon"
  db_subnet_group_name                  = aws_db_subnet_group.default.name
  vpc_security_group_ids                = [aws_security_group.database.id]
  engine                                = "postgres"
  engine_version                        = "12"
  db_name                               = var.database_name
  username                              = var.database_user
  password                              = var.database_password
  instance_class                        = var.database_instance_class
  allocated_storage                     = var.database_storage
  max_allocated_storage                 = var.database_max_storage
  apply_immediately                     = false
  storage_type                          = var.database_storage_type
  iops                                  = var.database_storage_iops
  multi_az                              = var.database_multi_az_enabled
  storage_encrypted                     = true
  deletion_protection                   = true
  skip_final_snapshot                   = false
  final_snapshot_identifier             = "${var.environment_name}-udon-final-snapshot"
  backup_retention_period               = var.database_backup_retention_period
  backup_window                         = local.db_backup_window
  maintenance_window                    = local.db_maintenance_window
  port                                  = 5432
  enabled_cloudwatch_logs_exports       = ["postgresql"]
  publicly_accessible                   = false
  monitoring_interval                   = 30
  monitoring_role_arn                   = aws_iam_role.rds_enhanced_monitoring.arn
  performance_insights_enabled          = var.database_performance_insights_enabled
  performance_insights_retention_period = var.database_performance_insights_enabled ? 7 : null

  tags = {
    EnvironmentName = var.environment_name
  }
}
