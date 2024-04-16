[
    {
        "name": "udon-priority-worker",
        "essential": true,
        "cpu": 0,
        "portMappings": [],
        "mountPoints": [],
        "volumesFrom": [],
        "image": "${ecr_image_url}",
        "command": ["yarn", "workspace", "udon", "start-priority-worker"],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "bento-${environment_name}",
                "awslogs-region": "${region}",
                "awslogs-create-group": "true",
                "awslogs-stream-prefix": "udon-priority-worker"
            }
        },
        "environment": [
            {
                "name": "SSM_PATH",
                "value": "/${environment_name}/udon/"
            }
        ]
    }
]
