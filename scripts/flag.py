from enum import Enum

class Flag(Enum):
    MISSING_LAT_LONG = "Missing lat/long"
    DUPLICATE = "Duplicate"
    INVALID_STORE_NAME = "Invalid store name"
    SPAMMY_REVIEW = "Spammy reviews"
    SHORT_REVIEW = "Short reviews"
    VERY_SHORT_REVIEW = "Very short reviews"