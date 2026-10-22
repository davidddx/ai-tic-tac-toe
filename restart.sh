#!/bin/bash
docker container stop tictactoe-frontend
docker container rm tictactoe-frontend
docker rmi ai-tic-tac-toe-frontend
if [[ "$1" == "prod" ]]; then
	docker compose -f prod.yml up -d
else
	docker compose -f dev.yml up  -d
fi
