# Зададим регион по умолчанию
provider "aws" {
  region = "us-east-1"
}

# Деплоить лямбду будем через zip архив. Поэтому необходимо положить наш код в архив
data "archive_file" "app_zip" {
  type        = "zip"
  source_dir  = "../app/dist"
  output_path = "./app.zip"
}

# Создадим API GW
resource "aws_apigatewayv2_api" "app" {
  name          = "api"
  protocol_type = "HTTP"
}

# И добавим в него stage.
resource "aws_apigatewayv2_stage" "app" {
  api_id = aws_apigatewayv2_api.app.id

  name        = "api"
  auto_deploy = true

  # добавим логирования API GW в CloudWatch
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    }
    )
  }
}

# Создадим интеграцию Lambda в API GW
resource "aws_apigatewayv2_integration" "app" {
  api_id = aws_apigatewayv2_api.app.id

  integration_uri    = aws_lambda_function.app.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
# Добавим Route - любой route должен вызывать нашу лямбду
resource "aws_apigatewayv2_route" "app" {
  api_id = aws_apigatewayv2_api.app.id

  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.app.id}"
}
# Добавим лог группу в Cloud Watch для API GW
resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.app.name}"
  retention_in_days = 30
}

# Добавим достум API GW вызывать лямбда функцию
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.app.execution_arn}/*/*"
}
# Создадим Security Group для базы данных и настроем ее так, чтоб можно было достучаться до нее из вне
# Внимание это настройка только для демо. для продакшн так делать нельзя.
resource "aws_security_group" "allow_db" {
  name        = "allow_db"
  description = "Allow DB"

  ingress {
    from_port        = 5430
    to_port          = 5440
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
# Создадим рандомный пароль для базы
resource "random_password" "password" {
  length           = 20
  special          = false
  override_special = "_%@"
}
# Создадим инстанс базы
resource "aws_db_instance" "default" {
  allocated_storage      = 20
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  engine                 = "postgres"
  identifier             = "dev-db"
  engine_version         = "13"
  instance_class         = "db.t3.micro"
  name                   = "nest"
  username               = "postgres"
  password               = random_password.password.result
  skip_final_snapshot    = true
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.allow_db.id]

}

# Настроим подсеть 'a' для региона us-east-1
resource "aws_default_subnet" "db_subnet_a" {
  availability_zone = "us-east-1a"
  tags = {
    Name = "Default subnet for us-east-1a"
  }
}

# Настроим подсеть 'b' для региона us-east-1
resource "aws_default_subnet" "db_subnet_b" {
  availability_zone = "us-east-1b"

  tags = {
    Name = "Default subnet for us-east-1b"
  }
}

# Объеденим подсети в группу
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db_subnet_group"
  subnet_ids = [aws_default_subnet.db_subnet_a.id, aws_default_subnet.db_subnet_b.id]
}

# Создать лямбда функцию, используя архив с кодом
resource "aws_lambda_function" "app" {
  filename         = data.archive_file.app_zip.output_path
  source_code_hash = data.archive_file.app_zip.output_base64sha256
  function_name    = "app"
  handler          = "serverless.handler"
  runtime          = "nodejs14.x"
  memory_size      = 1024
  role             = aws_iam_role.lambda_exec.arn
  timeout          = 30
  # зададим перенные окружения, указав доступ к базе
  environment {
    variables = {
      POSTGRES_HOST     = aws_db_instance.default.address
      POSTGRES_PORT     = aws_db_instance.default.port
      POSTGRES_USER     = aws_db_instance.default.username
      POSTGRES_PASSWORD = random_password.password.result
      POSTGRES_DATABASE = aws_db_instance.default.name
      MAPBOX_TOKEN      = var.mapbox_token
      NODE_ENV          = "production"
    }
  }
}

# Добавим лог группу в CloudWatch для лямбда-функции
resource "aws_cloudwatch_log_group" "app" {
  name = "/aws/lambda/${aws_lambda_function.app.function_name}"
  retention_in_days = 30
}

# Создать роль для лямбды
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Sid       = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Присоединим стандартный полиси к роли с доступ к VPC
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
