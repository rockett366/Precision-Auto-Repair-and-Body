import os, time, jwt, secrets

from passlib.context import CryptContext
from typing import Optional


from google.oauth2 import id_token as google_id_token  
from google.auth.transport import requests as google_requests

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)


# --- JWT settings ---
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-key")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_TTL_SECONDS = int(os.getenv("JWT_TTL_SECONDS", "3600"))

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(*, subject: str, ttl_seconds: int = JWT_TTL_SECONDS) -> str:
    now = int(time.time())
    payload = {"sub": subject, "iat": now, "exp": now + ttl_seconds}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None
    
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID") or os.getenv("NEXT_PUBLIC_GOOGLE_CLIENT_ID")

def verify_google_credential(credential: str, audience: str | None = None) -> dict:
    """
    Validate a Google ID token and return basic profile info.
    Raises ValueError on failure.
    """
    aud = audience or GOOGLE_CLIENT_ID
    if not aud:
        raise ValueError("GOOGLE_CLIENT_ID is not configured")

    req = google_requests.Request()
    payload = google_id_token.verify_oauth2_token(credential, req, aud)

    email = payload.get("email")
    if not email:
        raise ValueError("Google token missing email")

    return {
        "email": email.lower(),
        "given_name": payload.get("given_name") or "",
        "family_name": payload.get("family_name") or "",
    }

def random_password_hash(hash_fn=None) -> str:
    """
    Placeholder password for accounts created via Google.
    Accepts an optional hash function for backward compatibility.
    """
    raw = "oauth:" + secrets.token_hex(16)
    return (hash_fn or hash_password)(raw)