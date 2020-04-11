import React from "react";
import { geocodeByLatlng, getAddressComponent, isFunction } from "../utils";
import LocationSelectorMapWithSearch from "../MapsWithSearch/LocationSelectorMap";
import { ADDRESS_COMPONENTS } from "../constants";

class LocationSelector extends React.Component {
  geocodeAndInformParent = async latLng => {
    let results;
    try {
      results = await geocodeByLatlng(latLng);
    } catch (e) {
      console.log('Geocoding failed for', latLng);
    }
    if (results && results.length) {
      const result = results[0];
      if (isFunction(latLng.lat)) {
        latLng = { lat: latLng.lat(), lng: latLng.lng() };
      }
      this.props.onSearchSuccess({
        latLng,
        name: "",
        address: result.formatted_address,
        place_id: result.place_id,
        types: result.types,
        locality: getAddressComponent(
          result.address_components,
          ADDRESS_COMPONENTS.NEIGHBORHOOD
        ),
        city: getAddressComponent(result.address_components, ADDRESS_COMPONENTS.LOCALITY),
        country: getAddressComponent(result.address_components, ADDRESS_COMPONENTS.COUNTRY)
      });
    }
  }

  render() {
    return (
      <LocationSelectorMapWithSearch
        activateInput={this.props.activateInput}
        onSearchSuccess={this.props.onSearchSuccess}
        value={this.props.searchValue}
        height={this.props.height}
        markerPosition={this.props.markerPosition}
        ipLocation={this.props.ipLocation}
        geoLocation={this.props.geoLocation}
        onGeolocationFound={this.geocodeAndInformParent}
        onMarkerDragged={this.geocodeAndInformParent}
      />
    );
  }
}

export default LocationSelector;
