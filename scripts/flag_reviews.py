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
    SPREADSHEET_RANGE = 'A1:Z1000'
    credentials_file_name = '../credentials.json'
    locality_by_place_id = {}

    df = read_spreadsheet(SPREADSHEET_ID_INPUT, SPREADSHEET_RANGE, SCOPES)
    df['flag'] = None

    for index, row in df.iterrows():
        store_name = row['Store Name']
        useful_info = row['Useful Information']
        safety_info = row['Safety Observations']

        if row['Latitude'] is None:
            row['flag'] = 'Empty lat/long'
            
        if store_name.isdigit() or store_name == row['Address'][:len(store_name)]:
            row['flag'] = 'Invalid store name'

        if len(useful_info) < 10 and len(safety_info) < 10:
            row['flag'] = 'Short reviews'

        if len(useful_info) < 5 and len(safety_info) < 5:
            row['flag'] = 'Very short reviews'

    service = create_service('credentials.json', 'sheets', 'v4', SCOPES)
    export_data_to_sheets(df, service, SPREADSHEET_ID_OUTPUT, SPREADSHEET_RANGE)

if __name__ == "__main__":
    main()

