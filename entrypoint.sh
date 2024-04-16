#!/bin/sh

echo "Setting environment variables from SSM using '$SSM_PATH'"

parameters=$(aws ssm get-parameters-by-path --with-decryption --query "Parameters[]" --path "$SSM_PATH")

echo $parameters | jq '.[] | "\(.Name | split("/") | .[3] | @sh)=\(.Value | @sh)"' | xargs -I'{}' echo 'export {}' >> /etc/profile

source /etc/profile

exec "$@"
