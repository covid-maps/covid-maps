import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { getAddressComponent } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { recordSearchCompleted } from "../../gaEvents";
import { withGlobalContext } from "../../App";

class LocationSearchInput extends React.Component {
  static propTypes = {
    translations: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { address: props.value };
    this.textInput = React.createRef();
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.textInput.current.blur();
    recordSearchCompleted();
    geocodeByAddress(address)
      .then(async results => {
        this.setState({ address });
        const result = results[0];
        const latLng = await getLatLng(result);
        console.log("Success", latLng);
        this.props.onSearchSuccess({
          latLng: latLng,
          name: address,
          address: result.formatted_address,
          place_id: result.place_id,
          types: result.types,
          city: getAddressComponent(result.address_components, "locality"),
          locality: getAddressComponent(
            result.address_components,
            "neighborhood"
          ),
          country: getAddressComponent(
            result.address_components,
            "country",
            true
          )
        });
      })
      .catch(error => console.error("Error", error));
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const didValueChange = prevProps.value !== this.props.value;
    const isAddressDifferent = prevState.address !== this.props.value;
    if (didValueChange && isAddressDifferent) {
      this.setState({ address: this.props.value });
    }
  }

  componentDidMount() {
    if (this.props.activateInput) {
      this.textInput.current.focus();
    }
  }

  clearInput() {
    this.setState({ address: "" });
  }

  render() {
    const location = this.props.currentLocation
      ? new window.google.maps.LatLng(
          this.props.currentLocation.lat,
          this.props.currentLocation.lng
        )
      : undefined;
    const options = location ? { location, radius: 200000 } : undefined;
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={options}
        debounce={500}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <InputGroup className="location-search-group">
              <Form.Control
                {...getInputProps({
                  placeholder: this.props.translations
                    .location_search_placeholder,
                  defaultValue: this.props.defaultValue,
                  className: "location-search-input"
                })}
                ref={this.textInput}
              />
              <InputGroup.Append>
                <Button
                  onClick={this.props.onGeolocation}
                  variant="outline-secondary"
                >
                  <FontAwesomeIcon icon={faCrosshairs} />
                </Button>
                <Button
                  onClick={e => this.clearInput(e)}
                  variant="outline-secondary"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
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
    return <LocationSearchInput {...this.props} />;
  }
}

export default withGlobalContext(LocationSearchControl);
