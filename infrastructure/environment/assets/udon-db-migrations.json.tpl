[
    {
        "name": "udon-db-migrations",
        "essential": true,
        "image": "${ecr_image_url}",
        "command": ["yarn", "migrate"],
        "cpu": 0,
        "portMappings": [],
        "mountPoints": [],
        "volumesFrom": [],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "bento-${environment_name}",
                "awslogs-region": "${region}",
                "awslogs-create-group": "true",
                "awslogs-stream-prefix": "udon-db-migrations"
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
