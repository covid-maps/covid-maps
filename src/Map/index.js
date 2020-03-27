import React from "react";
import Map from "./GoogleMap";
import { geolocated } from "react-geolocated";

function MapWithLocation(props) {
  const position = props.coords
    ? {
        lat: props.coords.latitude,
        lng: props.coords.longitude
      }
    : undefined;
  return (
    <>
      <Map {...props} position={position} />
      {!props.isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
      ) : !props.isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
      ) : props.coords ? (
        <div>
          <small>
            lat {props.coords.latitude}, lng {props.coords.longitude}
          </small>
        </div>
      ) : (
        <div>Getting the location data&hellip; </div>
      )}
    </>
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(MapWithLocation);
