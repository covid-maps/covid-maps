import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import cx from "classnames";
import debounce from "debounce";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import InputGroup from "react-bootstrap/InputGroup";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { getAddressComponent } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { recordSearchCompleted } from "../../gaEvents";
import { withGlobalContext } from "../../App";
import { ADDRESS_COMPONENTS, STORAGE_KEYS } from "../../constants";
import { withSessionStorage } from "../../withStorage";
const { SELECTED_ADDRESS } = STORAGE_KEYS;

function GeolocationButton({ isLoading, onClick }) {
  return (
    <Button onClick={onClick} variant="outline-secondary">
      {isLoading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <FontAwesomeIcon icon={faCrosshairs} />
      )}
    </Button>
  );
}

class LocationSearchInput extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    getItemFromStorage: PropTypes.func.isRequired,
    setItemToStorage: PropTypes.func.isRequired,
    removeItemFromStorage: PropTypes.func.isRequired,
    setCurrentLocation: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      address: props.value,
      isGeolocationLoading: false,
      showBoxShadowOnSearch: false,
    };
    this.textInput = React.createRef();
    this.placesAutocompleteWrapperRef = React.createRef();
    this.checkIfSearchIsSticky = debounce(
      this.checkIfSearchIsSticky.bind(this),
      200
    );
  }

  getGeolocation = () => {
    this.setState({
      isGeolocationLoading: true,
      address: "",
    });
    if (!navigator.geolocation) {
      // TODO: geolocation error handling
      this.setState({ isGeolocationLoading: false });
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.props.setCurrentLocation({ latLng: location, accuracy: "high" });
          this.setState({ isGeolocationLoading: false });
          if (this.props.onGeolocationFound) {
            this.props.onGeolocationFound(location);
          }
        },
        error => {
          console.log("error", error.message);
          this.setState({ isGeolocationLoading: false });
        }
      );
    }
  };

  handleChange = address => {
    this.setState({ address });
  };

  persistLastSelectedAddress = address => {
    this.props.setItemToStorage(SELECTED_ADDRESS, address);
  };

  handleSelect = address => {
    this.persistLastSelectedAddress(address);

    this.textInput.current.blur();
    geocodeByAddress(address)
      .then(async results => {
        this.setState({ address });
        const result = results[0];
        const latLng = await getLatLng(result);
        console.log("Success", latLng);
        recordSearchCompleted(result.types);
        this.props.onSearchSuccess({
          latLng: latLng,
          name: address,
          address: result.formatted_address,
          place_id: result.place_id,
          types: result.types,
          city: getAddressComponent(
            result.address_components,
            ADDRESS_COMPONENTS.LOCALITY
          ),
          locality: getAddressComponent(
            result.address_components,
            ADDRESS_COMPONENTS.NEIGHBORHOOD
          ),
          country: getAddressComponent(
            result.address_components,
            ADDRESS_COMPONENTS.COUNTRY,
            true
          ),
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

    this.populateLastSelectedAddress();

    window.addEventListener("scroll", this.checkIfSearchIsSticky);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll");
  }

  populateLastSelectedAddress = () => {
    const address = this.props.getItemFromStorage(SELECTED_ADDRESS);
    if (address) {
      this.handleSelect(address);
    }
  };

  clearInput() {
    this.setState({ address: "" }, this.removeLastSelectedAddress);
  }

  removeLastSelectedAddress = () => {
    this.props.removeItemFromStorage(SELECTED_ADDRESS);
  };

  checkIfSearchIsSticky = () => {
    const pageOffset = window.pageYOffset;
    const elementOffset = this.placesAutocompleteWrapperRef.current.offsetTop;
    this.setState({ showBoxShadowOnSearch: pageOffset === elementOffset });
  };

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
        debounce={750}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div
            className={cx("places-autocomplete-wrapper", {
              showBoxShadowOnSearch: this.state.showBoxShadowOnSearch,
            })}
            ref={this.placesAutocompleteWrapperRef}
          >
            <InputGroup className="location-search-group">
              <Form.Control
                {...getInputProps({
                  placeholder: this.props.translations
                    .location_search_placeholder,
                  defaultValue: this.props.defaultValue,
                  className: "location-search-input rounded-0",
                })}
                ref={this.textInput}
              />
              <InputGroup.Append>
                <GeolocationButton
                  onClick={this.getGeolocation}
                  isLoading={this.state.isGeolocationLoading}
                />
                <Button
                  className="rounded-0"
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
                      className,
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

export default withSessionStorage(withGlobalContext(LocationSearchControl));
