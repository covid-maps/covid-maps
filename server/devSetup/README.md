# Getting a Local Server Instance up.

### Required Docker Images
* [Postgres](https://hub.docker.com/_/postgres)
* [PostGIS](https://hub.docker.com/r/postgis/postgis)
* [PgAdmin](https://hub.docker.com/r/dpage/pgadmin4)

### How to get the server up?
```bash
cd server/devSetup
docker-compose up -d
```

## Credentials
### PgAdmin
`email => admin@admin.org`

`password => admin`

### Postgres
`user => root`

`password => null`

### Add Server to PgAdmin
`Name => covidmaps_database`
![image](https://user-images.githubusercontent.com/27439197/79312173-21bbf780-7f1c-11ea-8135-f869fe5dea7b.png)

### Create New Database
`databseName => covid_maps_0`
![image](https://user-images.githubusercontent.com/27439197/79312338-60ea4880-7f1c-11ea-9314-4f849f8cc3ff.png)

### PostGis Extension
In the database add the extrension for PostGIS.
```bash
CREATE EXTENSION postgis;
```
![image](https://user-images.githubusercontent.com/27439197/79312673-deae5400-7f1c-11ea-80da-82d19940c879.png)


### Run Migrations through Sequelize
In the `server` folder of the project run
```bash
npx sequelize-cli db:migrate
```

### Start the node server
```bash
//In the Server folder
node index.js
```
### Load Initial Data
Run the file `postgres_data_transfer.py` which will load data from `covid.tsv` and add the data 
to the database.
PS: This operation will take time.
```bash
python postgres_data_transfer.py
```

### Get better data.
The file `covid.tsv` might be stale, so ideally one would want to download newer data from
[Google Sheeet.](https://docs.google.com/spreadsheets/d/1jFQrYwbhPIaRL6t4TnpTO7W905U0B-W1FXS-GBYwz7M/edit?ouid=114988646546947661075&usp=sheets_home&ths=true)
