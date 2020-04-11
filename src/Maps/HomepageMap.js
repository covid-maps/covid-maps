import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { dotIcon, markerIcon, icons, isSameLocation } from "../utils";
import { mapOptions } from "./theme";

// Final fallback to a location in Vancouver (should never be shown)
const defaultCenter = { lat: 49.281376, lng: -123.111382 };

class Map extends Component {
  static defaultProps = {
    centerPosition: {},
    currentLocation: {},
    locations: [],
    panToLocation: false,
    selectedLocation: undefined
  };

  map = undefined;

  markerClickHandler = event => {
    this.props.onMarkerSelected({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  isMarkerSelected = latlng => {
    return (
      this.props.selectedLocation &&
      isSameLocation(this.props.selectedLocation, latlng)
    );
  };

  mapCenter = () => {
    if (this.props.centerPosition && this.props.centerPosition.lat) {
      return this.props.centerPosition;
    }
    if (this.props.currentLocation && this.props.currentLocation.lat) {
      return this.props.currentLocation;
    }
    return defaultCenter;
  };

  onMapLoaded = map => {
    this.map = map;
  };

  shouldComponentUpdate(nextProps) {
    const {
      centerPosition,
      currentLocation,
      locations,
      panToLocation,
      selectedLocation
    } = nextProps;

    // if centerPosition changes
    if (this.hasPositionChanged(centerPosition, this.props.centerPosition)) {
      return true;
    }

    // if currentLocation changes
    if (this.hasPositionChanged(currentLocation, this.props.currentLocation)) {
      return true;
    }

    // if locations changes
    if (this.haveLocationsChanged(locations, this.props.locations)) {
      return true;
    }

    // if panToLocation changes
    if (panToLocation !== this.props.panToLocation) {
      return true;
    }

    // if panToLocation changes
    if (selectedLocation !== this.props.selectedLocation) {
      return true;
    }

    return false;
  }

  hasPositionChanged = (newPosition, oldPosition) => {
    return (
      newPosition.lat !== oldPosition.lat || newPosition.lng !== oldPosition.lng
    );
  };

  haveLocationsChanged = (newLocations, oldLocations) => {
    const newLength = newLocations.length;
    const oldLength = oldLocations.length;
    const hasLengthChanged = newLength !== oldLength;

    if (hasLengthChanged) {
      return true;
    }

    const newFirstItem = newLocations[0];
    const newLastItem = newLocations[newLength - 1];
    const oldFirstItem = oldLocations[0];
    const oldLastItem = oldLocations[oldLength - 1];
    const haveFirstAndLastItemChanged =
      newFirstItem &&
      oldFirstItem &&
      (newFirstItem.lat !== oldFirstItem.lat ||
        newFirstItem.lng !== oldFirstItem.lng ||
        newLastItem.lat !== oldLastItem.lat ||
        newLastItem.lng !== oldLastItem.lng);

    return haveFirstAndLastItemChanged;
  };

  render() {
    if (this.props.panToLocation) {
      this.map && this.map.panTo(this.props.panToLocation);
    }

    return (
      <GoogleMap
        ref={this.refMap}
        options={mapOptions}
        mapContainerStyle={{
          height: "45vh",
          width: "100%"
        }}
        onLoad={this.onMapLoaded}
        zoom={13}
        center={this.mapCenter()}
      >
        {this.props.currentLocation && this.props.currentLocation.lat ?
          <Marker position={this.props.currentLocation} icon={dotIcon} />
          : null}

        {this.props.locations &&
          this.props.locations.map((latlng, index) => {
            const markerKey = `${latlng.lat}_${latlng.lng}_${index}`;
            return (
              <Marker
                key={markerKey}
                icon={
                  this.isMarkerSelected(latlng)
                    ? markerIcon(icons.highlighted)
                    : markerIcon(icons.default)
                }
                position={latlng}
                onClick={this.markerClickHandler}
              />
            );
          })}
      </GoogleMap>
    );
  }
}

export default Map;
