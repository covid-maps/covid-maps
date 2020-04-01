import React from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { geocodeByLatlng, getAddressComponent, isFunction } from "../utils";
import MapWithSearch from "../MapWithSearch";

class LocationSelectionPage extends React.Component {
  state = { data: {} };

  onLocationSearchCompleted() {
    //
  }

  getSearchValue() {}

  render() {
    return (
      <>
        <MapWithSearch
          isMarkerShown
          onSuccess={this.onLocationSearchCompleted}
          value={this.getSearchValue()}
          style={{ height: "45vh" }}
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

        <div className="my-3">
          <Link to={{ pathname: "/update" }}>
            <Button>Select location</Button>
          </Link>
        </div>
      </>
    );
  }
}

export default LocationSelectionPage;
