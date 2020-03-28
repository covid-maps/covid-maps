import React, { useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps";
import { geolocated } from "react-geolocated";

import { GOOGLE_API_KEY } from "../utils";

const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  gestureHandling: "greedy"
};

const defaultCenter = { lat: 49.281376, lng: -123.111382 };

const dragCross =
  "https://maps.gstatic.com/mapfiles/api-3/images/drag-cross_hdpi.png";

const marker =
  "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png";

function MyGoogleMap(props) {
  const [markerPosition, setMarkerPosition] = useState();
  const refMap = useRef(null);

  const handleBoundsChanged = () => {
    const mapCenter = refMap.current.getCenter();
    setMarkerPosition(mapCenter);
  };

  const propsToSend = props.position
    ? { center: props.position }
    : { defaultCenter };

  return (
    <GoogleMap
      ref={refMap}
      defaultZoom={14}
      defaultOptions={defaultMapOptions}
      defaultCenter={{ lat: 54, lng: 25 }}
      onBoundsChanged={handleBoundsChanged}
      {...propsToSend}
      onDragEnd={() => {
        const mapCenter = refMap.current.getCenter();
        props.onMarkerDragged && props.onMarkerDragged(mapCenter);
      }}
    >
      {props.isMarkerShown && (
        <Marker
          draggable={!!props.onMarkerDragged}
          position={markerPosition}
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
}

const MyMap = withScriptjs(withGoogleMap(MyGoogleMap));

function Map({ style, position, onMarkerDragged }) {
  return (
    <MyMap
      position={position}
      onMarkerDragged={onMarkerDragged}
      isMarkerShown
      googleMapURL={URL}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={style} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}

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

// export default Map;
