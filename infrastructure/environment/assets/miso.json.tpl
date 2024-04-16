[
    {
        "name": "miso",
        "essential": true,
        "image": "${ecr_image_url}",
        "command": ["yarn", "workspace", "miso", "start"],
        "cpu": 0,
        "mountPoints": [],
        "volumesFrom": [],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "bento-${environment_name}",
                "awslogs-region": "${region}",
                "awslogs-create-group": "true",
                "awslogs-stream-prefix": "miso"
            }
        },
        "environment": [
            {
                "name": "SSM_PATH",
                "value": "/${environment_name}/miso/"
            }
        ],
        "portMappings": [
            {
                "containerPort": 80,
                "hostPort": 80,
                "protocol": "tcp"
            }
        ]
    }
]
