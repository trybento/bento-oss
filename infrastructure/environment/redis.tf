resource "aws_elasticache_subnet_group" "default" {
  name       = "bento-${lower(var.environment_name)}"
  subnet_ids = aws_subnet.private.*.id

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}

resource "aws_elasticache_replication_group" "default" {
  apply_immediately          = false
  replication_group_id       = "bento-${substr(lower(var.environment_name), 0, 34)}" // Must be max 40 chars in total
  description                = "${var.environment_name} Redis group"
  num_cache_clusters         = var.redis_cache_instance_count
  node_type                  = var.redis_cache_instance_type
  automatic_failover_enabled = true
  engine                     = "redis"
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  engine_version             = "6.2"
  parameter_group_name       = "default.redis6.x"
  port                       = 6379
  subnet_group_name          = aws_elasticache_subnet_group.default.name
  security_group_ids         = [aws_security_group.redis.id]
  maintenance_window         = "Sat:10:00-Sat:14:00"
  snapshot_retention_limit   = 0 // Disable backups

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}

resource "aws_elasticache_parameter_group" "workers" {
  name   = "${substr(lower(var.environment_name), 0, 34)}-workers"
  family = "redis6.x"

  parameter {
    name  = "maxmemory-policy"
    value = "noeviction"
  }
}

resource "aws_elasticache_replication_group" "workers" {
  apply_immediately          = false
  replication_group_id       = "bento-${substr(lower(var.environment_name), 0, 34)}-workers" // Must be max 40 chars in total
  description                = "${var.environment_name} worker Redis group"
  num_cache_clusters         = var.redis_workers_instance_count
  node_type                  = var.redis_workers_instance_type
  automatic_failover_enabled = true
  engine                     = "redis"
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  engine_version             = "6.2"
  parameter_group_name       = aws_elasticache_parameter_group.workers.name
  port                       = 6379
  subnet_group_name          = aws_elasticache_subnet_group.default.name
  security_group_ids         = [aws_security_group.redis.id]
  maintenance_window         = "Sat:10:00-Sat:14:00"
  snapshot_retention_limit   = 0 // Disable backups

  tags = {
    EnvironmentName = var.environment_name
    ApplicationName = "udon"
  }
}
