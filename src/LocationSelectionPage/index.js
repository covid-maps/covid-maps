import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { getFirstComma } from "../utils";
import LocationSelector from "../LocationSelector";
import { withGlobalContext } from "../App";
import { FORM_FIELDS, STORE_CATEGORIES } from "../constants";

const emptyData = {
  [FORM_FIELDS.STORE_NAME]: "",
  [FORM_FIELDS.STORE_CATEGORY]: STORE_CATEGORIES.GROCERY, // default selection
  [FORM_FIELDS.USEFUL_INFORMATION]: "",
  [FORM_FIELDS.SAFETY_OBSERVATIONS]: "",
  Latitude: "",
  Longitude: "",
  City: "",
  Locality: "",
  [FORM_FIELDS.PLACE_ID]: "",
  [FORM_FIELDS.STORE_ADDRESS]: "",
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
    isLocationSelected: false,
    showInvalidAlert: false
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
        isLocationSelected: true,
        data: {
          ...this.state.data,
          [FORM_FIELDS.STORE_NAME]: getFirstComma(name),
          Latitude: latLng.lat,
          Longitude: latLng.lng,
          City: city,
          Locality: locality,
          [FORM_FIELDS.PLACE_ID]: place_id,
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
      return this.props.location.state.item[FORM_FIELDS.STORE_NAME];
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
      <div className="mb-5">
        <div className="p-2 text-uppercase font-weight-bold">
          <h5 className="m-0 text-center">{translations.set_store_location}</h5>
        </div>
        <LocationSelector
          activateInput
          onSearchSuccess={this.onLocationSearchCompleted}
          searchValue={this.getSearchValue()}
          ipLocation={this.props.ipLocation}
          geoLocation={this.props.geoLocation}
          height={"50vh"}
          markerPosition={
            this.state.data.Latitude
              ? {
                lat: parseFloat(this.state.data.Latitude),
                lng: parseFloat(this.state.data.Longitude),
              }
              : undefined
          }
        />
        <div className="my-3 text-center">
          <div className="my-3">
            {!this.state.isLocationSelected && this.state.showInvalidAlert ?
              <Alert variant='danger'>
                {translations.select_location_alert}
              </Alert> : null}
          </div>
          <div>
            <Link
              to={{
                pathname: "/update",
                state: {
                  item: this.state.data,
                  searchFieldValue: this.state.searchFieldValue,
                },
              }}
              onClick={e => {
                if (!this.state.isLocationSelected) {
                  this.setState({ showInvalidAlert: true })
                  e.preventDefault();
                }
              }}
            >
              <Button variant="success" className="text-uppercase">
                {translations.select_location}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withGlobalContext(LocationSelectionPage);
