import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { getFirstComma } from "../utils";
import LocationSelector from "../LocationSelector";

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
  Address: "",
  Country: ""
};

class LocationSelectionPage extends React.Component {
  state = {
    currentLocationCaptured: false,
    data: { ...emptyData },
    searchFieldValue: ""
  };

  onLocationSearchCompleted = result => {
    const {
      latLng,
      name,
      address,
      city,
      locality,
      place_id,
      country,
      // types
    } = result;
    if ((latLng && latLng.lat) || name) {
      this.setState({
        searchFieldValue: address,
        data: {
          ...this.state.data,
          "Store Name": getFirstComma(name),
          Latitude: latLng.lat,
          Longitude: latLng.lng,
          City: city,
          Locality: locality,
          "Place Id": place_id,
          Address: address,
          Country: country
        }
      });
    }
  };

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
        <div className="p-2 text-uppercase font-weight-bold">
          <h5 className="m-0">Set store location to add</h5>
        </div>
        <LocationSelector
          activateInput
          onSearchSuccess={this.onLocationSearchCompleted}
          searchValue={this.getSearchValue()}
          height={"50vh"}
          position={
            this.state.data.Latitude
              ? {
                lat: parseFloat(this.state.data.Latitude),
                lng: parseFloat(this.state.data.Longitude)
              }
              : undefined
          }
        />
        <div className="my-3 d-flex justify-content-center">
          <Link to={{ pathname: "/update", state: { item: this.state.data, searchFieldValue: this.state.searchFieldValue } }}>
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
