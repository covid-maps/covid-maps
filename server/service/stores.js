var models  = require('../models');

const DEFAULT_DISTANCE_RANGE = 0.1; //approx 11kms - https://stackoverflow.com/questions/8464666/distance-between-2-points-in-postgis-in-srid-4326-in-metres
const MAX_DISTANCE_RADIUS_METERS = 200000

async function addStoreData(data, forceUpdate = false){
    const store = await addInfoToDB(data, forceUpdate);
    return mapDBRow(store)[0];
}

async function findAllStores(){
    const stores = await models.StoreInfo.findAll({
        include : [{
            model : models.StoreUpdates
        }]
    });
    return stores.flatMap(store => mapDBRow(store));
}

async function findNearbyStores(params){
    if(!params.lat || !params.lng){
        return [];
    }
    return await models.StoreInfo.findAll({
        include: [{
                model : models.StoreUpdates
            }],
        where: models.sequelize.where(
            models.sequelize.fn(
                "ST_DWithin",
                models.sequelize.col('coordinate'),
                models.sequelize.fn(
                    "ST_Transform",
                    models.sequelize.cast(
                        `SRID=4326;POINT(${params.lng} ${params.lat})`,
                        "geometry"),
                    4326),
                getDistanceRange(params)
            ),
            true
        )
    })
}

function getDistanceRange(params){
    if(!params.radius){
        return DEFAULT_DISTANCE_RANGE
    }
    if(params.radius > MAX_DISTANCE_RADIUS_METERS){
        return toRadialDistance(MAX_DISTANCE_RADIUS_METERS)
    }else{
        return toRadialDistance(params.radius)
    }
}

/**
 *
 * @param mt Distance in meters
 */
function toRadialDistance(mt){
    return (0.001/111) * mt
}

function mapDBRow(data){
    return data.StoreUpdates.map(update => {
        return {
            "User IP": update.ip,
            Timestamp: update.createdAt,
            Latitude: data.latitude,
            Longitude: data.longitude,
            Coordinate: data.coordinate,
            StoreId: data.id,
            [FORM_FIELDS.STORE_CATEGORY]: data.category.split(","),
            [FORM_FIELDS.STORE_NAME]: data.name,
            [FORM_FIELDS.SAFETY_OBSERVATIONS]: update.safetyInfo,
            [FORM_FIELDS.USEFUL_INFORMATION]: update.availabilityInfo,
            [FORM_FIELDS.PLACE_ID]: data.placeId,
            City: data.city,
            Locality: data.locality,
            Address: data.address,
            Country: data.country,
            [FORM_FIELDS.OPENING_TIME]: update.openingTime,
            [FORM_FIELDS.CLOSING_TIME]: update.closingTime,
        }
    })
}

async function addInfoToDB(data, forceDateUpdate){
    let store = null
    if(data[FORM_FIELDS.PLACE_ID] && data[FORM_FIELDS.PLACE_ID] !== ""){
        store = await models.StoreInfo.findOne({ where: { placeId: data[FORM_FIELDS.PLACE_ID] } });
    }
    if(store == null){
        return await addNewStore(data, forceDateUpdate)
    }else{
        return await updateExistingStore(store, data, forceDateUpdate)
    }
}

function buildStoreObject(data, forceDateUpdate){
    let dt = new Date();
    if(forceDateUpdate && data.Timestamp){
        dt = data.Timestamp;
    }
    return {
        name: data[FORM_FIELDS.STORE_NAME],
        category: data[FORM_FIELDS.STORE_CATEGORY],
        latitude: parseFloat(data.Latitude),
        longitude: parseFloat(data.Longitude),
        coordinate: { type: 'Point', coordinates: [parseFloat(data.Longitude),parseFloat(data.Latitude)]},
        placeId: data[FORM_FIELDS.PLACE_ID] || "",
        address: data.Address || "",
        city: data.City || "",
        locality: data.Locality || "",
        country: data.Country || "",
        createdAt: dt,
        updatedAt: dt,
        StoreUpdates: [{
            ip: data["User IP"],
            user_id: -1,
            availabilityInfo: data[FORM_FIELDS.USEFUL_INFORMATION],
            safetyInfo: data[FORM_FIELDS.SAFETY_OBSERVATIONS],
            openingTime: data[FORM_FIELDS.OPENING_TIME],
            closingTime: data[FORM_FIELDS.CLOSING_TIME],
            createdAt: dt,
            updatedAt: dt
        }]
    };
}

async function addNewStore(data, forceDateUpdate){
    let storeInfo = buildStoreObject(data, forceDateUpdate);
    return await models.StoreInfo.create(storeInfo, {
        include: [{
            model: models.StoreUpdates
        }]
    })
}

async function updateExistingStore(store, data, forceDateUpdate){
    let categories = store.category.split(",");
    if(!categories.includes(data[FORM_FIELDS.STORE_CATEGORY])){
        categories.push(data[FORM_FIELDS.STORE_CATEGORY])
    }
    let dt = new Date();
    if(forceDateUpdate && data.Timestamp){
        dt = data.Timestamp;
    }
    return await models.sequelize.transaction(async (t) => {

        const updatedStore = await store.update({
            category: categories.join(","),
            latitude: parseFloat(data.Latitude),
            longitude: parseFloat(data.Longitude),
                coordinate: { type: 'Point', coordinates: [parseFloat(data.Longitude),parseFloat(data.Latitude)]},
            placeId: data[FORM_FIELDS.PLACE_ID] || "",
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
            availabilityInfo: data[FORM_FIELDS.USEFUL_INFORMATION],
            safetyInfo: data[FORM_FIELDS.SAFETY_OBSERVATIONS],
            openingTime: data[FORM_FIELDS.OPENING_TIME],
            closingTime: data[FORM_FIELDS.CLOSING_TIME],
            createdAt: dt,
            updatedAt: dt
        }, { transaction: t });

        updatedStore.StoreUpdates = [updatedInfo];
        return updatedStore;
    });

}

module.exports =  {
    findAllStores,
    addStoreData,
    findNearbyStores
};