import React, { useRef } from "react";
import Map from "./Map";
import LocationSearchControl from "./LocationSearch";
import Form from "react-bootstrap/Form";
import { geolocated } from "react-geolocated";
import * as api from "../api";

class MapWithSearch extends React.Component {
  state = {
    ipLocation: undefined
  };

  componentDidMount() {
    api.ip().then(response => {
      const [lat, lng] = response.loc.split(",");
      this.setState({
        // ip: response.ip,
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
    return (
      !this.props.coords ||
      !this.props.locations ||
      !this.props.locations.length
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.coords && !prevProps.coords) {
      this.props.onSuccess({
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
            onSuccess={this.props.onSuccess}
            value={this.props.value}
            currentLocation={current}
            onGeolocation={this.props.getGeolocation}
          />
        </Form>
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
