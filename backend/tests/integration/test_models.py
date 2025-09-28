from sqlalchemy.exc import IntegrityError
from app.models import User

def test_user_unique_email(db_session):
    u1 = User(first_name="A", last_name="B",
              email="x@y.com", phone="+14154444444", password_hash="p")
    db_session.add(u1)
    db_session.commit()

    u2 = User(first_name="C", last_name="D",
              email="x@y.com", phone="+14154444445", password_hash="p")
    db_session.add(u2)
    try:
        db_session.commit()
        assert False, "expected unique email violation"
    except IntegrityError:
        db_session.rollback()