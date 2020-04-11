# Database work

## Local setup

1. Download from https://postgresapp.com/downloads.html

   - Heroku has Postgres 12, so that's what we will use
   - Ensure you can run `psql`
   - In psql: `create database "covid_maps_0";`

2. Run migrations through sequelize

   - `npx sequelize-cli db:migrate`
   - https://sequelize.org/v5/manual/migrations.html

## Gotchas

1. The `pg` NPM needs to be pinned to 7.12.1
   - https://github.com/brianc/node-postgres/issues/2009
2. A newly provisioned database requires installing the PostGIS extension
   ```sh
   heroku pg:psql # launch psql
   create extension postgis; # inside psql
   ```
   Or like this in the terminal
   ```
   psql covid_maps_0 -c "CREATE EXTENSION postgis";
   ```
3. If a migration fails in the middle, you will need to drop the database and begin afresh.

## Notes

1. Query to support: given lat-lng, find entries around it
   - will need PostGIS
2. Connection pooling?
   - https://sequelize.org/v5/manual/getting-started.html
