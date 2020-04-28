const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const DEFAULT_DISTANCE_RANGE = 0.1; //approx 11kms - https://stackoverflow.com/questions/8464666/distance-between-2-points-in-postgis-in-srid-4326-in-metres
const MAX_DISTANCE_RADIUS_METERS = 200000;

async function addStoreData(data, forceUpdate = false) {
  const store = await addInfoToDB(data, forceUpdate);
  return mapDBRow(store)[0];
}

async function findAllStores() {
  const stores = await models.StoreInfo.findAll({
    include: [
      {
        model: models.StoreUpdates,
        where: { deleted: false },
      },
    ],
  });
  return stores.flatMap(store => mapDBRow(store));
}

async function findNearbyStores({ location, radius }) {
  if (!location.lat || !location.lng) {
    return [];
  }
  const stores = await models.StoreInfo.findAll({
    where: models.sequelize.where(
      Sequelize.fn(
        "ST_DWithin",
        Sequelize.col("coordinate"),
        Sequelize.fn(
          "ST_Transform",
          Sequelize.cast(
            `SRID=4326;POINT(${location.lng} ${location.lat})`,
            "geometry"
          ),
          4326
        ),
        getDistanceRange(radius)
      ),
      true
    ),
  });
  const storeUpdates = await models.StoreUpdates.findAll({
    where: {
      storeId: {
        [Op.in]: stores.map(store => store.id),
      },
    },
    include: [
      {
        model: models.Votes,
      },
    ],
  });
  return storeUpdates.map(update =>
    buildResult(
      stores.find(store => store.id === update.storeId),
      update,
      votesCount(update)
    )
  );
}

function votesCount(data) {
  const up = data.Votes.reduce((k, v) => (v.type === "up" ? k + 1 : k), 0);
  const down = data.Votes.reduce((k, v) => (v.type === "down" ? k + 1 : k), 0);
  return { up, down };
}

function getDistanceRange(radius) {
  if (!radius) {
    return DEFAULT_DISTANCE_RANGE;
  }
  if (radius > MAX_DISTANCE_RADIUS_METERS) {
    return toRadialDistance(MAX_DISTANCE_RADIUS_METERS);
  } else {
    return toRadialDistance(radius);
  }
}

/**
 *
 * @param mt Distance in meters
 */
function toRadialDistance(mt) {
  return (0.001 / 111) * mt;
}

function mapDBRow(data) {
  return data.StoreUpdates.map(update => buildResult(data, update));
}

function buildResult(store, update, votes = undefined) {
  return {
    id: update.id,
    "User IP": update.ip,
    Timestamp: update.createdAt,
    Latitude: store.latitude,
    Longitude: store.longitude,
    Coordinate: store.coordinate,
    StoreId: store.id,
    "Store Category":
      store.category && store.category.length ? store.category.split(",") : [],
    "Store Name": store.name,
    "Safety Observations": update.safetyInfo,
    "Useful Information": update.availabilityInfo,
    "Place Id": store.placeId,
    City: store.city,
    Locality: store.locality,
    Address: store.address,
    Country: store.country,
    "Opening Time": update.openingTime,
    "Closing Time": update.closingTime,
    availabilityTags: update.availabilityTags,
    safetyChecks: update.safetyChecks,
    votes,
  };
}

async function addInfoToDB(data, forceDateUpdate) {
  let store = null;
  if (data["Place Id"] && data["Place Id"] != "") {
    store = await models.StoreInfo.findOne({
      where: { placeId: data["Place Id"] },
    });
  }
  if (store == null) {
    return await addNewStore(data, forceDateUpdate);
  } else {
    return await updateExistingStore(store, data, forceDateUpdate);
  }
}

function buildStoreObject(data, forceDateUpdate) {
  let dt = new Date();
  if (forceDateUpdate && data.Timestamp) {
    dt = data.Timestamp;
  }
  return {
    name: data["Store Name"],
    category: data["Store Category"],
    latitude: parseFloat(data.Latitude),
    longitude: parseFloat(data.Longitude),
    coordinate: {
      type: "Point",
      coordinates: [parseFloat(data.Longitude), parseFloat(data.Latitude)],
      crs: { type: "name", properties: { name: "EPSG:4326" } },
    },
    placeId: data["Place Id"] || "",
    address: data.Address || "",
    city: data.City || "",
    locality: data.Locality || "",
    country: data.Country || "",
    createdAt: dt,
    updatedAt: dt,
    StoreUpdates: [
      {
        ip: data["User IP"],
        user_id: -1,
        availabilityInfo: data["Useful Information"],
        safetyInfo: data["Safety Observations"],
        openingTime: data["Opening Time"],
        closingTime: data["Closing Time"],
        createdAt: dt,
        updatedAt: dt,
        availabilityTags: data["availabilityTags"],
        safetyChecks: data["safetyChecks"],
      },
    ],
  };
}

async function addNewStore(data, forceDateUpdate) {
  let storeInfo = buildStoreObject(data, forceDateUpdate);
  return await models.StoreInfo.create(storeInfo, {
    include: [
      {
        model: models.StoreUpdates,
      },
    ],
  });
}

async function updateExistingStore(store, data, forceDateUpdate) {
  let categories = store.category.split(",");
  if (!categories.includes(data["Store Category"])) {
    categories.push(data["Store Category"]);
  }
  let dt = new Date();
  if (forceDateUpdate && data.Timestamp) {
    dt = data.Timestamp;
  }
  return await models.sequelize.transaction(async t => {
    const updatedStore = await store.update(
      {
        category: categories.join(","),
        latitude: parseFloat(data.Latitude),
        longitude: parseFloat(data.Longitude),
        coordinate: {
          type: "Point",
          coordinates: [parseFloat(data.Longitude), parseFloat(data.Latitude)],
          crs: { type: "name", properties: { name: "EPSG:4326" } },
        },
        placeId: data["Place Id"] || "",
        address: data.Address || "",
        city: data.City || "",
        locality: data.Locality || "",
        country: data.Country || "",
        updatedAt: new Date(),
      },
      { transaction: t }
    );

    const updatedInfo = await models.StoreUpdates.create(
      {
        ip: data["User IP"],
        storeId: store.id,
        user_id: -1,
        availabilityInfo: data["Useful Information"],
        safetyInfo: data["Safety Observations"],
        openingTime: data["Opening Time"],
        closingTime: data["Closing Time"],
        createdAt: dt,
        updatedAt: dt,
        availabilityTags: data["availabilityTags"],
        safetyChecks: data["safetyChecks"],
      },
      { transaction: t }
    );

    updatedStore.StoreUpdates = [updatedInfo];
    return updatedStore;
  });
}

async function findStoreById(storeId) {
  const store = await models.StoreInfo.findOne({
    include: [
      {
        model: models.StoreUpdates,
        where: { deleted: false, storeId: storeId },
      },
    ],
  });
  if (!store) {
    throw new Error("Store Not Found");
  }
  const mappedStores = [store].flatMap(store => mapDBRow(store));
  if (mappedStores.length == 0) {
    throw new Error("Store Not Found");
  }
  return mappedStores[0];
}

module.exports = {
  findAllStores,
  addStoreData,
  findNearbyStores,
  findStoreById,
};
