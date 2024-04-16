resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  cidr_block              = var.public_subnet_cidr_blocks[count.index]
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_eip" "nat" {
  count = 2

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_nat_gateway" "nat" {
  count         = 2
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_subnet" "private" {
  count             = 2
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = var.private_subnet_cidr_blocks[count.index]
  vpc_id            = aws_vpc.main.id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_route_table" "private" {
  count  = 2
  vpc_id = aws_vpc.main.id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}

resource "aws_route" "private" {
  count                  = 2
  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  route_table_id = aws_route_table.private[count.index].id
  subnet_id      = aws_subnet.private[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_eip" "bastion" {
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    EnvironmentName = var.environment_name
  }
}
