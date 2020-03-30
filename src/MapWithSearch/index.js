import React from "react";
import Map from "./Map";
import LocationSearchControl from "./LocationSearch";
import { geolocated } from "react-geolocated";

function Status(props) {
  return (
    <div>
      <small>{props.children}</small>
    </div>
  );
}

class MapWithSearch extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // To move map when search is done on homepage
    if (!this.props.position && nextProps.position) {
      return true;
    }
    if (
      this.props.position &&
      this.props.position.lat !== nextProps.position.lat
    ) {
      return true;
    }
    return (
      !this.props.coords ||
      !this.props.locations ||
      !this.props.locations.length
    );
  }

  render() {
    const current = this.props.coords
      ? { lat: this.props.coords.latitude, lng: this.props.coords.longitude }
      : undefined;
    const positionProp =
      this.props.position && this.props.position.lat
        ? this.props.position
        : current;
    return (
      <>
        <div className="container">
          <LocationSearchControl
            onSuccess={this.props.onSuccess}
            value={this.props.value}
            currentLocation={current}
          />
        </div>
        <Map
          style={this.props.style}
          position={positionProp}
          currentLocation={current}
          locations={this.props.locations}
          isMarkerShown={this.props.isMarkerShown}
          onBoundsChanged={this.props.onBoundsChanged}
          onMarkerDragged={this.props.onMarkerDragged}
        />
        {!this.props.isGeolocationAvailable ? (
          <Status>Your browser does not support Geolocation</Status>
        ) : !this.props.isGeolocationEnabled ? (
          <Status>Geolocation is not enabled</Status>
        ) : this.props.coords ? (
          <Status>
            {/* lat {this.props.coords.latitude}, lng {this.props.coords.longitude} */}
          </Status>
        ) : (
          <Status>Getting the location data</Status>
        )}
      </>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
    timeout: Infinity
  },
  userDecisionTimeout: 5000
})(MapWithSearch);
