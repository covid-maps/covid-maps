const geolib = require('geolib');
const stores = require("./stores");

const NUMBER_OF_BUCKETS = 5;

async function findStoreListings(params){
    let listings = await stores.findNearbyStores(params);
    addScoringParameters(listings, params);
    let listingsByBucket = groupByBucket(listings);
    let sortedListingsByBucket = sortBuckets(listingsByBucket);
    return flattenListings(sortedListingsByBucket);
}

function groupByBucket(storeListings){
    return storeListings.reduce(function(rv, x) {
        rv[x.scoreParams.bucket] = rv[x.scoreParams.bucket] || {};
        if(Array.isArray(rv[x.scoreParams.bucket][x.scoreParams.quality])){
            rv[x.scoreParams.bucket][x.scoreParams.quality].push(x)
        }else{
            rv[x.scoreParams.bucket][x.scoreParams.quality] = [x]
        }
        return rv;
    }, {});
}

function flattenListings(listingsByBucket){
    return listingsByBucket.sort((l1, l2) => {
            if(l1.bucketId > l2.bucketId){
                return 1;
            }
            return -1;
        }).flatMap(li => li.listings);
}

function addScoringParameters(listings, params){
    listings.forEach(storeUpdate => {
            storeUpdate.scoreParams = getScoringParameters(storeUpdate, params);
            storeUpdate.scoreParams.bucket = getBucket(storeUpdate);
        });
    normalizeQuality(listings);
}

function normalizeQuality(listings){
    let scores = {};
    listings.forEach(u => {
        let quality = u.scoreParams.quality;
        scores[u.StoreId] = scores[u.StoreId] || quality;
        if(scores[u.StoreId] < quality ){
            scores[u.StoreId] = quality;
        }
    });
    listings.forEach(u => {
        u.scoreParams.quality = scores[u.StoreId];
    })
}

function sortBuckets(listingsByBucket){
    return Object.keys(listingsByBucket)
        .map(bucketId => {
            if(bucketId == NUMBER_OF_BUCKETS){
                console.log("Final Bucket - Sorting by distance");
                return {bucketId: bucketId, listings: flattenListingsByQuality(sortStoresInBucket(listingsByBucket[bucketId], sortByDistance))};
            }else{
                return {bucketId: bucketId, listings: flattenListingsByQuality(sortStoresInBucket(listingsByBucket[bucketId], sortByRecency))};
            }
        })
}

function sortStoresInBucket(listingsByQuality, fn){
    return Object.keys(listingsByQuality)
        .map(quality => {return {
            quality: quality,
            listings: listingsByQuality[quality].sort(fn)
        }})
}

function flattenListingsByQuality(listings){
    return listings.sort((q1, q2) => {
        if(q1.quality >= q2.quality){
            return -1;
        }
        return 1;
    }).flatMap(q => q.listings)
}

const sortByRecency = (u1, u2) => {
    if(u1.Timestamp == u2.Timestamp){
        return 0;
    }
    if(u1.Timestamp > u2.Timestamp){
        return -1;
    }
    return 1;
};



const sortByDistance = (u1, u2) => {
    if(u1.scoreParams.distance >= u2.scoreParams.distance){
        return 1;
    }
    return -1;
};


function getBucket(storeUpdate){
    let distVal = storeUpdate.scoreParams.distance / 1000.0;
    if(distVal < 1){
        return 1;
    }
    if(distVal < 3){
        return 2;
    }
    if(distVal < 5){
        return 3;
    }
    if(distVal < 10){
        return 4;
    }
    return 5;
}

/**
 * Returns scoring parameters for sorting listing
 * @param storeUpdate - instance of a store info updates
 * @param params - user input
 * @returns {{quality, distance}} - quality rating for store data and distance from user
 */
function getScoringParameters(storeUpdate, params){
    return {
        quality: getQuality(storeUpdate), distance: getDistance(storeUpdate, params)
    };
}

/**
 * Finds crow-fly distance between store location and user location
 * @param storeUpdate - instance of a store info
 * @param params - user input
 */
function getDistance(storeUpdate, params){
    return geolib.getDistance(
        {latitude: params.location.lat, longitude: params.location.lng},
        {latitude: storeUpdate.Latitude, longitude: storeUpdate.Longitude}
    )
}

/**
 * Returns 2 for High, 1 for Medium and 0 for Low
 * @param storeUpdate  Store Update to be scored on quality
 */
function getQuality(storeUpdate){
    let availabilityScore = getQualityAvailabilityInfo(storeUpdate);
    let safetyScore = getQualitySafetyInfo(storeUpdate);
    return Math.max(availabilityScore, safetyScore);
}

function getQualityAvailabilityInfo(storeUpdate){
    if(Array.isArray(storeUpdate.availabilityTags) && storeUpdate.availabilityTags.length > 0){
        return 2;
    }
    if(storeUpdate["Useful Information"] && storeUpdate["Useful Information"].length > 60){
        return 1;
    }
    return 0;
}

function getQualitySafetyInfo(storeUpdate){
    if(Array.isArray(storeUpdate.safetyChecks) && storeUpdate.safetyChecks.length > 0){
        return 2;
    }
    if(storeUpdate["Safety Observations"] && storeUpdate["Safety Observations"].length > 60){
        return 1;
    }
    return 0;
}

module.exports = {
    findStoreListings
};