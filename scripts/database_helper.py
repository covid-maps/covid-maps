import psycopg2
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.core import Update

def connect_to_db(db_url):
    print('Connecting to the PostgreSQL database...')
    try:
        engine = create_engine(db_url)
    except Exception:
        print("Could not connect to the databae. Please check connection URL.")
    Session = sessionmaker(bind=engine)
    return Session()

def load_engine(db_url):
    print('Connecting to the PostgreSQL database...')
    return create_engine(db_url, echo=False)

def denormalised_reviews_to_df(db_url):
    engine = create_engine(db_url, echo=False)
    query_str = 'SELECT A.name, A.category, A.latitude, A.longitude, A."placeId", A.address, A.city, A.locality, B.id, B.ip, B."availabilityInfo", B."safetyInfo", B."updatedAt", B."openingTime", B."closingTime", B.flag, B.deleted FROM "StoreInfos" as A inner join "StoreUpdates" as B on A.id = B."storeId" where B.deleted = False and B.reviewed = False;'
    return pd.read_sql(query_str, engine).reset_index()

def close_connection(session):
    if session is not None:
        session.close()
        print('Database connection closed.')

