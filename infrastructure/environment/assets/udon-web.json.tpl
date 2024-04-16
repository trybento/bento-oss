[
    {
        "name": "udon-web",
        "image": "${ecr_image_url}",
        "cpu": 0,
        "portMappings": [
            {
                "containerPort": 80,
                "hostPort": 80,
                "protocol": "tcp"
            }
        ],
        "essential": true,
        "command": [
            "yarn",
            "workspace",
            "udon",
            "start"
        ],
        "environment": [
            {
                "name": "SSM_PATH",
                "value": "/${environment_name}/udon/"
            }
        ],
        "mountPoints": [],
        "volumesFrom": [],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "bento-${environment_name}",
                "awslogs-region": "${region}",
                "awslogs-create-group": "true",
                "awslogs-stream-prefix": "udon-web"
            }
        }
    }
]
