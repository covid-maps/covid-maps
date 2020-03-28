import React from "react";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

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
        return getLatLng(results[0]);
      })
      .then(latLng => {
        console.log("Success", latLng);
        this.props.onSuccess({ position: latLng, name: address });
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
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
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
        <Form.Label>Location</Form.Label>
        {/* <Form.Control
          type="text"
          placeholder="Search by store name, address or landmark"
        /> */}
        <LocationSearchInput {...this.props} />
      </>
    );
  }
}

export default LocationSearchControl;
