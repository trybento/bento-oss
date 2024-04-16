variable "region" {
  description = "Default region to create resources in"
  default     = "us-east-1"
}

variable "environment_name" {
  type        = string
  description = "The name of the environment to create"
}

variable "cidr_block" {
  type        = string
  description = "CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_blocks" {
  type        = list(string)
  description = "CIDR blocks for the public subnets."
  default     = ["10.0.128.0/20", "10.0.144.0/20"]
}

variable "private_subnet_cidr_blocks" {
  type        = list(string)
  description = "CIDR blocks for the private subnets."
  default     = ["10.0.0.0/19", "10.0.32.0/19"]
}

variable "database_name" {
  type        = string
  description = "Name of default database created when RDS is provisioned"
  default     = "bentodb"
}

variable "database_user" {
  type        = string
  description = "The database username"
  sensitive   = true
}

variable "database_password" {
  type        = string
  description = "The database password"
  sensitive   = true
}

variable "database_storage" {
  type        = number
  description = "The intial database storage in GB"
}

variable "database_max_storage" {
  type        = number
  description = "The maximum database storage in GB, used by storage auto-scaling"
}

variable "database_storage_type" {
  type        = string
  description = "Determines the storage class to use for the database (gp2/io1)"
}

variable "database_backup_retention_period" {
  type        = number
  description = "The backup retention period in days for the primary DB instance"
}

variable "database_storage_iops" {
  type        = number
  description = "The number of IOPS provisioned for the database storage"
  default     = null
}

variable "database_instance_class" {
  type        = string
  description = "The instance class for the primary database instance"
}


variable "database_multi_az_enabled" {
  type        = bool
  description = "Determines if multi-AZ is enabled for the primary database instance"
}

variable "database_performance_insights_enabled" {
  type        = bool
  description = "Determines if RDS Performance Insights is enabled for the primary database instance"
  default     = false
}

variable "alb_certificate_arn" {
  type        = string
  description = "ALB HTTPS certificate ARN"
}

variable "redis_cache_instance_type" {
  type        = string
  description = "The instance type for the caching Redis cluster"
}

variable "redis_cache_instance_count" {
  type        = string
  description = "The number of caching Redis nodes to run"
}

variable "redis_workers_instance_type" {
  type        = string
  description = "The instance type for the Redis cluster used by BullMQ workers"
}

variable "redis_workers_instance_count" {
  type        = string
  description = "The number of Redis nodes to run for BullMQ workers"
}

variable "udon_hostname" {
  type        = string
  description = "The hostname used by the ALB to route Udon traffic (e.g., udon.trybento.co)"
}

variable "miso_hostname" {
  type        = string
  description = "The hostname used by the ALB to route Miso traffic (e.g., everboarding.trybento.co)"
}

variable "bento_ecr_image_url" {
  type        = string
  description = "The Bento ECR image URL to use for containers"
}

variable "udon_web_count" {
  type        = number
  description = "The number of Udon web instances to run"
}

variable "udon_web_cpu" {
  type        = number
  description = "The number of CPU units for the Udon web instances"
}

variable "udon_web_memory" {
  type        = number
  description = "The amount of RAM for the Udon web instances"
}

variable "udon_worker_count" {
  type        = number
  description = "The number of Udon worker instances to run"
}

variable "udon_worker_cpu" {
  type        = number
  description = "The number of CPU units for the Udon worker instances"
}

variable "udon_worker_memory" {
  type        = number
  description = "The amount of RAM for the Udon worker instances"
}

variable "udon_priority_worker_count" {
  type        = number
  description = "The number of Udon priority worker instances to run"
}

variable "udon_priority_worker_cpu" {
  type        = number
  description = "The number of CPU units for the Udon priority worker instances"
}

variable "udon_priority_worker_memory" {
  type        = number
  description = "The amount of RAM for the Udon priority worker instances"
}

variable "miso_count" {
  type        = number
  description = "The number of Miso instances to run"
}

variable "miso_cpu" {
  type        = number
  description = "The number of CPU units for the Miso instances"
}

variable "miso_memory" {
  type        = number
  description = "The amount of RAM for the Miso instances"
}

variable "bastion_ami" {
  type        = string
  description = "The Amazon Machine Image (AMI) to use for the bastion EC2 instance"
}

variable "bastion_instance_type" {
  type        = string
  description = "The Amazon Machine Image (AMI) to use for the bastion EC2 instance"
}

variable "bastion_public_key" {
  type        = string
  description = "The public SSH key used for the bastion SSH keypair"
}

variable "s3_bucket_prefix" {
  type        = string
  description = "A unique prefix for S3 buckets to avoid name clashes"
}
