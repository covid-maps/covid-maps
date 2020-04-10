import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { getFirstComma } from "../utils";
import LocationSelector from "../LocationSelector";
import { withGlobalContext } from "../App";

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
  Country: "",
};

class LocationSelectionPage extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    ipLocation: PropTypes.object,
    geoLocation: PropTypes.object
  };

  state = {
    data: { ...emptyData },
    searchFieldValue: "",
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
          Country: country,
        },
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
    const { translations } = this.props;
    return (
      <>
        <div className="p-2 text-uppercase font-weight-bold">
          <h5 className="m-0">{translations.set_store_location}</h5>
        </div>
        <LocationSelector
          activateInput
          onSearchSuccess={this.onLocationSearchCompleted}
          searchValue={this.getSearchValue()}
          currentLocation={this.props.geoLocation || this.props.ipLocation}
          onGeolocationClicked={() => {
            this.setState({
              data: { ...emptyData },
              searchFieldValue: ""
            })
          }}
          height={"50vh"}
          position={
            this.state.data.Latitude
              ? {
                lat: parseFloat(this.state.data.Latitude),
                lng: parseFloat(this.state.data.Longitude),
              }
              : undefined
          }
        />
        <div className="my-3 d-flex justify-content-center">
          <Link
            to={{
              pathname: "/update",
              state: {
                item: this.state.data,
                searchFieldValue: this.state.searchFieldValue,
              },
            }}
          >
            <Button variant="outline-success" className="text-uppercase">
              {translations.select_location}
            </Button>
          </Link>
        </div>
      </>
    );
  }
}

export default withGlobalContext(LocationSelectionPage);
