const express = require("express");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const SERVICE_ACCOUNT =
  "toilet-paper-app@eco-theater-119616.iam.gserviceaccount.com";

const doc = new GoogleSpreadsheet(
  "1tq6s8uHfLpu2QS61P2qxSawL2LjD48-_-NUI4QM_ZRo"
);

async function authenticate() {
  await doc.useServiceAccountAuth(
    // service account auth file
    require("./eco-theater-119616-2905c4812c35.json")
  );
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
//

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.get("/v0/query", async (req, res) => {
  res.send(await getRows());
});

app.post("/v0/submit", async (req, res) => {
  res.send(await addRow(req.body));
});

app.listen(3000);
