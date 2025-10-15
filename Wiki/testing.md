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
2. **Re-create the test database** (drops `precision_test_db` if it exists; then creates it fresh).
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
│   │   ├── client_record.py
│   │   ├── invoices.py
│   │   ├── landing_page.py
│   │   ├── online_estimates.py
│   │   ├── s3_online_estimates.py
│   │   ├── users.py
│   │   └── vehicle_status.py
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
│   │   ├── test_invoices.py
│   │   ├── test_users.py
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

* **DB URL**: tests use a **separate Postgres database** (e.g., `precision_tst_db`). Inside containers, Postgres is reachable at `db:5432` (service name + internal port).
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
DATABASE_URL=postgresql+psycopg2://app_user:app_password@localhost:5432/precision_test_db \
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

## 8) Continuous Integration (GitHub Actions)
When it runs: on PRs, pushes to main/master, or manual dispatch
- Starts Postgres 16 service (precision_test_db, app_user/app_password).
- Exposes TEST_DB_URL=postgresql://app_user:app_password@localhost:5432/precision_test_db.
- Uses Python 3.12; runs make ci-backend (pytest + XML/term coverage).
- Uploads artifacts: backend/coverage.xml, backend/htmlcov/**.

Frontend job
- Uses Node 20 with npm cache (precision-auto/package-lock.json).
- Runs make ci-frontend (Jest with coverage).
- Uploads artifacts: precision-auto/coverage/**.
> Workflow file: .github/workflows/ci.yml. Make sure the Makefile has ci-backend and ci-frontend targets (it does).

## 9) Frontend Testing (Jest + Next.js)
Config: next/jest + jest-environment-jsdom, jest.setup.js, path alias @/ → src/, CSS mocked via identity-obj-proxy.

Test globs:
- src/**/__tests__/**/*.(spec|test).{js,jsx}
- tests/integration/**/*.(spec|test).{js,jsx}
- Coverage:
- From src/**/*.{js,jsx} (excludes _app, _document, tests, test-utils).
- Reports: text, text-summary, html, lcov → precision-auto/coverage/.

```bash
# Local (Docker web service)
make fe-test            # run tests
make fe-coverage        # run tests with coverage
```
---