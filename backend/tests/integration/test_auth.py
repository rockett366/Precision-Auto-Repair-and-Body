import pytest

"""
This file tests the signup feature of our API.
- It checks that a normal signup works (happy path).
- It checks that too-short passwords are rejected.
- It checks that duplicate emails or phone numbers are not allowed.
Use this as an example of how to write new endpoint tests:
1. Build a payload (like with the _payload helper).
2. Send a request with client.post() or client.get().
3. Check the response code and data with assert statements.
"""

# ------------------------------------------------------------------
# Original helpers + tests (kept as-is)
# ------------------------------------------------------------------

def _payload(email="u1@example.com", phone="+14155551212", pw="abcd1234"):
    return {
        "first_name": "Ada",
        "last_name": "Lovelace",
        "email": email,
        "phone": phone,
        "password": pw,
        "confirm_password": pw,
    }

def test_signup_happy_path(client):
    r = client.post("/api/auth/signup", json=_payload())
    assert r.status_code in (200, 201)
    data = r.json()
    assert data["user"]["email"] == "u1@example.com"

def test_signup_rejects_short_password(client):
    p = _payload(pw="short7")
    r = client.post("/api/auth/signup", json=p)
    assert r.status_code == 422
    assert "at least 8 characters" in r.text

def test_signup_conflict_email_and_phone(client):
    # First create
    r0 = client.post(
        "/api/auth/signup",
        json=_payload(email="dup@example.com", phone="+14154444444"),
    )
    assert r0.status_code in (200, 201)

    # Duplicate email (new phone)
    r1 = client.post(
        "/api/auth/signup",
        json=_payload(email="dup@example.com", phone="+14154444445"),
    )
    assert r1.status_code == 409

    # Duplicate phone (new email)
    r2 = client.post(
        "/api/auth/signup",
        json=_payload(email="unique@example.com", phone="+14154444444"),
    )
    assert r2.status_code == 409


# ------------------------------------------------------------------
# NEW TESTS BELOW — cover the rest of auth.py
# ------------------------------------------------------------------

# Local helpers for new tests
def _payload2(email="u2@example.com", phone="+14155550001", pw="abcd1234"):
    return {
        "first_name": "Grace",
        "last_name": "Hopper",
        "email": email,
        "phone": phone,
        "password": pw,
        "confirm_password": pw,
    }

def _signup2(client, **overrides):
    p = _payload2(**overrides)
    r = client.post("/api/auth/signup", json=p)
    assert r.status_code in (200, 201), r.text
    return r.json()["user"]

def _login(client, email, password):
    return client.post("/api/auth/login", json={"email": email, "password": password})


# ---------------------- /reviews ----------------------

def test_create_review_needs_followup_when_rating_low(client):
    r = client.post("/api/auth/reviews", json={"rating": 2, "content": "Not great."})
    assert r.status_code in (200, 201)
    data = r.json()
    assert data["needs_followup"] is True
    assert "id" in data

def test_create_review_no_followup_when_rating_high(client):
    r = client.post("/api/auth/reviews", json={"rating": 5, "content": "Excellent!"})
    assert r.status_code in (200, 201)
    data = r.json()
    assert data["needs_followup"] is False

def test_create_review_db_failure_returns_500(client):
    """
    Simulate a DB commit failure via dependency override so the endpoint
    rolls back and returns 500 with the expected detail.
    """
    app = client.app

    # Find the mounted auth module from app routes and get its get_db
    # (this avoids import path guesses).
    get_db = None
    for route in getattr(app, "routes", []):
        try:
            candidate = getattr(route.app, "dependency_overrides", None)
            # Not helpful; fallback to module scan below
        except Exception:
            pass

    # Fallback: try common import names
    import importlib
    try:
        auth_module = importlib.import_module("auth")
    except ModuleNotFoundError:
        for name in ("app.api.auth", "api.auth", "src.api.auth"):
            try:
                auth_module = importlib.import_module(name)
                break
            except ModuleNotFoundError:
                continue
        else:
            pytest.skip("Could not import auth module to override get_db")

    get_db = getattr(auth_module, "get_db", None)
    if get_db is None:
        pytest.skip("get_db not found; cannot simulate DB failure")

    class FakeDB:
        def add(self, _): pass
        def commit(self): raise Exception("boom")
        def refresh(self, _): pass
        def rollback(self): self.did_rb = True
        # create_review calls models.Review.__table__.create(bind=db.get_bind(), checkfirst=True)
        def get_bind(self):
            class B: ...
            return B()

    def _yield_fake_db():
        yield FakeDB()

    app.dependency_overrides[get_db] = _yield_fake_db
    try:
        r = client.post("/api/auth/reviews", json={"rating": 1, "content": "bad"})
        assert r.status_code == 500
        assert "Failed to save review" in r.text
    finally:
        app.dependency_overrides.pop(get_db, None)


# ---------------------- login + /me ----------------------

def test_login_client_and_me_flow(client):
    user = _signup2(
        client, email="client1@example.com", phone="+14155550010", pw="goodpass1"
    )
    r = _login(client, "client1@example.com", "goodpass1")
    assert r.status_code == 200, r.text
    payload = r.json()
    assert payload["is_admin"] is False
    assert "access_token" in payload  # client (non-admin) returns token in body

    token = payload["access_token"]
    r2 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200
    assert r2.json()["email"] == user["email"]

def test_login_invalid_credentials(client):
    _signup2(client, email="badlogin@example.com", phone="+14155550011", pw="rightpass1")
    r = _login(client, "badlogin@example.com", "wrongpass")
    assert r.status_code == 401
    assert "Invalid credentials" in r.text

def test_me_requires_valid_token(client):
    # Missing Authorization
    r = client.get("/api/auth/me")
    assert r.status_code == 401

    # Invalid/Bogus token
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401


# ---------------------- admin flows ----------------------

def test_admin_login_forbidden_for_non_admin(client):
    """
    There is no API path to promote a user to admin in auth.py,
    so we validate the negative path: non-admin receives 403.
    """
    _signup2(client, email="notadmin@example.com", phone="+14155550012", pw="notadmin1")
    r = client.post(
        "/api/auth/admin/login",
        json={"email": "notadmin@example.com", "password": "notadmin1"},
    )
    assert r.status_code == 403
    # Message can be either phrasing depending on branch; accept either.
    assert ("Not an admin" in r.text) or ("Access denied" in r.text)

def test_admin_me_requires_cookie_and_valid_token(client):
    # No cookie
    r = client.get("/api/auth/admin/me")
    assert r.status_code == 401

    # Bogus/undecodable cookie value -> also 401
    client.cookies.set("admin_token", "totally-bogus")
    r2 = client.get("/api/auth/admin/me")
    assert r2.status_code == 401


# ---------------------- logout ----------------------

def test_logout_user_deletes_cookie_header(client):
    # Pre-seed a cookie to mimic logged-in user; endpoint should delete it
    client.cookies.set("access_token", "whatever")
    r = client.post("/api/auth/logout")
    assert r.status_code == 200
    assert "User logged out successfully" in r.text
    # delete_cookie should emit a Set-Cookie header clearing the cookie
    set_cookie = r.headers.get("set-cookie", "")
    assert "access_token=" in set_cookie

def test_logout_admin_deletes_cookie_header(client):
    client.cookies.set("admin_token", "whatever")
    r = client.post("/api/auth/admin/logout")
    assert r.status_code == 200
    assert "Admin logged out successfully" in r.text
    set_cookie = r.headers.get("set-cookie", "")
    assert "admin_token=" in set_cookie