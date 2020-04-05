var models  = require('./models');

const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  "toilet-paper-app@eco-theater-119616.iam.gserviceaccount.com";

const doc = new GoogleSpreadsheet(
  "1jFQrYwbhPIaRL6t4TnpTO7W905U0B-W1FXS-GBYwz7M"
);

const SHEET_IDX = 0;

async function authenticate() {
  // Creds are either in a json file on disk
  // or in the process.env.GOOGLE_PRIVATE_KEY variable
  if (process.env.GOOGLE_PRIVATE_KEY) {
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
    });
  } else {
    // service account auth file
    credentials = require("./eco-theater-119616-2905c4812c35.json");
    await doc.useServiceAccountAuth(credentials);
  }
}


async function addInfoToDB(data){
  const store = await models.StoreInfo.findOne({ where: { name: data['Store Name'] } });
  if(store == null){
    return await addNewStore(data)
  }else{
    return await updateExistingStore(store, data)
  }
}

async function addNewStore(data){
  console.log(data)
  let storeInfo = {
    name: data["Store Name"],
    category: data["Store Category"],
    latitude: parseFloat(data.Latitude),
    longitude: parseFloat(data.Longitude),
    place_id: data["Place Id"] || "",
    address: data.Address || "",
    city: data.City || "",
    locality: data.Locality || "",
    country: data.Country || "",
    created_at: new Date(),
    updated_at: new Date(),
    storeUpdates: [{
      ip: data["User IP"],
      user_id: -1,
      availability_info: data["Useful Information"],
      safety_info: data["Safety Observations"],
      opening_time: data["Opening Time"],
      closing_time: data["Closing Time"],
      created_at: new Date(),
      updated_at: new Date()
    }]
  };
  console.log(storeInfo);
  return await models.StoreInfo.create(storeInfo, {
    include: [{
      association: models.StoreUpdates,
      as: 'storeUpdates'
    }]
  })
}

async function updateExistingStore(store, data){

}

function rowValue(headerValues, row) {
  let values = {};
  headerValues.forEach(title => {
    values[title] = row[title];
  });
  return values;
}

async function getRows() {
  await authenticate();
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[SHEET_IDX];
  const rows = await sheet.getRows({ limit: 1000 });
  return rows.map(row => rowValue(sheet.headerValues, row));
}

async function addRow(values) {
  await authenticate();
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  return rowValue(Object.keys(values), await sheet.addRow(values));
}

const app = express();
app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.get("/v0/query", async (req, res) => {
  try {
    res.send(await getRows());
  } catch (error) {
    console.log("Error in query:", error);
    res.status(500).send({ error });
  }
});

app.post("/v0/update", async (req, res) => {
  try {
    res.send(await addInfoToDB(req.body));
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.get("/v1/query", async(req, res) => {
  console.log(models.StoreInfo.findAll({
    include : [{
      model : models.StoreUpdates
    }]
  }));
  res.send("new backend get query");
});


app.listen(process.env.PORT || 5000);
