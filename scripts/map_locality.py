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
    
    df_with_locality = pd.read_csv('locality_mapping.csv')

    for index, row in df_with_locality.iterrows():
        locality_by_place_id[row['Place Id']] = row['Locality']

    for place_id in locality_by_place_id.keys():
        locality = locality_by_place_id[place_id]
        df.loc[((df['Place Id'] == place_id) & (df['City'] != locality)), 'Locality'] = locality

    service = create_service(credentials_file_name, 'sheets', 'v4', SCOPES)
    export_data_to_sheets(df, service, SPREADSHEET_ID_OUTPUT, SPREADSHEET_RANGE)

if __name__ == "__main__":
    main()

