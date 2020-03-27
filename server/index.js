const express = require("express");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  "toilet-paper-app@eco-theater-119616.iam.gserviceaccount.com";

const doc = new GoogleSpreadsheet(
  "1tq6s8uHfLpu2QS61P2qxSawL2LjD48-_-NUI4QM_ZRo"
);

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
  console.log(doc.title);
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows({ limit: 100 });
  return rows.map(row => rowValue(sheet.headerValues, row));
}

async function addRow(values) {
  console.log(values);
  await authenticate();
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  return rowValue(Object.keys(values), await sheet.addRow(values));
}

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/v0/submit", async (req, res) => {
  try {
    res.send(await addRow(req.body));
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.listen(process.env.PORT || 5000);
