# Backend ad-hoc scripts

For these scripts you will require Python. Please download and install the latest version of Python 3 from https://www.python.org/downloads/

## Auth setup for Google Sheets

Step by step instructions are given in this article: https://medium.com/analytics-vidhya/how-to-read-and-write-data-to-google-spreadsheet-using-python-ebf54d51a72c

- Install the following libraries locally using pip (if you don't have pip, install that too)
```
	pip install google_spreadsheet
	pip install google-auth-oauthlib
	pip install --upgrade google-api-python-client --ignore-installed six
	pip install pandas
```
- Get the Google sheet IDs for the sheet you're reading from and the sheeting you're writing to
- Replace `SPREADSHEET_ID_INPUT` and `SPREADSHEET_ID_OUTPUT` in the script to be run with the IDs obtained in the previous step
- Enable Google sheets API from the Google account this will be run from
- Download and store the file you obtain. Replace `credentials_file_name` with the name of the file, in the script to be run

## Setup for database connections
- Install the following
```
	pip install psycopg2-binary
	pip install sqlalchemy
```
- Replace the DATABASE_URL with the URL of the database setup you're using


## Running the scripts

Replace "script.py" with the name of the script to be run. Run the following in a terminal or Powershell if using Windows
```
	python script.py
```
