var models = require("../models");

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
    include: [
      {
        model: models.StoreUpdates,
        where: { deleted: false },
      },
    ],
    where: models.sequelize.where(
      models.sequelize.fn(
        "ST_DWithin",
        models.sequelize.col("coordinate"),
        models.sequelize.fn(
          "ST_Transform",
          models.sequelize.cast(
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
  return stores.flatMap(store => mapDBRow(store));
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
  return data.StoreUpdates.map(update => {
    return {
      id: update.id,
      "User IP": update.ip,
      Timestamp: update.createdAt,
      Latitude: data.latitude,
      Longitude: data.longitude,
      Coordinate: data.coordinate,
      StoreId: data.id,
      "Store Category":
        data.category && data.category.length ? data.category.split(",") : [],
      "Store Name": data.name,
      "Safety Observations": update.safetyInfo,
      "Useful Information": update.availabilityInfo,
      "Place Id": data.placeId,
      City: data.city,
      Locality: data.locality,
      Address: data.address,
      Country: data.country,
      "Opening Time": update.openingTime,
      "Closing Time": update.closingTime,
      availabilityTags: update.availabilityTags,
      safetyChecks: update.safetyChecks,
    };
  });
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
  let categories = [];
  if (store.category != null) {
    categories = store.category.split(",");
  }

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
