import React from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    centerPosition: undefined
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <Map
        containerStyle={{
          position: "relative",
          width: this.props.width,
          height: this.props.height
        }}
        center={this.props.position}
        google={this.props.google}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onClick={this.onMapClicked}
      >
        <Marker
          position={this.props.position}
          onClick={this.onMarkerClick}
          name={"Current location"}
        />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA";

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer);
