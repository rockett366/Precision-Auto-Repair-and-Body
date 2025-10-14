"""
Router expects:
  PUT /s3/online-estimates-put
  multipart/form-data with:
    - file: UploadFile
    - label: str (Form)
    - full_name: str (Form)
    - vin: str (Form)

These tests are self-contained and do NOT depend on global TestClient.
They mount only the S3 router, monkeypatch the module's globals, and use a
dummy S3 client to avoid real AWS calls.
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from botocore.exceptions import ClientError
from app.routers import s3_online_estimates as s3mod


# ------------------------------ local client (only S3 router) ------------------------------

@pytest.fixture
def client_s3(monkeypatch):
    monkeypatch.setattr(s3mod, "S3_BUCKET", "unit-test-bucket", raising=False)
    monkeypatch.setattr(s3mod, "S3_REGION", "us-west-1", raising=False)

    # Dummy S3 client that records calls
    class DummyS3:
        def __init__(self):
            self.calls = []

        def upload_fileobj(self, *, Fileobj, Bucket, Key, ExtraArgs):
            Fileobj.seek(0)
            _ = Fileobj.read(1)
            self.calls.append(
                {"Bucket": Bucket, "Key": Key, "ExtraArgs": ExtraArgs}
            )

    dummy = DummyS3()
    monkeypatch.setattr(s3mod, "s3", dummy, raising=False)

    app = FastAPI()
    app.include_router(s3mod.router, prefix="/api")

    return TestClient(app), dummy


# ------------------------------------------ tests ------------------------------------------

def test_put_png_uploads_and_returns_url(client_s3):
    client, dummy = client_s3

    data = {"label": "front", "full_name": "Grace Hopper", "vin": "ABC123"}
    files = {"file": ("photo.png", b"\x89PNG\r\n\x1a\n...", "image/png")}

    r = client.put("/api/s3/online-estimates-put", data=data, files=files)
    assert r.status_code in (200, 201), r.text

    body = r.json()
    assert body["uploaded"] is True

    # Key format: online-estimates/{safe_full_name}_{label}_{vin}.ext
    key = body["key"]
    assert key == "online-estimates/grace_hopper_front_ABC123.png"

    # URL formed with bucket/region/key
    assert body["public_url"] == (
        "https://unit-test-bucket.s3.us-west-1.amazonaws.com/" + key
    )

    # Verify S3 call details
    assert dummy.calls, "Expected upload_fileobj to be called"
    call = dummy.calls[0]
    assert call["Bucket"] == "unit-test-bucket"
    assert call["Key"] == key
    assert call["ExtraArgs"]["ContentType"] == "image/png"
    assert call["ExtraArgs"]["ACL"] == "private"
    assert call["ExtraArgs"]["ServerSideEncryption"] == "AES256"


def test_rejects_unsupported_mime_type(client_s3):
    client, _ = client_s3

    data = {"label": "rear", "full_name": "Ada Lovelace", "vin": "XYZ999"}
    files = {"file": ("note.txt", b"hello", "text/plain")}  # not allowed

    r = client.put("/api/s3/online-estimates-put", data=data, files=files)
    assert r.status_code == 400
    assert "Unsupported image type" in r.text


def test_missing_bucket_env_returns_500(client_s3, monkeypatch):
    client, _ = client_s3

    # Simulate missing S3 bucket env var on the SAME module instance
    monkeypatch.setattr(s3mod, "S3_BUCKET", None, raising=False)

    data = {"label": "side", "full_name": "Alan Turing", "vin": "VIN123456"}
    files = {"file": ("photo.png", b"...", "image/png")}

    r = client.put("/api/s3/online-estimates-put", data=data, files=files)
    assert r.status_code == 500
    assert "S3 bucket env var is missing" in r.text


def test_s3_upload_failure_bubbles_as_500(client_s3, monkeypatch):
    client, _ = client_s3

    class FailS3:
        def upload_fileobj(self, *args, **kwargs):
            raise ClientError(
                {"Error": {"Code": "NoSuchBucket", "Message": "missing"}},
                "UploadFile",
            )

    # Replace the s3 client with a failing double
    monkeypatch.setattr(s3mod, "s3", FailS3(), raising=False)

    data = {"label": "hood", "full_name": "Katherine Johnson", "vin": "JH4DA123"}
    files = {"file": ("photo.png", b"...", "image/png")}

    r = client.put("/api/s3/online-estimates-put", data=data, files=files)
    assert r.status_code == 500
    assert "S3 upload failed" in r.text


def test_jpeg_extension_is_added_and_url_formed(client_s3):
    client, _ = client_s3

    data = {"label": "interior", "full_name": "Tim Berners-Lee", "vin": "1HGCM826"}
    files = {"file": ("photo", b"\xff\xd8\xff", "image/jpeg")}  # name w/o extension

    r = client.put("/api/s3/online-estimates-put", data=data, files=files)
    assert r.status_code in (200, 201), r.text

    body = r.json()
    key = body["key"]
    # safe full name lowercased with underscores
    assert key.startswith("online-estimates/tim_berners-lee_interior_1HGCM826")
    # Different environments may map 'image/jpeg' to .jpeg/.jpg/.jpe
    assert key.endswith((".jpeg", ".jpg", ".jpe")), f"unexpected key: {key}"

    assert body["public_url"].startswith(
        "https://unit-test-bucket.s3.us-west-1.amazonaws.com/"
    )
    assert body["public_url"].endswith(key)