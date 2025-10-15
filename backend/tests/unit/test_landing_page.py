"""
Covers:
- Happy path: returns presigned URLs for image objects under "landing_page/"
- No contents: returns {"images": []}
- Error paths: S3 list error and presign error -> 500

These tests are self-contained (no global client). They mount ONLY the
landing_page router and mock its boto3 client instance.
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.routers import landing_page as lpmod


# ------------------------------ local client (only landing_page router) ------------------------------

@pytest.fixture
def client_lp(monkeypatch):
    """
    Build a tiny app that includes ONLY the landing_page router.
    Monkeypatch module globals so no real AWS/network calls happen.
    """
    monkeypatch.setattr(lpmod, "S3_BUCKET", "unit-test-bucket", raising=False)
    monkeypatch.setattr(lpmod, "S3_REGION", "us-west-1", raising=False)

    class DummyS3:
        def __init__(self):
            self.calls = []
            # None => simulate "no Contents" response
            self.objects = []

            # Flags to simulate errors
            self.raise_in_list = False
            self.raise_in_presign = False

        def list_objects_v2(self, *, Bucket, Prefix):
            self.calls.append(("list", Bucket, Prefix))
            if self.raise_in_list:
                raise Exception("list failed")
            if self.objects is None:
                return {}
            return {"Contents": [{"Key": k} for k in self.objects]}

        def generate_presigned_url(self, *, ClientMethod, Params, ExpiresIn):
            self.calls.append(("presign", Params["Bucket"], Params["Key"], ExpiresIn))
            if self.raise_in_presign:
                raise Exception("presign failed")
            # Simple deterministic URL for assertions
            return f"https://signed/{Params['Bucket']}/{Params['Key']}?exp={ExpiresIn}"

    dummy = DummyS3()
    monkeypatch.setattr(lpmod, "s3", dummy, raising=False)

    app = FastAPI()
    app.include_router(lpmod.router, prefix="/api")

    return TestClient(app), dummy


# ------------------------------------------ tests ------------------------------------------

def test_load_images_happy_path_filters_and_presigns(client_lp):
    client, s3 = client_lp
    # S3 responds with objects under landing_page/; include some non-images to test filtering
    s3.objects = [
        "landing_page/a.png",
        "landing_page/b.jpg",
        "landing_page/c.jpeg",
        "landing_page/readme.txt",
        "landing_page/notes",
    ]

    r = client.get("/api/landing-page/load-images/")
    assert r.status_code == 200, r.text
    data = r.json()
    assert "images" in data
    urls = data["images"]
    assert len(urls) == 3

    # Verify presigned URL format and S3 call args
    for suffix in ("a.png", "b.jpg", "c.jpeg"):
        expect_part = f"https://signed/unit-test-bucket/landing_page/{suffix}?exp=3600"
        assert any(url.endswith(f"/landing_page/{suffix}?exp=3600") for url in urls)
        assert expect_part in urls

    # list call sanity check (Bucket & Prefix)
    assert ("list", "unit-test-bucket", "landing_page/") in s3.calls
    # presign called exactly 3 times (for png/jpg/jpeg)
    presign_calls = [c for c in s3.calls if c[0] == "presign"]
    assert len(presign_calls) == 3
    for _, bucket, key, exp in presign_calls:
        assert bucket == "unit-test-bucket"
        assert key.startswith("landing_page/")
        assert exp == 3600


def test_load_images_no_contents_returns_empty_list(client_lp):
    client, s3 = client_lp
    s3.objects = None  # simulate no "Contents" key in response

    r = client.get("/api/landing-page/load-images/")
    assert r.status_code == 200
    assert r.json() == {"images": []}


def test_load_images_500_on_list_error(client_lp):
    client, s3 = client_lp
    s3.raise_in_list = True

    r = client.get("/api/landing-page/load-images/")
    assert r.status_code == 500
    # body contains the error message stringified by the handler
    assert "list failed" in r.text


def test_load_images_500_on_presign_error(client_lp):
    client, s3 = client_lp
    s3.objects = ["landing_page/x.png"]
    s3.raise_in_presign = True

    r = client.get("/api/landing-page/load-images/")
    assert r.status_code == 500
    assert "presign failed" in r.text