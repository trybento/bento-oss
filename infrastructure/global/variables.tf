variable "region" {
  type        = string
  description = "The region to create resources in"
}

variable "environment_prefix" {
  type        = string
  description = "Prefix to use when naming resources"
  default     = "bento"
}

variable "ecr_repository_name" {
  type        = string
  description = "The name of the ECR repository to create for Bento Docker builds"
}

variable "ssm_environment_names" {
  type        = list(string)
  description = "A list of environment names that should be watched by the lambda function responsible for restarting ECS services on SSM changes"
}
