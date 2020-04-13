import pandas as pd
import numpy as np
from spreadsheets_helper import read_spreadsheet
from database_helper import connect_to_db, update_row_orm, close_connection

def main():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SPREADSHEET_ID_INPUT = '1RZDZTswZxI-smwnyi8Oh5ck092hgl_CBxjtQURrczBs'
    SPREADSHEET_RANGE ='A1:Z10'
    credentials_file_name = 'credentials.json'
    DATABASE_URL = ''

    df = read_spreadsheet(SPREADSHEET_ID_INPUT, SPREADSHEET_RANGE, SCOPES)
    df['id'] = df['id'].astype(int)
    db_session = connect_to_db(DATABASE_URL)

    for index, row in df.iterrows():
        store_name = row['name']
        flagged = row['flag']
        deleted = row['deleted']
        reviewed = row['Reviewed']
        useful_info = row['availabilityInfo'].strip().lower() if row['availabilityInfo'] else ''
        safety_info = row['safetyInfo'].strip().lower() if row['safetyInfo'] else ''

        update_dict = {
            'flag': row['flag']
        }

        # If deleted is marked true, then it has been reviewed
        if deleted == 'TRUE':
            update_dict['deleted'] = True
            update_dict['reviewed'] = True

        if row['openingTime']:
            update_dict['openingTime'] = row['openingTime']

        if row['closingTime']:
            update_dict['closingTime'] = row['closingTime']
            
        update_row_orm(db_session, row['id'], update_dict)


    db_session.commit()
    close_connection(db_session)

if __name__ == "__main__":
    main()
