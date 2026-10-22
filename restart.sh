#!/bin/bash
docker container stop tictactoe-frontend
docker container rm tictactoe-frontend
docker rmi ai-tic-tac-toe-frontend
if [[ "$1" == "prod" ]]; then
	docker compose up -f prod.yml -d
else
	docker compose up -f dev.yml -d
fi
