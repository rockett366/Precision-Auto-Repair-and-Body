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
    r0 = client.post("/api/auth/signup",
                     json=_payload(email="dup@example.com", phone="+14154444444"))
    assert r0.status_code in (200, 201)

    # Duplicate email (new phone)
    r1 = client.post("/api/auth/signup",
                     json=_payload(email="dup@example.com", phone="+14154444445"))
    assert r1.status_code == 409

    # Duplicate phone (new email)
    r2 = client.post("/api/auth/signup",
                     json=_payload(email="unique@example.com", phone="+14154444444"))
    assert r2.status_code == 409
