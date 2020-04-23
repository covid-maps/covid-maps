from sqlalchemy import create_engine

def load_engine(db_url):
    print('Connecting to the PostgreSQL database...')
    return create_engine(db_url, echo=False)

def close_connection(session):
    if session is not None:
        session.close()
        print('Database connection closed.')

