import * as api from "./api";

export const LOCATION_UPDATED = "LOCATION_UPDATED";

export function updateLocation() {
  return {
    type: LOCATION_UPDATED,
    payload: new Promise(async resolve => {
      const response = await api.ip();
      const [lat, lng] = response.loc.split(",");
      resolve({
        ip: response.ip,
        location: { lat: Number(lat), lng: Number(lng) }
      });
    })
  };
}
