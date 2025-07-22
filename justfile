compose_file_dev := "compose.dev.yaml"

# Whatsapp-web.js bug
clear-singleton:
  sudo rm -rf ./bot/.misc ./bot/.npm ./bot/.wwebjs_cache

compose-dev-up:
  docker compose -f {{compose_file_dev}} up --build

compose-dev-down:
  docker compose -f {{compose_file_dev}} down

dev-stats:
  docker compose -f {{compose_file_dev}} stats

# usage: dev-it containerName, example: dev-it backend
dev-it container command:
  docker compose -f {{compose_file_dev}} exec {{container}} {{command}}

dev-up: compose-dev-up
# dev-up: clear-singleton compose-dev-up

dev-down: compose-dev-down
