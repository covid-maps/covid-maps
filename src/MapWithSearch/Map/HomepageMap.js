import React, { useRef } from "react";
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps";
import { mapOptions } from "./theme";
import {
  GOOGLE_API_KEY,
  icons,
  markerIcon,
  dotIcon,
  isSameLocation
} from "../../utils";

const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

const defaultIcon = markerIcon(icons.default);
const highlightedIcon = markerIcon(icons.highlighted);
const defaultCenter = { lat: 49.281376, lng: -123.111382 };

function MyGoogleMap(props) {
  const refMap = useRef(null);

  const handleMarkerClicked = location => {
    const latLng = { lat: location.latLng.lat(), lng: location.latLng.lng() };
    props.onMarkerSelected && props.onMarkerSelected(latLng);
  };

  const centerProps = props.centerPosition
    ? { center: props.centerPosition }
    : props.currentLocation
    ? { center: props.currentLocation }
    : { center: defaultCenter };
  const isMarkerSelected = location => {
    return (
      props.selectedLocation && isSameLocation(props.selectedLocation, location)
    );
  };
  const getMarkerIcon = location =>
    isMarkerSelected(location) ? highlightedIcon : defaultIcon;
  const getZIndex = location => (isMarkerSelected(location) ? 10 : 1);
  const markers = props.locations || [];

  if (props.panToLocation) {
    refMap.current && refMap.current.panTo(props.panToLocation);
  }

  return (
    <GoogleMap
      ref={refMap}
      defaultZoom={13}
      defaultOptions={mapOptions}
      defaultCenter={{ lat: 54, lng: 25 }}
      {...centerProps}
    >
      <Marker position={props.currentLocation} icon={dotIcon} />
      {markers.map(location => (
        <Marker
          position={location}
          onClick={handleMarkerClicked}
          icon={getMarkerIcon(location)}
          zIndex={getZIndex(location)}
        />
      ))}
    </GoogleMap>
  );
}

const MyMap = withGoogleMap(MyGoogleMap);

class Map extends React.Component {
  render() {
    return (
      <MyMap
        locations={this.props.locations}
        onMarkerSelected={this.props.onMarkerSelected}
        selectedLocation={this.props.selectedLocation}
        panToLocation={this.props.panToLocation}
        centerPosition={this.props.centerPosition}
        currentLocation={this.props.currentLocation}
        googleMapURL={URL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={this.props.style} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default Map;
