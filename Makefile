# ==== Config ====
COMPOSE := docker compose
PGHOST_PORT ?= 5433
PGADMIN_PORT ?= 5050

# start full stack (DB, API, pgAdmin)
dev-up:
	@$(COMPOSE) down
	@$(COMPOSE) up -d --build
	@echo "API  => http://localhost:8000"
	@echo "pgAdmin => http://localhost:$(PGADMIN_PORT)"
	@echo "Web     => http://localhost:3000"

# remove contaienrs (data persists)
dev-down:
	@$(COMPOSE) down

# nuke everything (including db)
clean:
	@$(COMPOSE) down -v

logs-api:
	@$(COMPOSE) logs -f api

logs-db:
	@$(COMPOSE) logs -f db

logs-web:
	@$(COMPOSE) logs -f web

psql:
	@$(COMPOSE) exec db psql -U app_user -d precision_db

# health check
health:
	@curl -s http://localhost:8000/health || true
	@echo
	@$(COMPOSE) exec db psql -U app_user -d precision_db -c "SELECT 1;" || true

# create a user based on these specs for testing
seed-user:
	@curl -s -X POST http://localhost:8000/api/auth/signup \
	  -H "Content-Type: application/json" \
	  -d '{"first_name":"Bob","last_name":"theebuilder","email":"bob@example.com","phone":"+14155550123","password":"Secret6969!","confirm_password":"Secret6969!"}' | jq .

# rebuild API (no cache)
rebuild-api:
	@$(COMPOSE) build --no-cache api

seed-inventory:
	@docker compose exec api python app/scripts/seed_inventory.py