import React from "react";
import Form from "react-bootstrap/Form";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

function getAddressComponent(addressComponents, component) {
  const filtered = addressComponents
    .filter(c => c.types.find(t => t === component))
    .map(c => c.long_name);
  return filtered.length ? filtered[0] : "";
}

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        console.log(address);
        this.setState({ address });
        console.log(results);
        const result = results[0];
        return getLatLng(result).then(latLng => {
          console.log("Success", latLng);
          this.props.onSuccess({
            latLng: latLng,
            name: address,
            address: result.formatted_address,
            place_id: result.place_id,
            types: result.types,
            city: getAddressComponent(result.address_components, "locality"),
            locality: getAddressComponent(
              result.address_components,
              "neighborhood"
            )
          });
        });
      })
      .catch(error => console.error("Error", error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={
          {
            // Use this to bias the search results to current location
            // location: new google.maps.LatLng(-34, 151)
          }
        }
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Form.Control
              {...getInputProps({
                placeholder: "Search by store name, address or landmark",
                className: "location-search-input"
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

class LocationSearchControl extends React.Component {
  render() {
    return (
      <>
        {/* <Form.Label>Location</Form.Label> */}
        <LocationSearchInput {...this.props} />
      </>
    );
  }
}

export default LocationSearchControl;
