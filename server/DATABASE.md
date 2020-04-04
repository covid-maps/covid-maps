# Database work

## Local setup

1. Download from https://postgresapp.com/downloads.html

   - Heroku has Postgres 12, so that's what we will use
   - Ensure you can run `psql`
   - In psql: `create database covid-maps-0;`

1. Run migrations through sequelize

   - `npx sequelize-cli db:migrate`
   - `npx db-migrate up`

## Importing data

1. Export google sheet as CSV
1. Figure out Postgres import: local and production

## Notes

1. Query to support: given lat-lng, find entries around it
   - will need PostGIS
1. Connection pooling?
   - https://sequelize.org/v5/manual/getting-started.html
