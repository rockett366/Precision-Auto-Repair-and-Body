import pytest
from app.db import get_db
from app import models

def _history(client):
    return client.get("/api/invoices/history")

def _seed_dev(client):
    return client.post("/api/invoices/seed-dev")

# =========================== tests ============================

def test_history_empty_initially(client):
    """
    Expect no invoices before seeding/creating anything.
    (Your Makefile resets the DB at run start.)
    """
    r = _history(client)
    assert r.status_code == 200, r.text
    assert r.json() == []

def test_seed_dev_inserts_three_and_history_orders_by_date_desc(client):
    # Seed
    r_seed = _seed_dev(client)
    assert r_seed.status_code == 200, r_seed.text
    assert r_seed.json() == 3

    # Check history order: by date desc
    r_hist = _history(client)
    assert r_hist.status_code == 200
    data = r_hist.json()
    assert len(data) >= 3

    # Names/dates from invoices.seed_dev:
    # 2025-09-14 Barry Allen
    # 2025-09-12 Mr. Incredible
    # 2025-09-10 Tobey Maguire
    names_in_order = [row["name"] for row in data[:3]]
    assert names_in_order == ["Barry Allen", "Mr. Incredible", "Tobey Maguire"]

def test_history_uses_created_at_desc_as_tiebreaker(client):
    """
    Add a new invoice with the SAME date as an existing one (2025-09-12).
    Since created_at is newer, it should appear BEFORE the older one in /history.
    """
    # Ensure seed data exists
    r_seed = _seed_dev(client)
    assert r_seed.status_code == 200

    # Insert a newer invoice with the same date as "Mr. Incredible" (2025-09-12)
    # Use the app's real DB session
    db_gen = get_db()
    db = next(db_gen)
    try:
        newer = models.Invoice(
            name="Newer Same Date",
            description="Sanity check for created_at tie-breaker",
            date="2025-09-12",
        )
        db.add(newer)
        db.commit()
        db.refresh(newer)
    finally:
        try:
            next(db_gen)
        except StopIteration:
            pass

    # Fetch history and assert order among same-date items
    r_hist = _history(client)
    assert r_hist.status_code == 200
    rows = r_hist.json()

    # Find indices of the two same-date items
    idx_newer = next(i for i, r in enumerate(rows) if r["name"] == "Newer Same Date")
    idx_old = next(i for i, r in enumerate(rows) if r["name"] == "Mr. Incredible")

    # Because .order_by(date desc, created_at desc), the newer created_at should sort first
    assert idx_newer < idx_old, f"Expected 'Newer Same Date' before 'Mr. Incredible', got indices {idx_newer} vs {idx_old}"