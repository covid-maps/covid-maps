import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { dotIcon, markerIcon, icons, isSameLocation } from "../utils";
import { mapOptions } from "./theme";

// Final fallback to a location in Bangalore
const defaultCenter = { lat: 12.95396, lng: 77.4908577 };

class Map extends Component {
  map = undefined;

  state = {
    markerPosition: this.props.markerPosition,
  };

  mapCenter = () => {
    return this.props.markerPosition || this.props.geoLocation || this.props.ipLocation || defaultCenter;
  };

  onMapLoaded = map => {
    this.map = map;
  };

  onDrag = () => {
    if (this.map) {
      const mapCenter = this.map.getCenter();
      const center = { lat: mapCenter.lat(), lng: mapCenter.lng() }
      this.setState({ markerPosition: center });
    }
  };

  onDragEnd = () => {
    if (this.map) {
      const mapCenter = this.map.getCenter();
      this.props.onMarkerDragged && this.props.onMarkerDragged(mapCenter);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isSameLocation(this.props.markerPosition, prevProps.markerPosition)) {
      this.setState({ markerPosition: this.props.markerPosition });
      this.map && this.map.panTo(this.props.markerPosition);
    }
  }

  render() {
    const center = this.mapCenter();
    return (
      <GoogleMap
        options={mapOptions}
        mapContainerStyle={{
          height: this.props.height,
          width: "100%"
        }}
        onLoad={this.onMapLoaded}
        zoom={16}
        center={center}
        onDrag={this.onDrag}
        onDragEnd={this.onDragEnd}
      >
        {this.props.geoLocation ?
          <Marker zIndex={100} position={this.props.geoLocation} icon={dotIcon} />
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
