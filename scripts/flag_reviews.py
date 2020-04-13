import pandas as pd
import numpy as np
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow, Flow
from google.auth.transport.requests import Request
from flag import Flag
from spreadsheets_helper import create_service, export_data_to_sheets
from database_helper import denormalised_reviews_to_df

def main():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SPREADSHEET_ID_OUTPUT = '1RZDZTswZxI-smwnyi8Oh5ck092hgl_CBxjtQURrczBs'
    SPREADSHEET_RANGE ='A1:Z3000'
    credentials_file_name = 'credentials.json'
    locality_by_place_id = {}
    DATABASE_URL = ''

    df = denormalised_reviews_to_df(DATABASE_URL)
    duplicate_reviews_dict = {}

    for index, row in df.iterrows():
        store_name = row['name']
        useful_info = row['availabilityInfo'].strip().lower() if row['availabilityInfo'] else ''
        safety_info = row['safetyInfo'].strip().lower() if row['safetyInfo'] else ''
        timestamp = pd.to_datetime(row['updatedAt'])

        dict_key = (store_name.strip().lower(), row['ip'])

        if dict_key in duplicate_reviews_dict:
            # Only count as duplicate if the two reviews are 300 mins apart
            review_proximity = pd.Timedelta(timestamp - pd.to_datetime(duplicate_reviews_dict[dict_key]['updatedAt'])).seconds / 60
            if abs(review_proximity) < 300:
                if (safety_info == duplicate_reviews_dict[dict_key]['safetyInfo'].strip().lower()) and (useful_info == duplicate_reviews_dict[dict_key]['availabilityInfo'].strip().lower() and pd.notnull(row['openingTime']) and pd.notnull(row['closingTime'])):
                    df.at[index , 'flag'] = Flag.DUPLICATE
                    continue                    

        else:
            duplicate_reviews_dict[dict_key] = row

        if not row['latitude'] or not row['longitude'] or np.isnan(row['latitude']) or np.isnan(row['longitude']):
            df.at[index , 'flag'] = str(Flag.MISSING_LAT_LONG)
            continue
            
        if store_name.isdigit() or (row['address'] and store_name == row['address'][:len(store_name)]):
            df.at[index , 'flag'] = Flag.INVALID_STORE_NAME
            continue

        if len(useful_info) < 5 and len(safety_info) < 5:
            df.at[index , 'flag'] = Flag.VERY_SHORT_REVIEW
            continue

        if len(useful_info) < 10 and len(safety_info) < 10:
            df.at[index , 'flag'] = Flag.SHORT_REVIEW
            continue

        if (useful_info and len(set(useful_info)) < 4) or (safety_info and len(set(safety_info)) < 4):
            df.at[index , 'flag'] = Flag.SPAMMY_REVIEW

    df = df.drop(columns=['updatedAt'])
    # Convert NaN to None as JSON cannot serialise with NaN type
    df = df.where(pd.notnull(df), None)
    # Only display non-empty flags
    df = df[df['flag']!= '']

    service = create_service(credentials_file_name, 'sheets', 'v4', SCOPES)
    export_data_to_sheets(df, service, SPREADSHEET_ID_OUTPUT, SPREADSHEET_RANGE)

if __name__ == "__main__":
    main()

