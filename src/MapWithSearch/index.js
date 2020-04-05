import React, { useRef } from "react";
import OriginalMap from "./Map";
import HomepageMap from "./Map/HomepageMap";
import LocationSearchControl from "./LocationSearch";
import Form from "react-bootstrap/Form";
import { geolocated } from "react-geolocated";
import * as api from "../api";

class MapWithSearch extends React.Component {
  state = {
    ipLocation: undefined,
    ipAddress: undefined
  };

  componentDidMount() {
    api.ip().then(response => {
      // response.country - CA
      // response.region - British Columbia
      // response.city - West End
      const [lat, lng] = response.loc.split(",");
      this.setState({
        ipAddress: response.ip,
        ipLocation: { lat: Number(lat), lng: Number(lng) }
      });
    });
  }

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
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.ipLocation && !prevState.ipLocation) {
      this.props.onSearchSuccess({
        latLng: this.state.ipLocation
      });
    }

    if (this.props.coords && !prevProps.coords) {
      this.props.onSearchSuccess({
        latLng: {
          lat: this.props.coords.latitude,
          lng: this.props.coords.longitude
        }
      });
    }
  }

  getCurrentLocation() {
    // First try geolocation
    if (this.props.coords) {
      return {
        lat: this.props.coords.latitude,
        lng: this.props.coords.longitude
      };
    }

    // Then fall back to IP location
    return this.state.ipLocation;
  }

  render() {
    const current = this.getCurrentLocation();
    const positionProp =
      this.props.position && this.props.position.lat
        ? this.props.position
        : current;
    return (
      <>
        <Form>
          <LocationSearchControl
            onSearchSuccess={this.props.onSearchSuccess}
            value={this.props.value}
            currentLocation={current}
            onGeolocation={this.props.getGeolocation}
            activateInput={this.props.activateInput}
          />
        </Form>
        {this.props.isMarkerShown ? (
          <OriginalMap
            style={this.props.style}
            position={positionProp}
            currentLocation={current}
            isMarkerShown={this.props.isMarkerShown}
            onBoundsChanged={this.props.onBoundsChanged}
            onMarkerDragged={this.props.onMarkerDragged}
            onPositionChanged={this.props.onPositionChanged}
          />
        ) : (
          <HomepageMap
            style={this.props.style}
            currentLocation={current}
            locations={this.props.locations}
            selectedLocation={this.props.selectedLocation}
            onMarkerSelected={this.props.onMarkerSelected}
            panToLocation={this.props.panToLocation}
            centerPosition={this.props.centerPosition}
          />
        )}
        {!this.props.isGeolocationAvailable ? (
          <div className="alert alert-danger text-center mb-0">
            Your browser does not support geolocation.
          </div>
        ) : !this.props.isGeolocationEnabled ? (
          <div className="alert alert-danger text-center mb-0">
            Geolocation is not enabled.
          </div>
        ) : null}
      </>
    );
  }
}

const MapWithSearchHOC = geolocated({
  positionOptions: {
    enableHighAccuracy: false,
    timeout: Infinity
  },
  userDecisionTimeout: 5000,
  suppressLocationOnMount: true
})(MapWithSearch);

function MapWithSearchWrapper(props) {
  const innerRef = useRef();

  const getGeolocation = () => {
    innerRef.current && innerRef.current.getLocation();
  };

  return (
    <MapWithSearchHOC
      {...props}
      ref={innerRef}
      getGeolocation={getGeolocation}
    />
  );
}

export default MapWithSearchWrapper;
