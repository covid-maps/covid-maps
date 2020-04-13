const express = require("express");
const compression = require("compression");
const requestIp = require("request-ip");
const bodyParser = require("body-parser");
const stores = require("./service/stores");
const axios = require('axios');
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://f26d1f5d8e2a45c9ad4b98eaabf8d101@o370711.ingest.sentry.io/5198144' });

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
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

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

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
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
  let location = { lat: req.query.lat, lng: req.query.lng };
  if (!location.lat || !location.lng) {
    location = await getLocationFromIp(req);
  }
  let query = {
    location: location,
    radius: req.query.radius,
    page: req.query.page
  }

  let results = await stores.findNearbyStores(query);
  res.send({ location, results });
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
app.listen(process.env.PORT || 5000);
