import React from "react";
import Map from "./GoogleMap";
import { geolocated } from "react-geolocated";

function Status(props) {
  return (
    <div>
      <small>{props.children}</small>
    </div>
  );
}

function MapWithLocation(props) {
  const position = props.coords
    ? {
        lat: props.coords.latitude,
        lng: props.coords.longitude
      }
    : undefined;
  return (
    <>
      <Map {...props} position={props.position || position} />
      {!props.isGeolocationAvailable ? (
        <Status>Your browser does not support Geolocation</Status>
      ) : !props.isGeolocationEnabled ? (
        <Status>Geolocation is not enabled</Status>
      ) : props.coords ? (
        <Status>
          lat {props.coords.latitude}, lng {props.coords.longitude}
        </Status>
      ) : (
        <Status>Getting the location data</Status>
      )}
    </>
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
    timeout: Infinity
  },
  userDecisionTimeout: 5000
})(MapWithLocation);
