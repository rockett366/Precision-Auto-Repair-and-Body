def test_create_review_low_rating_sets_followup(client):
    r = client.post("/api/auth/reviews", json={"rating": 2, "content": "service was ok"})
    assert r.status_code in (200, 201)
    assert r.json()["needs_followup"] is True

def test_create_review_high_rating_no_followup(client):
    r = client.post("/api/auth/reviews", json={"rating": 5, "content": "great service!"})
    assert r.status_code in (200, 201)
    assert r.json()["needs_followup"] is False