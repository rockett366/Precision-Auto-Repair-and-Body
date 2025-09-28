"""
This file tests the estimates feature of our API.
- It checks that the seed-dev endpoint creates demo estimates.
- It checks that the history endpoint returns estimates sorted by date (newest first).
Use this as an example of how to test other endpoints:
1. Call the endpoint with client.post() or client.get().
2. Confirm the response status is correct (200).
3. Check that the returned data is in the right format or order.
"""

def test_seed_and_history_ordering(client):
    r = client.post("/api/estimates/seed-dev")
    assert r.status_code == 200
    assert r.json() >= 1

    r = client.get("/api/estimates/history")
    assert r.status_code == 200
    items = r.json()
    dates = [i["date"] for i in items]
    assert dates == sorted(dates, reverse=True)