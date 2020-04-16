import pandas as pd
import numpy as np
from spreadsheets_helper import read_spreadsheet
from database_helper import load_engine, close_connection
from daos.dao import DAO
from models.core import Update
import config


def apply_updates(update_row, store_update):
    store_update.flag = update_row.get('flag')

    if update_row.get('Reviewed', 'No') == 'Yes':
        store_update.reviewed = True
    
    # Don't change if not marked deleted, as it is False by default (and to avoid over-writing)
    deleted = update_row.get('deleted', 'FALSE')
    if deleted == 'TRUE':
        store_update.deleted = True

    opening_time = update_row.get('openingTime')
    if opening_time and opening_time != store_update.openingTime:
        store_update.openingTime = update_row['openingTime']

    closing_time = update_row.get('closingTime')
    if closing_time and closing_time != store_update.closingTime:
        store_update.closingTime = update_row['closingTime']

    useful_info = update_row.get('availabilityInfo')
    if useful_info and useful_info != store_update.availabilityInfo:
        store_update.availabilityInfo = update_row['availabilityInfo']

    safety_info = update_row.get('safetyInfo')
    if safety_info and safety_info != store_update.safetyInfo:
        store_update.safetyInfo = safety_info

    return store_update

def main():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SPREADSHEET_ID_INPUT = '1RZDZTswZxI-smwnyi8Oh5ck092hgl_CBxjtQURrczBs'
    SPREADSHEET_RANGE ='A1:Z5000'
    credentials_file_name = 'credentials.json'
    DATABASE_URL =  config.db_urls['PROD']

    df = read_spreadsheet(SPREADSHEET_ID_INPUT, SPREADSHEET_RANGE, SCOPES)
    df['id'] = df['id'].astype(int)
    engine = load_engine(DATABASE_URL)
    update_dao = DAO(Update, engine)

    for index, row in df.iterrows():
        row_id = row.get('id')
        reviewed = row.get('Reviewed')

        if not row_id:
            print("Skipping row; no ID found.")
            continue

        if reviewed == 'Yes':
            print('Processing review ID {}'.format(row_id))
            store_update = update_dao.get(row_id)
            if not store_update:
                print("Could not find record with ID {}".format(row_id))
                continue
            store_update = apply_updates(row, store_update)

        update_dao.session.commit()
    close_connection(update_dao.session)

if __name__ == "__main__":
    main()
