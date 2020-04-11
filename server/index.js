const express = require("express");
const compression = require("compression");
const requestIp = require("request-ip");
const bodyParser = require("body-parser");
const stores = require("./service/stores");
const axios = require('axios');

async function getLocationFromIp(req) {
  const ip = req.clientIp;
  let url = `https://ipinfo.io/${ip}/json?token=737774ee26668f`;
  if (ip === '::1') {
    // For local testing
    url = `https://ipinfo.io/json?token=737774ee26668f`;
  }
  const response = await axios.get(url);
  const [lat, lng] = response.data.loc.split(",");
  return { lat: parseFloat(lat), lng: parseFloat(lng) }
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

app.get("/v2/query", async (req, res) => {
  let location = {lat: req.query.lat, lng: req.query.lng};
  if(!location.lat || !location.lng){
    location = await getLocationFromIp(req);
  }
  let query = {
    location: location,
    radius: req.query.radius,
    page: req.query.page
  }

  let results = await stores.findNearbyStores(query);
  res.send({results, location});
});

app.listen(process.env.PORT || 5000);
