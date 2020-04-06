import React, { Component, createRef } from "react";
import { markerIcon, icons } from "../../utils";

class GoogleMap extends Component {
  googleMapRef = React.createRef();

  componentDidMount() {
    // const googleMapScript = document.createElement("script");
    // googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    // window.document.body.appendChild(googleScript);

    window.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker();
    });
  }

  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 43.642567,
        lng: -79.387054
      },
      disableDefaultUI: true
    });

  createMarker = () => {
    const marker = new window.google.maps.Marker({
      position: { lat: 43.642567, lng: -79.387054 },
      map: this.googleMap,
      clickable: true,
      draggable: true
    });
    marker.addListener("click", () => {
      this.googleMap.setZoom(8);
      this.googleMap.setCenter(marker.getPosition());
    });

    setTimeout(() => {
      marker.setIcon(markerIcon(icons.highlighted));
    }, 3000);

    return marker;
  };

  render() {
    return (
      <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: "400px", height: "300px" }}
      />
    );
  }
}

export default GoogleMap;
