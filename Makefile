# ==== Config ====
COMPOSE := docker compose
PGHOST_PORT ?= 5432
PGADMIN_PORT ?= 5050

# start full stack (DB, API, pgAdmin)
dev-up:
	@$(COMPOSE) down
	@$(COMPOSE) up -d --build
	@echo "API  => http://localhost:8000"
	@echo "pgAdmin => http://localhost:$(PGADMIN_PORT)"
	@echo "Web     => http://localhost:3000"

# remove containers (data persists)
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


# ======== TEST CONFIG ========
-include backend/.env

PYTEST_ADDOPTS ?= -vv -ra

test:
	@$(COMPOSE) up -d db
	@$(COMPOSE) exec -T db psql -U app_user -d postgres -c "DROP DATABASE IF EXISTS precision_test_db WITH (FORCE);"
	@$(COMPOSE) exec -T db psql -U app_user -d postgres -c "CREATE DATABASE precision_test_db;"
	@$(COMPOSE) run --rm \
	  -v $$PWD/backend:/app \
	  -w /app \
	  api sh -lc "pip install -q -r requirements.txt && DATABASE_URL=$(TEST_DB_URL) pytest $(PYTEST_ADDOPTS) --cov=app --cov-report=term-missing --cov-report=xml"
	@echo "Coverage report -> backend/coverage.xml"

# Install deps
fe-install:
	docker compose run --rm web sh -lc '\
if [ -f package-lock.json ]; then \
  npm ci || (echo "npm ci failed; updating lock with npm install..." && npm install); \
else \
  npm install; \
fi'

# Run all frontend tests (unit + integration)
fe-test: fe-install
	docker compose run --rm web sh -lc "npm test"

# Run with coverage
fe-coverage: fe-install
	docker compose run --rm web sh -lc "npm run test:coverage"

.PHONY: fe-install fe-test fe-coverage

# ======== CI TARGETS (no docker compose) ========
ci-backend:
	@echo "Using TEST_DB_URL=$(TEST_DB_URL)"
	@pip install -r backend/requirements.txt
	@cd backend && DATABASE_URL=$(TEST_DB_URL) pytest -q --cov=app --cov-report=xml --cov-report=term-missing
	@echo "Coverage report -> backend/coverage.xml"

ci-frontend:
	@cd precision-auto && npm ci
	@cd precision-auto && npm run test:coverage -- --ci