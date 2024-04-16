resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.environment_name}/udon/DATABASE_URL"
  type  = "SecureString"
  value = "postgres://${var.database_user}:${var.database_password}@${aws_db_instance.primary.endpoint}/${var.database_name}"
}

resource "aws_ssm_parameter" "database_host" {
  name  = "/${var.environment_name}/udon/DATABASE_HOST"
  type  = "String"
  value = aws_db_instance.primary.endpoint
}

resource "aws_ssm_parameter" "database_name" {
  name  = "/${var.environment_name}/udon/DATABASE_NAME"
  type  = "String"
  value = var.database_name
}

resource "aws_ssm_parameter" "database_password" {
  name  = "/${var.environment_name}/udon/DATABASE_PASSWORD"
  type  = "SecureString"
  value = var.database_password
}

resource "aws_ssm_parameter" "database_username" {
  name  = "/${var.environment_name}/udon/DATABASE_USERNAME"
  type  = "SecureString"
  value = var.database_user
}

resource "aws_ssm_parameter" "redis_url" {
  name  = "/${var.environment_name}/udon/REDIS_URL"
  type  = "String"
  value = "rediss://:@${aws_elasticache_replication_group.default.primary_endpoint_address}:${aws_elasticache_replication_group.default.port}"
}

resource "aws_ssm_parameter" "worker_redis_url" {
  name  = "/${var.environment_name}/udon/WORKER_REDIS_URL"
  type  = "String"
  value = "rediss://:@${aws_elasticache_replication_group.workers.primary_endpoint_address}:${aws_elasticache_replication_group.workers.port}"
}

resource "aws_ssm_parameter" "udon_s3_upload_bucket" {
  name  = "/${var.environment_name}/udon/AWS_S3_UPLOAD_BUCKET"
  type  = "String"
  value = aws_s3_bucket.uploads.bucket_domain_name
}

resource "aws_ssm_parameter" "udon_embed_versionless_url" {
  name  = "/${var.environment_name}/udon/EMBED_VERSION_LESS_URL"
  type  = "String"
  value = "https://${aws_s3_bucket.embed.bucket_domain_name}/bento-embed-${var.environment_name}"
}

resource "aws_ssm_parameter" "miso_embed_url" {
  name  = "/${var.environment_name}/miso/NEXT_PUBLIC_EMBEDDABLE_SRC"
  type  = "String"
  value = "https://${aws_s3_bucket.embed.bucket_domain_name}/bento-embed-${var.environment_name}.js"
}

resource "aws_ssm_parameter" "miso_s3_upload_bucket" {
  name  = "/${var.environment_name}/miso/NEXT_PUBLIC_UPLOADS_HOST"
  type  = "String"
  value = aws_s3_bucket.uploads.bucket_domain_name
}
