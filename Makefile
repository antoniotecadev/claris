include .env

COMPOSE = docker compose

help:
	@echo "Available commands:"
	@echo "  make up             Build and start all containers (Monorepo)"
	@echo "  make up-frontend    Build and start frontend service"
	@echo "  make up-backend     Build and start backend service"
	@echo "  make down           Stop containers"
	@echo "  make down-frontend  Stop frontend service"
	@echo "  make down-backend   Stop backend service"
	@echo "  make down-volumes   Stop + remove volumes (clean database)"
	@echo "  make logs           Follow logs of all services"
	@echo "  make logs-frontend  Follow logs of frontend service"
	@echo "  make logs-backend   Follow logs of backend service"
	@echo "  make start-frontend Start frontend service"
	@echo "  make start-backend  Start backend service"
	@echo "  make stop-frontend  Stop frontend service"
	@echo "  make stop-backend   Stop backend service"
	@echo "  make restart-frontend Restart frontend service"
	@echo "  make restart-backend  Restart backend service"
	@echo "  make ps             Show running containers"
	@echo "  make psql           Open PostgreSQL shell inside the container"
	@echo "  make env            Show loaded environment variables"
	@echo "  make migrate        Force run Prisma migrations inside backend container"
	@echo "  make studio         Open Prisma Studio from inside backend container"

up:
	$(COMPOSE) up -d --build

up-frontend:
	$(COMPOSE) up -d --build frontend

up-backend:
	$(COMPOSE) up -d --build backend

down:
	$(COMPOSE) down

down-frontend:
	$(COMPOSE) down frontend

down-backend:
	$(COMPOSE) down backend


down-volumes:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

logs-frontend:
	$(COMPOSE) logs frontend

logs-backend:
	$(COMPOSE) logs backend

start-frontend:
	$(COMPOSE) start frontend

start-backend:
	$(COMPOSE) start backend

stop-frontend:
	$(COMPOSE) stop frontend

stop-backend:
	$(COMPOSE) stop backend

restart-frontend:
	$(COMPOSE) restart frontend

restart-backend:
	$(COMPOSE) restart backend

ps:
	$(COMPOSE) ps

psql:
	docker exec -it $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)


env:
	@echo "Loaded environment variables:"
	@echo "PORT_NEST=$(PORT_NEST)"
	@echo "DB_HOST=$(DB_HOST)"
	@echo "DB_PORT=$(DB_PORT)"
	@echo "DB_USER=$(DB_USER)"
	@echo "DB_PASSWORD=$(DB_PASSWORD)"
	@echo "DB_NAME=$(DB_NAME)"
	@echo "DB_CONTAINER=$(DB_CONTAINER)"
	@echo "DATABASE_URL=$(DATABASE_URL)"
	@echo "JWT_SECRET=$(JWT_SECRET)"
	@echo "PUBLIC_API_KEY=$(PUBLIC_API_KEY)"
	@echo "GOOGLE_CLIENT_ID=$(GOOGLE_CLIENT_ID)"
	@echo "GOOGLE_CLIENT_SECRET=$(GOOGLE_CLIENT_SECRET)"
	@echo "GOOGLE_CALLBACK_URL=$(GOOGLE_CALLBACK_URL)"
	@echo "FRONTEND_URL=$(FRONTEND_URL)"
	@echo "RESEND_API_KEY=$(RESEND_API_KEY)"
	@echo "RESEND_FROM_EMAIL=$(RESEND_FROM_EMAIL)"
	@echo "CLOUDINARY_CLOUD_NAME=$(CLOUDINARY_CLOUD_NAME)"
	@echo "CLOUDINARY_API_KEY=$(CLOUDINARY_API_KEY)"
	@echo "CLOUDINARY_API_SECRET=$(CLOUDINARY_API_SECRET)"
	@echo "NEXT_PUBLIC_PORT=$(NEXT_PUBLIC_PORT)"
	@echo "NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL)"

# ==============================================================================
# DOCKER MONOREPO EXTENSIONS
# ==============================================================================

# O próprio docker-compose já faz o migrate ao subir, mas se precisar forçar:
migrate:
	@echo "Running Prisma migrations inside the backend container..."
	docker exec -it claris-backend npx prisma migrate dev

# Popula o banco de dados com dados de teste de dentro do container
seed:
	@echo "Populating database with Prisma seed..."
	docker exec -it claris-backend npx prisma db seed

# Abre o Prisma Studio dentro do container e expõe para o seu navegador local
studio:
	@echo "Opening Prisma Studio inside container..."
	docker exec -it claris-backend npx prisma studio --browser none

.PHONY: help up down down-volumes logs ps psql env migrate seed studio