#!/bin/bash
docker container stop ai-tic-tac-toe-frontend-container
docker container rm ai-tic-tac-toe-frontend-container
docker rmi ai-tic-tac-toe-frontend

if [[ "$1" == "prod" ]]; then
	docker compose -f prod.yml up -d
else
	docker compose -f dev.yml up  -d
fi
