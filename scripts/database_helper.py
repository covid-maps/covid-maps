import psycopg2
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.core import Update

def connect_to_db(db_url):
    print('Connecting to the PostgreSQL database...')
    engine = create_engine(db_url, echo=False)
    Session = sessionmaker(bind=engine)
    return Session()

def denormalised_reviews_to_df(db_url):
    engine = create_engine(db_url, echo=False)
    query_str = 'SELECT A.name, A.category, A.latitude, A.longitude, A."placeId", A.address, A.city, A.locality, B.id, B.ip, B."availabilityInfo", B."safetyInfo", B."updatedAt", B."openingTime", B."closingTime", B.flag, B.deleted FROM "StoreInfos" as A inner join "StoreUpdates" as B on A.id = B."storeId" where B.deleted = False;'
    return pd.read_sql(query_str, engine).reset_index()

def close_connection(session):
    if session is not None:
        session.close()
        print('Database connection closed.')


def update_row(db_url, row_id, update_dict):
    db = create_engine(db_url)
    for item in update_dict:
        query = 'UPDATE "StoreUpdates" SET "{}" = {} WHERE id={}'.format(item, update_dict[item], row_id)
        db.execute(query)

def update_row_orm(session, row_id, update_dict):
    store_update = session.query(Update).filter(Update.id == row_id).one_or_none()
    if 'reviewed' in update_dict:
        store_update.reviewed = update_dict['reviewed']
    if 'deleted' in update_dict:
        store_update.deleted = update_dict['deleted']
    if 'openingTime' in update_dict:
        store_update.openingTime = update_dict['openingTime']
    if 'closingTime' in update_dict:
        store_update.closingTime = update_dict['closingTime']
    if 'flag' in update_dict:
        store_update.flag = update_dict['flag']