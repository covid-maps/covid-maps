import pandas as pd
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow,Flow
from google.auth.transport.requests import Request
import os
import pickle
from spreadsheets_helper import read_spreadsheet, create_service, export_data_to_sheets

def main():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SPREADSHEET_ID_INPUT = '1jFQrYwbhPIaRL6t4TnpTO7W905U0B-W1FXS-GBYwz7M'
    SPREADSHEET_ID_OUTPUT = '1RZDZTswZxI-smwnyi8Oh5ck092hgl_CBxjtQURrczBs'
    SPREADSHEET_RANGE = 'A1:Z1650'
    credentials_file_name = 'credentials.json'
    locality_by_place_id = {}

    df = read_spreadsheet(SPREADSHEET_ID_INPUT, SPREADSHEET_RANGE, SCOPES)
    # df['dt_Timestamp'] = pd.to_datetime(df['Timestamp'])
    df['flag'] = None
    duplicate_reviews_dict = {}

    for index, row in df.iterrows():
        store_name = row['Store Name']
        useful_info = row['Useful Information'].strip().lower() if row['Useful Information'] else ''
        safety_info = row['Safety Observations'].strip().lower() if row['Safety Observations'] else ''
        timestamp = pd.to_datetime(row['Timestamp'])

        dict_key = (store_name.strip().lower(), row['User IP'])

        if dict_key in duplicate_reviews_dict:
            review_proximity = pd.Timedelta(timestamp - pd.to_datetime(duplicate_reviews_dict[dict_key]['Timestamp'])).seconds / 60
            if abs(review_proximity) < 300:
                # print("With review proxmity ", review_proximity, " minutes")
                if (safety_info == duplicate_reviews_dict[dict_key]['Safety Observations'].strip().lower()) and (useful_info == duplicate_reviews_dict[dict_key]['Useful Information'].strip().lower()):
                    # print("duplicate found: ", safety_info, duplicate_reviews_dict[dict_key]['Safety Observations'].strip().lower(), "and useful info ", useful_info, duplicate_reviews_dict[dict_key]['Useful Information'].strip().lower())
                    row['flag'] = 'Duplicate'
                    continue                    
                # else: 
                    # print("duplicate NOT found: ", safety_info, duplicate_reviews_dict[dict_key]['Safety Observations'].strip().lower(), "and useful info ", useful_info, duplicate_reviews_dict[dict_key]['Useful Information'].strip().lower())

        else:
            duplicate_reviews_dict[dict_key] = row

        if not row['Latitude'] or not row['Longitude']:
            row['flag'] = 'Empty lat/long'
            continue
            
        if store_name.isdigit() or (row['Address'] and store_name == row['Address'][:len(store_name)]):
            row['flag'] = 'Invalid store name'
            continue

        if len(useful_info) < 5 and len(safety_info) < 5:
            row['flag'] = 'Very short reviews'
            continue

        if len(useful_info) < 10 and len(safety_info) < 10:
            row['flag'] = 'Short reviews'
            continue

        if (useful_info and len(set(useful_info)) < 4) or (safety_info and len(set(safety_info)) < 4):
            row['flag'] = 'Spammy words'

    # df = df.drop(columns=['dt_Timestamp'])

    service = create_service(credentials_file_name, 'sheets', 'v4', SCOPES)
    export_data_to_sheets(df, service, SPREADSHEET_ID_OUTPUT, SPREADSHEET_RANGE)

if __name__ == "__main__":
    main()

