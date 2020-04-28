const express = require("express");
const compression = require("compression");
const requestIp = require("request-ip");
const bodyParser = require("body-parser");
const stores = require("./service/stores");
const votes = require("./service/votes");
const axios = require("axios");
const Sentry = require("@sentry/node");
const rateLimit = require("express-rate-limit");

const IS_PRODUCTION = process.env.ERROR_TRACKING; // defined in Procfile

if (IS_PRODUCTION) {
  Sentry.init({
    dsn:
      "https://f26d1f5d8e2a45c9ad4b98eaabf8d101@o370711.ingest.sentry.io/5198144",
  });
}

async function getLocationFromIp(req) {
  const ip = req.clientIp;
  let url = `https://ipinfo.io/${ip}/json?token=737774ee26668f`;
  if (ip === "::1") {
    // For local testing
    url = `https://ipinfo.io/json?token=737774ee26668f`;
  }
  const response = await axios.get(url);
  const [lat, lng] = response.data.loc.split(",");
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

const getFormDataWithUserIp = (req, key) => {
  return {
    ...req.body,
    [key]: req.clientIp,
  };
};

const app = express();
// Since heroku runs a reverse proxy, we need to change how we get request IPs
// https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", true);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
  })
);

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

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.post("/v1/update", async (req, res) => {
  try {
    res.send(await stores.addStoreData(getFormDataWithUserIp(req, "User IP")));
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
    stores.findAllStores(),
    getLocationFromIp(req),
  ]);
  res.send({ results, location });
});

app.get("/v2/query", async (req, res) => {
  const { query } = req;
  let location = undefined;
  if (query.lat && query.lng) {
    location = { lat: parseFloat(query.lat), lng: parseFloat(query.lng) };
  } else {
    location = await getLocationFromIp(req);
  }
  let params = {
    location,
    radius: query.radius,
    page: query.page,
  };
  let results = await stores.findNearbyStores(params);
  res.send({ location, results });
});

app.get("/v2/queryByStoreId", async (req, res) => {
  const { query } = req;
  if (!query.storeId) {
    res.sendStatus(400);
    return;
  }
  let params = {
    storeId: query.storeId,
    radius: query.radius,
    page: query.page,
  };
  if (!params.storeId) {
    res.sendStatus(400);
  }
  let store = await stores.findStoreById(params.storeId);
  params.location = { lat: store.Latitude, lng: store.Longitude };
  let results = await stores.findNearbyStores(params);
  res.send({ location: params.location, results });
});

app.post("/v1/vote", async (req, res) => {
  res.send(await votes.addVote(getFormDataWithUserIp(req, "ip")));
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is now listening at port", port));
