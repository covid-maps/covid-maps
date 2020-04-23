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
import re

def is_same_location(new_store, original_store):
    """
    Compares locations of two stores based on the following factors:
    1. If they both have the same place ID
    2. If they neither have a place ID but have the same address
    3. If one of them does not have either place ID or address
    """
    if new_store.placeId and original_store.placeId and new_store.placeId == original_store.placeId:
        return True

    if new_store.address and original_store.address and new_store.address == original_store.address:
        return True

    if (new_store.placeId is None and new_store.address is None) or (original_store.placeId is None and original_store.address is None):
        return True

    return False

def _tokenise(text):
    words = re.compile(r'\w+').findall(text)
    return words

def _get_overlap_perc(text_1, text_2):
    text_1_words = 0.0
    text_1_overlap_words = 0.0
    for word in text_1:
        # Ignore filler (very short) words
        if len(word) < 3:
            continue
        text_1_words += 1

        if word in text_2:
            text_1_overlap_words += 1

    if text_1_words > 0:
        return float(text_1_overlap_words / text_1_words) 
    return 0


def is_similar_text(new_review, original_review):
    """
    Compares safety and availability text of two stores based on the following factors:
    1. If they both have exactly the same content
    2. If they have more than 50% similar words
    """
    new_review_safety_cleaned = new_review.safetyInfo.strip().lower()
    original_review_safety_cleaned = original_review.safetyInfo.strip().lower()
    new_review_availability_cleaned = new_review.availabilityInfo.strip().lower()
    original_review_availability_cleaned = original_review.availabilityInfo.strip().lower()
    
    if new_review_safety_cleaned == original_review_safety_cleaned and new_review_availability_cleaned == original_review_availability_cleaned:
        return True

    new_review_safety_tokenised = _tokenise(new_review.safetyInfo)
    original_review_safety_tokenised = _tokenise(original_review.safetyInfo)
    new_review_availability_tokenised = _tokenise(new_review.availabilityInfo)
    original_review_availability_tokenised = _tokenise(original_review.availabilityInfo)

    new_review_safety_overlap_perc = _get_overlap_perc(new_review_safety_tokenised, original_review_safety_tokenised)
    new_review_availability_overlap_perc = _get_overlap_perc(new_review_availability_tokenised, original_review_availability_tokenised)
    
    if new_review_safety_overlap_perc >= 0.5 and new_review_availability_overlap_perc >= 0.5:
        return True

    return False


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
            original_review = duplicate_reviews_dict[dict_key]
            # Only consider as duplicate if 
            # 1. The two reviews are 300 mins apart
            # 2. Have the same location
            # 3. Have the exact same text
            # 4. Or have a high degree of overlap in their review text
            review_proximity = pd.Timedelta(timestamp - pd.to_datetime(original_review.updatedAt)).seconds / 60
            if abs(review_proximity) < 300 and is_same_location(review.Store, original_review.Store) and is_similar_text(review, original_review):
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

