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
    // let _map = undefined;
    // let markerPosition = undefined;

    return (
      <GoogleMap
        defaultZoom={13}
        defaultOptions={defaultMapOptions}
        defaultCenter={props.position}
        center={props.position}
        // ref={map => (_map = map)}
        // onDrag={() => {
        //   markerPosition = _map.getCenter().toJSON();
        // }}
      >
        {props.isMarkerShown && (
          <Marker
            draggable={!!props.onMarkerDragged}
            position={props.position}
            onDragEnd={event =>
              props.onMarkerDragged &&
              props.onMarkerDragged({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              })
            }
          />
        )}
      </GoogleMap>
    );
  })
);

function Map({ style, position, onMarkerDragged }) {
  return (
    <MyMapComponent
      isMarkerShown
      onMarkerDragged={onMarkerDragged}
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
