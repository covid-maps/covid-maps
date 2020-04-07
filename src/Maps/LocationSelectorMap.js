import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { dotIcon, markerIcon, icons, isSameLocation } from "../utils";
import { mapOptions } from "./theme";

const defaultCenter = { lat: 40.281376, lng: -123.111382 };

class Map extends Component {
  map = undefined;

  state = {
    markerPosition: this.props.position,
    isLoaded: false
  };

  mapCenter = () => {
    return this.props.position || this.props.currentLocation || defaultCenter;
  };

  onMapLoaded = map => {
    this.map = map;
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 1000);
  };

  onBoundsChanged = () => {
    if (this.map && this.state.isLoaded) {
      const mapCenter = this.map.getCenter();
      const position = { lat: mapCenter.lat(), lng: mapCenter.lng() }
      this.setState({ markerPosition: position });
      if (this.props.onBoundsChanged) {
        this.props.onBoundsChanged({
          lat: mapCenter.lat(),
          lng: mapCenter.lng()
        });
      }
    }
  };

  onDragEnd = () => {
    if (this.map) {
      const mapCenter = this.map.getCenter();
      this.props.onMarkerDragged && this.props.onMarkerDragged(mapCenter);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isSameLocation(this.props.position, prevProps.position)) {
      this.setState({ markerPosition: this.props.position });
      this.map && this.map.panTo(this.props.position);
    }
  }

  render() {
    return (
      <GoogleMap
        id="example-map"
        options={mapOptions}
        mapContainerStyle={{
          height: this.props.height,
          width: "100%"
        }}
        onLoad={this.onMapLoaded}
        zoom={16}
        center={this.mapCenter()}
        onBoundsChanged={this.onBoundsChanged}
        onDragEnd={this.onDragEnd}
      >
        {this.props.currentLocation ?
          <Marker position={this.props.currentLocation} icon={dotIcon} />
          : null}
        {this.state.markerPosition ?
          <Marker
            draggable={!!this.props.onMarkerDragged}
            position={this.state.markerPosition}
            icon={markerIcon(icons.default)}
            zIndex={10}
            onDragEnd={event =>
              this.props.onMarkerDragged &&
              this.props.onMarkerDragged({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              })
            }
          /> : null}
      </GoogleMap>
    );
  }
}

export default Map;
