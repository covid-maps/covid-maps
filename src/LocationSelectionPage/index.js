import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { geocodeByLatlng, getAddressComponent, isFunction } from "../utils";
import MapWithSearch from "../MapWithSearch";

function getFirstComma(address) {
  const split = address ? address.split(", ") : [];
  return split.length ? split[0] : address;
}

const emptyData = {
  "Store Name": "",
  "Store Category": "Grocery", // default selection
  "Useful Information": "",
  "Safety Observations": "",
  Latitude: "",
  Longitude: "",
  City: "",
  Locality: "",
  "Place Id": "",
  Address: ""
};

class LocationSelectionPage extends React.Component {
  state = {
    currentLocationCaptured: false,
    data: { ...emptyData },
    searchFieldValue: ""
  };

  onLocationSearchCompleted = ({
    latLng,
    name,
    address,
    city,
    locality,
    place_id,
    types
  }) => {
    if ((latLng && latLng.lat) || name) {
      this.setState({
        searchFieldValue: name,
        data: {
          ...this.state.data,
          "Store Name": getFirstComma(name),
          Latitude: latLng.lat,
          Longitude: latLng.lng,
          City: city,
          Locality: locality,
          "Place Id": place_id,
          Address: address
        }
      });
    }
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !this.state.currentLocationCaptured;
  // }

  getSearchValue() {
    if (this.state.searchFieldValue) {
      // this is set from dragging the marker
      return this.state.searchFieldValue;
    }

    if (this.props.location.state) {
      // this is coming from the "Update info" from
      // the home page
      return this.props.location.state.item["Store Name"];
    }

    return "";
  }

  hasLocation() {
    return (
      this.state.data && this.state.data.Latitude && this.state.data.Longitude
    );
  }

  render() {
    return (
      <>
        <div class="m-3 text-uppercase font-weight-bold">
          <h5>Set store location to add</h5>
        </div>
        <MapWithSearch
          isMarkerShown
          activateInput
          onSuccess={this.onLocationSearchCompleted}
          value={this.getSearchValue()}
          style={{ height: "60vh" }}
          // onBoundsChanged={center => {
          //   this.setState({
          //     currentLocationCaptured: true,
          //     data: {
          //       Latitude: center.lat,
          //       Longitude: center.lng
          //     }
          //   });
          // }}
          position={
            this.state.data.Latitude
              ? {
                  lat: parseFloat(this.state.data.Latitude),
                  lng: parseFloat(this.state.data.Longitude)
                }
              : undefined
          }
          onMarkerDragged={async latLng => {
            const results = await geocodeByLatlng(latLng);
            if (results && results.length) {
              const result = results[0];
              if (isFunction(latLng.lat)) {
                latLng = { lat: latLng.lat(), lng: latLng.lng() };
              }
              this.onLocationSearchCompleted({
                latLng,
                name: result.formatted_address,
                address: result.formatted_address,
                city: getAddressComponent(
                  result.address_components,
                  "locality"
                ),
                locality: getAddressComponent(
                  result.address_components,
                  "neighborhood"
                ),
                place_id: result.place_id,
                types: result.types
              });
            }
          }}
        />

        <div className="my-3 d-flex justify-content-center">
          <Link to={{ pathname: "/update", state: { item: this.state.data } }}>
            <Button
              variant="outline-primary"
              className="text-uppercase"
              // disabled={!this.hasLocation()}
            >
              Select location
            </Button>
          </Link>
        </div>
      </>
    );
  }
}

export default LocationSelectionPage;
