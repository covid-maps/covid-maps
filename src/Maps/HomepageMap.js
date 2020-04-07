import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { dotIcon, markerIcon, icons, isSameLocation } from "../utils";
import { mapOptions } from "./theme";

const defaultCenter = { lat: 49.281376, lng: -123.111382 };

class Map extends Component {
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
    return (
      this.props.centerPosition || this.props.currentLocation || defaultCenter
    );
  };

  onMapLoaded = map => {
    this.map = map;
  };

  render() {
    if (this.props.panToLocation) {
      this.map && this.map.panTo(this.props.panToLocation);
    }

    return (
      <GoogleMap
        ref={this.refMap}
        id="example-map"
        options={mapOptions}
        mapContainerStyle={{
          height: "45vh",
          width: "100%"
        }}
        onLoad={this.onMapLoaded}
        zoom={13}
        center={this.mapCenter()}
      >
        <Marker position={this.props.currentLocation} icon={dotIcon} />

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
