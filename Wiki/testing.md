# Backend Testing Guide (FastAPI + PostgreSQL + Docker)

> **TL;DR**
>
> * Run **all backend tests with coverage**: `make test`
> * Coverage report: `backend/coverage.xml`
> * You need **Docker** & **docker compose** installed. Nothing else.

---

## 1) What `make test` does

Our Makefile has a single, simple target for backend testing:

1. **Start Postgres** (the `db` service from `docker-compose.yaml`).
2. **Re-create the test database** (drops `precision_db_test` if it exists; then creates it fresh).
3. **Run pytest inside the API container** (the `api` image):

   * Mounts your local `backend/` folder into `/app` in the container so the tests and source code are visible.
   * Installs dependencies (`requirements.txt`).
   * Sets `DATABASE_URL` to point at the **test DB** on host `db:5432`.
   * Runs `pytest` with coverage (`--cov=app --cov-report=term-missing --cov-report=xml`).
4. **Outputs coverage** to `backend/coverage.xml`.

> **Note:** After the run, the one-off `api` test container is removed automatically. The `db` container stays running (handy for repeated runs). Stop it anytime with `docker compose down`.

---

## 2) Project layout (backend)

```
backend/
├── app/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── estimates.py
│   ├── __init__.py
│   ├── db.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── utils.py
├── tests/
│   ├── integration/
│   │   ├── test_auth.py        # /api/auth/* endpoints
│   │   ├── test_reviews.py     # /api/auth/reviews endpoint
│   │   ├── test_estimates.py   # /api/estimates/* endpoints
│   │   └── test_models.py      # direct model/constraint checks
│   ├── unit/
│   │  ├── test_schemas.py      # pure Python validation tests
│   │  └── test_utils.py        # hashing helpers, etc.
│   └── conftest.py             # pytest fixtures: DB session, app, TestClient
├── requirements.txt            # runtime & test deps
└── pytest.ini                  # pytest configuration
```

---

## 3) How the pytest fixtures work (high level)

`backend/tests/conftest.py` wires the app + DB for tests:

* **DB URL**: tests use a **separate Postgres database** (e.g., `precision_db_test`). Inside containers, Postgres is reachable at `db:5432` (service name + internal port).
* **App import order**: the fixture sets up the DB connection first, then imports `app.main` so SQLAlchemy binds to the test DB.
* **Session per test**: each test runs inside a DB **transaction + SAVEPOINT**. After the test, we roll back → the DB is clean. No need to truncate tables.
* **Dependency override**: FastAPI’s `get_db` dependency is overridden to yield the test session, so all requests in tests use the same transaction.

This gives us **fast, isolated** tests without touching dev data.

---

## 4) Running the tests

```bash
# from repo root
make test
```

You’ll see a summary like:

```
11 passed, 0 failed, 4 warnings in 2.1s
Coverage report -> backend/coverage.xml
```

---

## 5) Coverage: what it means

* Coverage shows **which lines executed** during tests.
* Example:

  * `app/routers/auth.py  38 stmts, 6 missed, 84%` → 6 lines in that file never ran in any test (likely error branches).
* We enforce a minimum via `--cov-fail-under=85` found in `pytest.ini`.

To view details, open `backend/coverage.xml` in your editor or generate HTML locally:

```bash
cd backend
pytest --cov=app --cov-report=html
# then open backend/htmlcov/index.html
```
---

## 6) Local (non-Docker) runs (optional)

If you have Python locally and a Postgres running on your host (mapped to 5433 by compose):

```bash
cd backend
pip install -r requirements.txt -r requirements-dev.txt
DATABASE_URL=postgresql+psycopg2://app_user:app_password@localhost:5432/precision_db_test \
pytest --cov=app --cov-report=term-missing
```

This is optional—`make test` is the standard.

---

## 7) Adding new tests (team checklist)

* Put **pure logic tests** in `tests/unit/` and **endpoint tests** in `tests/integration/`.
* Name files `test_*.py` and functions `test_*`.
* Keep tests small (Arrange–Act–Assert) and deterministic.
* If you add new backend logic, **add or update tests**. Our coverage will drop if you don’t.
* Reach out and ask if you are unsure about adding tests.
---

## 8) Next steps (future)

* Add a frontend test target (Vitest/Jest) and a root `make test-all` that runs both.
* In CI (GitHub Actions), call the same `make test` for backend, enforce coverage thresholds, etc etc.

---