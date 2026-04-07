include .env

COMPOSE = docker compose
DB_CONTAINER = church-saas-db
CACHE_CONTAINER = church-saas-cache

help:
	@echo "Available commands:"
	@echo " make up          Start containers"
	@echo " make down        Stop containers"
	@echo " make down-volumes Stop + remove volumes"
	@echo " make logs        Follow logs"
	@echo " make ps          Show containers"
	@echo " make psql        Open PostgreSQL shell"
	@echo " make redis       Open Redis CLI"
	@echo " make env         Show loaded environment variables"

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

down-volumes:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

psql:
	docker exec -it $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

redis:
	docker exec -it $(CACHE_CONTAINER) redis-cli

env:
	@echo "DB_USER=$(DB_USER)"
	@echo "DB_NAME=$(DB_NAME)"
	@echo "DB_PASSWORD=$(DB_PASSWORD)"

.PHONY: help up down down-volumes logs ps psql redis env