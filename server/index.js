const express = require("express");
const compression = require("compression");
const requestIp = require("request-ip");
const bodyParser = require("body-parser");
const axios = require('axios');
const { GoogleSpreadsheet } = require("google-spreadsheet");
const stores = require("./service/stores");

const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  "toilet-paper-app@eco-theater-119616.iam.gserviceaccount.com";

const doc = new GoogleSpreadsheet(
  "1jFQrYwbhPIaRL6t4TnpTO7W905U0B-W1FXS-GBYwz7M"
);

const SHEET_IDX = 0;

async function getLocationFromIp(req) {
  const ip = req.clientIp;
  const url = `https://ipinfo.io/${ip}/json?token=737774ee26668f`;
  const response = await axios.get(url);
  const [lat, lng] = response.data.loc.split(",");
  return { lat: parseFloat(lat), lng: parseFloat(lng) }
}

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
  const rows = await sheet.getRows({ limit: 2000 });
  return rows.map(row => rowValue(sheet.headerValues, row));
}

async function addRow(values) {
  await authenticate();
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  return rowValue(Object.keys(values), await sheet.addRow(values));
}

const getFormDataWithUserIp = req => {
  return {
    ...req.body,
    "User IP": req.clientIp
  };
};

const app = express();
app.use(express.json());
app.use(compression());
app.use(requestIp.mw());
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
    const ressult = await addRow(getFormDataWithUserIp(req));
    console.log(ressult);
    res.send(ressult);
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.post("/v1/update", async (req, res) => {
  try {
    res.send(await stores.addStoreData(getFormDataWithUserIp(req)));
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.post("/v1/admin-add", async (req, res) => {
  try {
    res.send(await stores.addStoreData(req.body, true));
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.get("/v1/query", async (req, res) => {
  const [results, location] = await Promise.all([
    stores.findAllStores(), getLocationFromIp(req)
  ]);
  res.send({ results, location });
});

app.listen(process.env.PORT || 5000);
