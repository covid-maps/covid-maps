# Backend server

Express app talking to PostgreSQL. Deployed on Heroku.

## Local

This will run the server on localhost:5000. See [DATABASE.md](DATABASE.md) for the local PostgreSQL setup.

```sh
npm install
npx sequelize db:migrate

npx tsc
npx nodemon out/index.js
```

## Deployment

Deployed on Heroku, with staging and production environments. Some quick notes on the setup.

- Download Heroku CLI, login, and then set the Heroku remotes.

  ```
  heroku git:remote -a toilet-paper-app
  ```

- Running 1 web dyno for now

  ```
  heroku ps:scale web=1
  ```

- Procfile defines the web dyno command

## Implementing staging environment

We have two apps on Heroku, staging (called `covid-maps-staging`) and
production (called `toilet-paper-app`). This is how git remotes should
look like on your local dev environment.

```
$ git remote add staging https://git.heroku.com/covid-maps-staging.git
$ git remote add production https://git.heroku.com/toilet-paper-app.git

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
