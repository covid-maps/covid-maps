# Backend server

Primarily to talk to Google Sheets with a service account credential.

## Auth setup for Google Sheets

- Create service account
- Give edit permissions to service account on the spreadsheet
- Get the key for the service account (in json format)

## Deployment

Deployed on Heroku. https://toilet-paper-app.herokuapp.com/

Some quick notes on the setup.

- Download Heroku CLI, login, and then set the Heroku remotes.

  ```
  heroku git:remote -a toilet-paper-app
  ```

- Running 1 web dyno for now

  ```
  heroku ps:scale web=1
  ```

- Procfile defines the web dyno command
- Auth: The private key of the service account (defined in the JSON) are defined as an environment variable on Heroku.
  - [See section on Heroku](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)

## Local

This will run the server on localhost:5000. Ensure that you have auth setup with the local JSON file (at `server/eco-theater-119616-2905c4812c35.json`).

```
node index.js
```

## Implementing staging environment

We have two apps on Heroku, staging (called `covid-maps-staging`) and
production (called `toilet-paper-app`). This is how git remotes should
look like on your local dev environment.

```
$ git remote -v

origin  https://github.com/covid-maps/covid-maps.git (fetch)
origin  https://github.com/covid-maps/covid-maps.git (push)
production      https://git.heroku.com/toilet-paper-app.git (fetch)
production      https://git.heroku.com/toilet-paper-app.git (push)
staging https://git.heroku.com/covid-maps-staging.git (fetch)
staging https://git.heroku.com/covid-maps-staging.git (push)
```

To migrate your existing `heroku` remote to `production`.
```
git remote rename heroku production
```

To run heroku commands, pass the `--remote` flag to choose environment. For
example, staging logs will work with the following command.

```
heroku logs --remote staging -t
```

**Auto deployments**: Pushing to master will deploy to staging automatically.
If staging looks good, we can **promote** to production - on the Heroku UI.

[Access Heroku pipeline to promote](https://dashboard.heroku.com/pipelines/0dd78ad0-f357-4226-b17d-93fc97caba4e)