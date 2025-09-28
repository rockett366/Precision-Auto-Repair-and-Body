from app.utils import hash_password, verify_password

def test_hash_and_verify_password_roundtrip():
    hashed = hash_password("s3cret-pass")
    assert hashed and isinstance(hashed, str)
    assert verify_password("s3cret-pass", hashed)
    assert not verify_password("wrong", hashed)
