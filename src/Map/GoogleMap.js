import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { GOOGLE_API_KEY } from "../utils";

const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false
};

const MyMapComponent = withScriptjs(
  withGoogleMap(props => {
    return (
      <GoogleMap
        defaultZoom={13}
        defaultOptions={defaultMapOptions}
        defaultCenter={props.position}
        center={props.position}
      >
        {props.isMarkerShown && <Marker position={props.position} />}
      </GoogleMap>
    );
  })
);

function Map({ style, position }) {
  return (
    <MyMapComponent
      isMarkerShown
      position={position}
      googleMapURL={URL}
      mapTypeControl={false}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={style} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}

export default Map;
