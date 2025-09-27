# Development Setup Overview

This project uses **Docker** and a **Makefile** to manage the development environment.

## Prerequisite

For the project to run properly, two `.env` files are required:

1. **Backend**  
   Place a `.env` file inside the `backend/` directory.

2. **Frontend**  
   Place a `.env` file inside the `precision-auto/` directory.

Make sure both `.env` files contain the necessary environment variables for their respective services. You can find the .env credentials within discord directory.


## What Docker Does

Docker is used to containerize the application and its dependencies so the project runs consistently across different environments.  

In this setup:

- **Postgres (db):** Provides the database service with persistent storage.
- **API (backend):** A Python FastAPI application running with `uvicorn`.
- **Web (frontend):** A Next.js app running on Node.js.
- **pgAdmin:** A web-based tool to manage the Postgres database.

Each service is defined in `docker-compose.yml`. Running them together ensures the backend, frontend, and database are connected and available locally.

Key points:
- Backend is exposed at [http://localhost:8000](http://localhost:8000).
- Frontend is exposed at [http://localhost:3000](http://localhost:3000).
- pgAdmin is available at [http://localhost:5050](http://localhost:5050).
- Postgres is mapped to port **5433** on the host.

## What the Makefile Does

The `Makefile` provides convenient shortcuts for common Docker commands:

- **`make dev-up`** – Starts all services (DB, API, Web, pgAdmin) in the background.
- **`make dev-down`** – Stops and removes containers (data persists).
- **`make clean`** – Stops containers and removes volumes (nukes DB data).
- **`make logs-api | logs-db | logs-web`** – Shows logs for a specific service.
- **`make psql`** – Opens a Postgres shell inside the DB container.
- **`make health`** – Checks API and DB health.
- **`make seed-user`** – Seeds the DB with a test user via the API.
- **`make rebuild-api`** – Rebuilds the API container without cache.

This setup abstracts away long `docker compose` commands, making development faster and less error-prone.

---

## How to Log Into pgAdmin

1. Open [http://localhost:5050](http://localhost:5050) in your browser.  
2. Log in with:
   - **Email:** `admin@example.com`  
   - **Password:** `admin123`  

3. Once logged in, right-click on **Servers** → **Register → Server**.  
4. In the **General** tab:
   - Name: (choose anything, e.g. `Local DB`)  

5. In the **Connection** tab:
   - **Host name / address:** `db`  
   - **Maintenance DB:** `precision_db`  
   - **Username:** `app_user`  
   - **Password:** `app_password`  
   - Check **Save Password**  

6. Click **Save** → your database should now appear under the registered server.