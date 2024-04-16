resource "aws_s3_bucket" "uploads" {
  bucket = "${var.s3_bucket_prefix}-${var.environment_name}-uploads"
}

resource "aws_s3_bucket_ownership_controls" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "uploads" {
  depends_on = [
    aws_s3_bucket_ownership_controls.uploads,
    aws_s3_bucket_public_access_block.uploads,
  ]

  bucket = aws_s3_bucket.uploads.id
  acl    = "public-read"
}

data "aws_iam_policy_document" "uploads" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = [
      aws_s3_bucket.uploads.arn,
      "${aws_s3_bucket.uploads.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  policy = data.aws_iam_policy_document.uploads.json
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = ["Access-Control-Allow-Origin"]
  }
}


resource "aws_s3_bucket" "embed" {
  bucket = "${var.s3_bucket_prefix}-${var.environment_name}-embed"
}

resource "aws_s3_bucket_ownership_controls" "embed" {
  bucket = aws_s3_bucket.embed.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "embed" {
  bucket                  = aws_s3_bucket.embed.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "embed" {
  depends_on = [
    aws_s3_bucket_ownership_controls.embed,
    aws_s3_bucket_public_access_block.embed,
  ]

  bucket = aws_s3_bucket.embed.id
  acl    = "public-read"
}

data "aws_iam_policy_document" "embed" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = [
      aws_s3_bucket.embed.arn,
      "${aws_s3_bucket.embed.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "embed" {
  bucket = aws_s3_bucket.embed.id
  policy = data.aws_iam_policy_document.embed.json
}

resource "aws_s3_bucket_cors_configuration" "embed" {
  bucket = aws_s3_bucket.embed.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = ["Access-Control-Allow-Origin"]
  }
}
