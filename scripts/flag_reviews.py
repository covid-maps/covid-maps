import pandas as pd
import numpy as np
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow, Flow
from google.auth.transport.requests import Request
from flag import Flag
from spreadsheets_helper import create_service, export_data_to_sheets
from database_helper import load_engine
from daos.update_dao import UpdateDAO
import config

def main():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    SPREADSHEET_ID_OUTPUT = '1RZDZTswZxI-smwnyi8Oh5ck092hgl_CBxjtQURrczBs'
    SPREADSHEET_RANGE ='A1:Z3000'
    credentials_file_name = 'credentials.json'
    locality_by_place_id = {}
    DATABASE_URL =  config.db_urls['PROD']

    engine = load_engine(DATABASE_URL)
    update_dao = UpdateDAO(engine)
    reviews = update_dao.get_all()
    duplicate_reviews_dict = {}

    for review in reviews:
        store_name = review.Store.name
        useful_info = review.availabilityInfo.strip().lower() if review.availabilityInfo else ''
        safety_info = review.safetyInfo.strip().lower() if review.safetyInfo else ''
        timestamp = pd.to_datetime(review.updatedAt)

        dict_key = (store_name.strip().lower(), review.ip)

        if dict_key in duplicate_reviews_dict:
            # Only count as duplicate if the two reviews are 300 mins apart
            review_proximity = pd.Timedelta(timestamp - pd.to_datetime(duplicate_reviews_dict[dict_key].updatedAt)).seconds / 60
            if abs(review_proximity) < 300:
                if (safety_info == duplicate_reviews_dict[dict_key].safetyInfo.strip().lower()) and (useful_info == duplicate_reviews_dict[dict_key].availabilityInfo.strip().lower()):
                    review.flag = Flag.DUPLICATE.value
                    continue                    

        else:
            duplicate_reviews_dict[dict_key] = review

        if not review.Store.latitude or not review.Store.longitude or np.isnan(review.Store.latitude) or np.isnan(review.Store.longitude):
            review.flag = str(Flag.MISSING_LAT_LONG.value)
            continue
            
        if store_name.isdigit() or (review.Store.address and store_name == review.Store.address[:len(store_name)]):
            review.flag = Flag.INVALID_STORE_NAME.value
            continue

        if len(useful_info) < 5 and len(safety_info) < 5  and pd.isna(review.openingTime) and pd.isna(review.closingTime):
            review.flag = Flag.VERY_SHORT_REVIEW.value
            continue

        if len(useful_info) < 10 and len(safety_info) < 10  and pd.isna(review.openingTime) and pd.isna(review.closingTime):
            review.flag = Flag.SHORT_REVIEW.value
            continue

        if (useful_info and len(set(useful_info)) < 4) or (safety_info and len(set(safety_info)) < 4):
            review.flag = Flag.SPAMMY_REVIEW.value

    # Only display non-empty flags
    flagged_reviews = [review for review in reviews if review.flag]
    df = pd.DataFrame([t.to_dict() for t in flagged_reviews])
    
    # # Convert NaN to None as JSON cannot serialise with NaN type
    df = df.where(pd.notnull(df), None)

    service = create_service(credentials_file_name, 'sheets', 'v4', SCOPES)
    export_data_to_sheets(df, service, SPREADSHEET_ID_OUTPUT, SPREADSHEET_RANGE)

if __name__ == "__main__":
    main()

