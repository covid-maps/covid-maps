import React from "react";
import Map from "./Map";
import LocationSearchControl from "./LocationSearch";
import { geolocated } from "react-geolocated";

class MapWithSearch extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // To move map when search is done on homepage
    if (!this.props.position && nextProps.position) {
      return true;
    }
    if (
      this.props.position &&
      nextProps.position &&
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
        <div className="p-2">
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
          onPositionChanged={this.props.onPositionChanged}
        />
        {!this.props.coords ? (
          <div className="alert alert-danger text-center mb-0">
            {!this.props.isGeolocationAvailable ? (
              <strong className="">
                Your browser does not support geolocation.
              </strong>
            ) : !this.props.isGeolocationEnabled ? (
              <strong className="">
                <span className="text-uppercase">
                  Gelocation is not enabled.
                </span>{" "}
                <small className="d-block">
                  Please enable location sharing.
                </small>
              </strong>
            ) : this.props.coords ? null : (
              <strong className="">Getting location data!</strong>
            )}
          </div>
        ) : null}
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
