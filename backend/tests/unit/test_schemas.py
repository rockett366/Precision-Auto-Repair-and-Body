import pytest
from pydantic import ValidationError
from app.schemas import SignupRequest, ReviewCreate

def test_signup_phone_normalizes_to_e164():
    s = SignupRequest(
        first_name="A", last_name="B",
        email="a@example.com",
        phone="4155551212",
        password="longenough", confirm_password="longenough",
    )
    assert s.phone.startswith("+")

def test_signup_passwords_must_match():
    with pytest.raises(ValidationError):
        SignupRequest(
            first_name="A", last_name="B",
            email="b@example.com",
            phone="+14155551212",
            password="abcd1234", confirm_password="abcd12345",
        )

def test_review_min_length():
    with pytest.raises(ValidationError):
        ReviewCreate(rating=3, content="  a ")
