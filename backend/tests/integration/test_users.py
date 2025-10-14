import pytest
from app.schemas import MIN_PASSWORD_LEN

def _payload(email="user1@example.com", phone="+14155550001", pw="goodpass1"):
    return {
        "first_name": "Ada",
        "last_name": "Lovelace",
        "email": email,
        "phone": phone,
        "password": pw,
        "confirm_password": pw,
    }

def _signup(client, **overrides):
    data = _payload(**overrides)
    r = client.post("/api/auth/signup", json=data)
    assert r.status_code in (200, 201), r.text
    return r.json()["user"]

def _login(client, email, password):
    r = client.post("/api/auth/login", json={"email": email, "password": password})
    return r

def _auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

# =========================== tests ============================

def test_get_me_requires_auth(client):
    r = client.get("/api/users/me")
    assert r.status_code == 401
    r = client.get("/api/users/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert r.status_code == 401

def test_get_me_happy_path(client):
    user = _signup(client, email="me1@example.com", phone="+14155551001", pw="goodpass1")
    r = _login(client, "me1@example.com", "goodpass1")
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]

    r2 = client.get("/api/users/me", headers=_auth_headers(token))
    assert r2.status_code == 200
    body = r2.json()
    assert body["email"] == user["email"]
    assert body["first_name"] == user["first_name"]
    assert body["last_name"] == user["last_name"]
    assert body["phone"] == user["phone"]

def test_update_me_success(client):
    _signup(client, email="upd1@example.com", phone="+14155552001", pw="goodpass1")
    r = _login(client, "upd1@example.com", "goodpass1")
    token = r.json()["access_token"]

    update = {"first_name": "Grace", "last_name": "Hopper", "phone": "+14155552099"}
    r2 = client.put("/api/users/me", headers=_auth_headers(token), json=update)
    assert r2.status_code == 200, r2.text
    data = r2.json()
    assert data["first_name"] == "Grace"
    assert data["last_name"] == "Hopper"
    assert data["phone"] == "+14155552099"

def test_update_me_phone_conflict_409(client):
    # Create two users with different phones
    _signup(client, email="conflictA@example.com", phone="+14155553001", pw="goodpass1")
    _signup(client, email="conflictB@example.com", phone="+14155553002", pw="goodpass2")

    # Login as A and try to set phone to B's phone
    r = _login(client, "conflictA@example.com", "goodpass1")
    token = r.json()["access_token"]

    conflict_update = {
        "first_name": "Ada",
        "last_name": "Lovelace",
        "phone": "+14155553002",  # phone of user B
    }
    r2 = client.put("/api/users/me", headers=_auth_headers(token), json=conflict_update)
    assert r2.status_code == 409
    assert "Phone already in use" in r2.text

def test_verify_my_password_ok_and_bad(client):
    _signup(client, email="verify1@example.com", phone="+14155554001", pw="goodpass1")
    r = _login(client, "verify1@example.com", "goodpass1")
    token = r.json()["access_token"]

    # correct password -> ok: true
    r_ok = client.post(
        "/api/users/me/verify-password",
        headers=_auth_headers(token),
        json={"current_password": "goodpass1"},
    )
    assert r_ok.status_code == 200, r_ok.text
    assert r_ok.json() == {"ok": True}

    # wrong password -> 400
    r_bad = client.post(
        "/api/users/me/verify-password",
        headers=_auth_headers(token),
        json={"current_password": "nope"},
    )
    assert r_bad.status_code == 400
    assert "incorrect" in r_bad.text.lower()

def test_change_my_password_enforces_checks_and_updates(client):
    # create + login
    _signup(client, email="chg1@example.com", phone="+14155555001", pw="origPass1")
    r = _login(client, "chg1@example.com", "origPass1")
    token = r.json()["access_token"]

    # 1) wrong current password -> 400
    r_wrong = client.put(
        "/api/users/me/password",
        headers=_auth_headers(token),
        json={"current_password": "WRONG", "new_password": "whatever123"},
    )
    assert r_wrong.status_code == 400
    assert "incorrect" in r_wrong.text.lower()

    # 2) too-short new password -> 422
    too_short = "x" * max(1, MIN_PASSWORD_LEN - 1)
    r_short = client.put(
        "/api/users/me/password",
        headers=_auth_headers(token),
        json={"current_password": "origPass1", "new_password": too_short},
    )
    assert r_short.status_code == 422
    assert f"at least {MIN_PASSWORD_LEN}" in r_short.text

    # 3) success path
    r_ok = client.put(
        "/api/users/me/password",
        headers=_auth_headers(token),
        json={"current_password": "origPass1", "new_password": "newPass123"},
    )
    assert r_ok.status_code == 200
    assert "Password updated" in r_ok.text

    # login with old password should fail
    r_old = _login(client, "chg1@example.com", "origPass1")
    assert r_old.status_code == 401

    # login with new password should succeed
    r_new = _login(client, "chg1@example.com", "newPass123")
    assert r_new.status_code == 200, r_new.text