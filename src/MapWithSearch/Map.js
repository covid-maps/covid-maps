import React, { useRef, useState } from "react";
import { GoogleMap, withGoogleMap, Marker, Circle } from "react-google-maps";
import { GOOGLE_API_KEY, icons, makeIcon } from "../utils";

const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  // `greedy` will disable the two-finger
  // drag behavior on mobile.
  gestureHandling: "greedy"
};

const defaultCenter = { lat: 49.281376, lng: -123.111382 };

function MyGoogleMap(props) {
  const [markerPosition, setMarkerPosition] = useState();
  const refMap = useRef(null);

  const handlePositionChanged = center => {
    setMarkerPosition(center);
    props.onBoundsChanged &&
      props.onBoundsChanged({ lat: center.lat(), lng: center.lng() });
  };

  const handleBoundsChanged = () => {
    const mapCenter = refMap.current.getCenter();
    handlePositionChanged(mapCenter);
  };

  const handleMarkerClicked = location => {
    refMap.current.panTo(location.latLng);
    handlePositionChanged(location.latLng);
    props.onPositionChanged &&
      props.onPositionChanged({
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      });
  };

  const centerProps = props.position
    ? { center: props.position }
    : { defaultCenter };
  const defaultIcon = makeIcon(icons.default);
  const highlightedIcon = makeIcon(icons.highlighted);
  const getMarkerIcon = location => {
    const isSelected =
      props.position &&
      props.position.lat === location.lat &&
      props.position.lng === location.lng;
    return isSelected ? highlightedIcon : defaultIcon;
  };
  const markers = props.locations || [];

  return (
    <GoogleMap
      ref={refMap}
      defaultZoom={13}
      defaultOptions={defaultMapOptions}
      defaultCenter={{ lat: 54, lng: 25 }}
      onBoundsChanged={handleBoundsChanged}
      {...centerProps}
      onDragEnd={() => {
        const mapCenter = refMap.current.getCenter();
        props.onMarkerDragged && props.onMarkerDragged(mapCenter);
      }}
    >
      {markers.map(location => (
        <Marker
          position={location}
          onClick={handleMarkerClicked}
          icon={getMarkerIcon(location)}
        />
      ))}

      <Circle
        center={props.currentLocation}
        radius={70}
        options={{
          strokeColor: "#2688ff",
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: "#2688ff",
          fillOpacity: 0.4
        }}
      />

      {props.isMarkerShown && (
        <Marker
          draggable={!!props.onMarkerDragged}
          position={markerPosition}
          icon={defaultIcon}
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

const MyMap = withGoogleMap(MyGoogleMap);

class Map extends React.Component {
  render() {
    return (
      <MyMap
        locations={this.props.locations}
        position={this.props.position}
        currentLocation={this.props.currentLocation}
        onMarkerDragged={this.props.onMarkerDragged}
        onBoundsChanged={this.props.onBoundsChanged}
        onPositionChanged={this.props.onPositionChanged}
        isMarkerShown={this.props.isMarkerShown}
        googleMapURL={URL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={this.props.style} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default Map;
