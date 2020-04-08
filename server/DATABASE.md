# Database work

## Local setup

1. Download from https://postgresapp.com/downloads.html

   - Heroku has Postgres 12, so that's what we will use
   - Ensure you can run `psql`
   - In psql: `create database "covid_maps_0";`

1. Run migrations through sequelize

   - `npx sequelize-cli db:migrate`
   - https://sequelize.org/v5/manual/migrations.html

## Gotchas

1. The `pg` NPM needs to be pinned to 7.12.1
   - https://github.com/brianc/node-postgres/issues/2009
1. A newly provisioned database requires installing the PostGIS extension
   ```sh
   heroku pg:psql # launch psql
   create extension postgis; # inside psql
   ```

## Notes

1. Query to support: given lat-lng, find entries around it
   - will need PostGIS
1. Connection pooling?
   - https://sequelize.org/v5/manual/getting-started.html
