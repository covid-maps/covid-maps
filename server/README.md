# Backend server

Primarily to talk to Google Sheets with a service account credential.

## Setup

- Create service account
- Give edit permissions to service account on the spreadsheet
- Get the key for the service account (in json format)

## Deployment

Deployed on Heroku. Some quick notes on the setup.

- Since deployment is from a subdirectory, heroku+git needs to be configured to use that instead.

  ```
  git subtree push --prefix path/to/subdirectory heroku master
  ```

- Running 1 web dyno for now

  ```
  heroku ps:scale web=1
  ```
