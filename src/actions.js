import * as api from "./api";

export const LOCATION_UPDATED = "LOCATION_UPDATED";

export function updateLocation() {
  return {
    type: LOCATION_UPDATED,
    payload: new Promise(async resolve => {
      // TODO: error handling
      const response = await api.ip();
      // response.country - CA
      // response.region - British Columbia
      // response.city - West End
      const [lat, lng] = response.loc.split(",");
      resolve({
        location: { lat: Number(lat), lng: Number(lng) }
      });
    })
  };
}
