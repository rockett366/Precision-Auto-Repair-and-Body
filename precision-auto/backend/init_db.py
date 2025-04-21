import os
import sys
import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from app.database import Base
from dotenv import load_dotenv

# load .env
load_dotenv()

def get_engine():
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL environment variable not set")
        return create_engine(database_url)
    except Exception as e:
        print(f"Error creating database engine: {str(e)}", file=sys.stderr)
        sys.exit(1)

def init_db():
    retries = 5
    delay = 5
    engine = get_engine()
    
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            print("Tables created successfully!")
            return True
        except OperationalError as e:
            print(f"Database connection failed (attempt {6-retries}/5): {str(e)}")
            retries -= 1
            if retries > 0:
                time.sleep(delay)
        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}", file=sys.stderr)
            return False
    
    print("Max retries reached. Could not connect to database.", file=sys.stderr)
    return False

if __name__ == "__main__":
    if not init_db():
        sys.exit(1)