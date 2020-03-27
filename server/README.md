# Backend server

Primarily to talk to Google Sheets with a service account credential.

## Auth setup for Google Sheets

- Create service account
- Give edit permissions to service account on the spreadsheet
- Get the key for the service account (in json format)

## Deployment

Deployed on Heroku. https://toilet-paper-app.herokuapp.com/

Some quick notes on the setup.

- Since deployment is from a subdirectory, heroku+git needs to be configured to use that instead. This is the push command for heroku, which would deploy the app. (Run this from the root of the repo)

  ```
  git subtree push --prefix server heroku master
  ```

- Due to this subdirectory config, it seems we can't use the Github integration for Heroku. So the deployments happen by running the above command locally.

- Running 1 web dyno for now

  ```
  heroku ps:scale web=1
  ```

- Procfile defines the web dyno command
- Auth: The contents of the service account json are defined as an environment variable on Heroku.
  - The app uses the environment variable, instead of a json file

## Local

This will run the server on localhost:5000. Ensure that you have auth setup with the local JSON file (at `server/eco-theater-119616-2905c4812c35.json`).

```
node index.js
```
