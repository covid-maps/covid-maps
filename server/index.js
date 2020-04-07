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


function mapDBRow(data){
  return data.StoreUpdates.map(up => {
    return {
      "User IP": up.ip,
      Timestamp: up.created_at,
      Latitude: data.latitude,
      Longitude: data.longitude,
      Coordinate: data.coordinate,
      "Store Category": data.category.split(","),
      "Store Name": data.name,
      "Safety Observations": up.safetyInfo,
      "Useful Information": up.availabilityInfo,
      "Place Id": data.placeId,
      City: data.city,
      Locality: data.locality,
      Address: data.address,
      Country: data.country,
      "Opening Time": up.openingTime,
      "Closing Time": up.closingTime
    }
  })
}

async function addInfoToDB(data, forceDateUpdate = false){
  const store = await models.StoreInfo.findOne({ where: { name: data['Store Name'] } });
  if(store == null){
    return await addNewStore(data, forceDateUpdate)
  }else{
    return await updateExistingStore(store, data, forceDateUpdate)
  }
}

function buildStoreObject(data){
  return {
    name: data["Store Name"],
    category: data["Store Category"],
    latitude: parseFloat(data.Latitude),
    longitude: parseFloat(data.Longitude),
    coordinate: { type: 'Point', coordinates: [parseFloat(data.Latitude),parseFloat(data.Longitude)]},
    placeId: data["Place Id"] || "",
    address: data.Address || "",
    city: data.City || "",
    locality: data.Locality || "",
    country: data.Country || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    StoreUpdates: [{
      ip: data["User IP"],
      user_id: -1,
      availabilityInfo: data["Useful Information"],
      safetyInfo: data["Safety Observations"],
      openingTime: data["Opening Time"],
      closingTime: data["Closing Time"],
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  };
}

async function addNewStore(data, forceDateUpdate){
  let storeInfo = buildStoreObject(data);
  if(forceDateUpdate && data.Timestamp){
      storeInfo.createdAt = data.Timestamp;
      storeInfo.updatedAt = data.Timestamp;
  }
  return await models.StoreInfo.create(storeInfo, {
    include: [{
      model: models.StoreUpdates
    }]
  })
}

async function updateExistingStore(store, data, forceDateUpdate){
  let categories = store.category.split(",");
  if(!categories.includes(data["Store Category"])){
    categories.push(data["Store Category"])
  }
  let updatedAt = new Date();
  if(forceDateUpdate && data.Timestamp){
    updatedAt = data.Timestamp;
  }
  return await models.sequelize.transaction(async (t) => {

    const updatedStore = await store.update({
      category: categories.join(","),
      latitude: parseFloat(data.Latitude),
      longitude: parseFloat(data.Longitude),
      coordinate: { type: 'Point', coordinates: [parseFloat(data.Latitude),parseFloat(data.Longitude)]},
      placeId: data["Place Id"] || "",
      address: data.Address || "",
      city: data.City || "",
      locality: data.Locality || "",
      country: data.Country || "",
      updatedAt: new Date()
    }, { transaction: t });

    const updatedInfo = await models.StoreUpdates.create({
      ip: data["User IP"],
      storeId: store.id,
      user_id: -1,
      availabilityInfo: data["Useful Information"],
      safetyInfo: data["Safety Observations"],
      openingTime: data["Opening Time"],
      closingTime: data["Closing Time"],
      updatedAt: new Date()
    }, { transaction: t });

    updatedStore.StoreUpdates = [updatedInfo];
    return updatedStore;
  });

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
    const ressult = await addRow(req.body);
    console.log(ressult);
    res.send(ressult);
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.post("/v1/update", async (req, res) => {
  try {
    const store = await addInfoToDB(req.body);
    res.send(mapDBRow(store)[0]);
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.post("/v1/admin-add", async (req, res) => {
  try {
    const store = await addInfoToDB(req.body, true);
    res.send(mapDBRow(store)[0]);
  } catch (error) {
    console.log("Error in submit:", error);
    res.status(500).send({ error });
  }
});

app.get("/v1/query", async(req, res) => {
  const stores = await models.StoreInfo.findAll({
    include : [{
      model : models.StoreUpdates
    }]
  });
  res.send(stores.flatMap(store => mapDBRow(store)));
});


app.listen(process.env.PORT || 5000);
