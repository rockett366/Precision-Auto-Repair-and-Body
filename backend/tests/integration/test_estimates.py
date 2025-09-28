def test_seed_and_history_ordering(client):
    r = client.post("/api/estimates/seed-dev")
    assert r.status_code == 200
    assert r.json() >= 1

    r = client.get("/api/estimates/history")
    assert r.status_code == 200
    items = r.json()
    dates = [i["date"] for i in items]
    assert dates == sorted(dates, reverse=True)