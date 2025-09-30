"""
This file sets up pytest fixtures so our tests can run with a clean test database.
- It points the app to use the TEST_DB_URL instead of the normal database.
- It creates the database tables before tests run.
- Each test gets its own database session inside a transaction, which is rolled back
  after the test. This keeps tests isolated and repeatable.
- It also creates a FastAPI TestClient that uses the test database session.
"""

import os
import pytest
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("TEST_DB_URL")

# Set the DATABASE_URL to the test database for the whole test session
@pytest.fixture(scope="session", autouse=True)
def _set_test_db_env():
    os.environ["DATABASE_URL"] = DATABASE_URL
    yield

# Return the FastAPI app, bound to the test database
@pytest.fixture(scope="session")
def app():
    from app.main import app as fastapi_app
    return fastapi_app

# Create the test database tables and return engine + sessionmaker
@pytest.fixture(scope="session")
def engine_base_sessionmaker():
    from app.db import Base, engine
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    return engine, Base, TestingSessionLocal

# Provide a fresh database session for each test inside a transaction
@pytest.fixture()
def db_session(engine_base_sessionmaker):
    from sqlalchemy import event
    from sqlalchemy.orm import sessionmaker

    engine, Base, _ = engine_base_sessionmaker

    connection = engine.connect()
    trans = connection.begin()  # outer transaction

    Session = sessionmaker(bind=connection, autocommit=False, autoflush=False)
    session = Session()

    # start a nested transaction (SAVEPOINT)
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

# Provide a FastAPI TestClient that uses the db_session fixture  
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
