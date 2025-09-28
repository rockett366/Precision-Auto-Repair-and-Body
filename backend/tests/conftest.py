import os
import pytest
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("TEST_DB_URL")

@pytest.fixture(scope="session", autouse=True)
def _set_test_db_env():
    os.environ["DATABASE_URL"] = DATABASE_URL
    yield

@pytest.fixture(scope="session")
def app():
    # Import AFTER DATABASE_URL is set so app binds to the test DB
    from app.main import app as fastapi_app
    return fastapi_app

@pytest.fixture(scope="session")
def engine_base_sessionmaker():
    from app.db import Base, engine
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    return engine, Base, TestingSessionLocal

@pytest.fixture()
def db_session(engine_base_sessionmaker):
    from sqlalchemy import event
    from sqlalchemy.orm import sessionmaker

    engine, Base, _ = engine_base_sessionmaker

    connection = engine.connect()
    trans = connection.begin()  # outer transaction

    Session = sessionmaker(bind=connection, autocommit=False, autoflush=False)
    session = Session()

    session.begin_nested()

    @event.listens_for(session, "after_transaction_end")
    def _restart_savepoint(sess, transaction):
        if transaction.nested and not transaction._parent.nested:
            sess.begin_nested()

    try:
        yield session
    finally:
        session.close()
        if trans.is_active:
            trans.rollback()
        connection.close()
        
@pytest.fixture()
def client(app, db_session):
    from fastapi.testclient import TestClient
    from app.db import get_db

    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
