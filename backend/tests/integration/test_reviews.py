"""
*** TODO: STILL NOT TO SURE HOW WE ARE GOING TO BE HANDLING TESTS (NEED FOLLOWUP) ***
This file tests the reviews feature of our API.
- It checks that low ratings (like 2 stars) set needs_followup = True.
- It checks that high ratings (like 5 stars) set needs_followup = False.
This shows how to test business rules:
1. Send a request to create a review with client.post().
2. Confirm the status code is correct (200 or 201).
3. Check that the response JSON matches the rule we expect.
"""

def test_create_review_low_rating_sets_followup(client):
    r = client.post("/api/auth/reviews", json={"rating": 2, "content": "service was ok"})
    assert r.status_code in (200, 201)
    assert r.json()["needs_followup"] is True

def test_create_review_high_rating_no_followup(client):
    r = client.post("/api/auth/reviews", json={"rating": 5, "content": "great service!"})
    assert r.status_code in (200, 201)
    assert r.json()["needs_followup"] is False