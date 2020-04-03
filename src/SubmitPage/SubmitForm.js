import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as api from "../api";
import {
  geocodeByLatlng,
  getAddressComponent,
  isFunction,
  getFirstComma
} from "../utils";
import { recordFormSubmission } from "../gaEvents";
import MapWithSearch from "../MapWithSearch";

function ButtonWithLoading(props) {
  return props.isLoading ? (
    <Button variant="primary" disabled>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />{" "}
      Submitting...
    </Button>
  ) : (
    <Button {...props} />
  );
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

class SubmitForm extends React.Component {
  state = {
    isLoading: false,
    hasSubmitted: false,
    ipData: undefined,
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
    // This checks for latlng and name, so that
    // we don't inadvertently overwrite teh state in the case
    // of a current location update in onSuccess.
    if (latLng && latLng.lat && name) {
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

  clearForm() {
    this.setState({
      data: { ...emptyData },
      searchFieldValue: ""
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      ...this.state.data,
      Timestamp: new Date().toISOString()
    };

    // Get IP if possible
    let ipData = this.state.ipData;
    if (!this.state.ipData) {
      ipData = await api.ip();
    }
    if (ipData && ipData.ip) {
      data["User IP"] = ipData.ip;
    }

    const response = await api.submit(data);
    console.log(response);
    recordFormSubmission();
    this.setState({ isLoading: false, hasSubmitted: true, ipData }, () => {
      window.scrollTo(0, 0);
      this.clearForm();
    });
  }

  onChangeInput({ target }, dataKey) {
    this.setState({ data: { ...this.state.data, [dataKey]: target.value } });
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log("change", this.state.data, prevState.data);
  // }

  componentDidMount() {
    if (this.props.location.state) {
      // Initial props from "Update this information"
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.location.state.item
        }
      });
    }
  }

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

        {this.state.hasSubmitted ? (
          <div className="alert alert-success text-center mb-0">
            <span>Submitted successfully, thank you!</span>
          </div>
        ) : null}

        <Form onSubmit={e => this.onSubmit(e)}>
          <div className="container p-3">
            <h6 className="text-uppercase font-weight-bold mb-3">
              Update Store Status
            </h6>
            <Form.Group controlId="formBasicStore">
              <Form.Label className="">Store Name (required)</Form.Label>
              <Form.Control
                type="text"
                onChange={e => this.onChangeInput(e, "Store Name")}
                value={this.state.data["Store Name"]}
                placeholder="e.g. Target or Nature's Basket"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicServiceType">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.onChangeInput(e, "Store Category")}
              >
                <option>Grocery</option>
                <option>Restaurant</option>
                <option>ATM</option>
                <option>Clinic</option>
                <option>Pharmacy</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="formBasicOpenTimings">
                  <Form.Label>Opening Time</Form.Label>
                  <Form.Control size="sm" type="time" step="1800" placeholder="Open time" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicCloseTimings">
                  <Form.Label>Closing Time</Form.Label>
                  <Form.Control size="sm" type="time" step="1800" placeholder="Close time" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formBasicCrowdDetails">
              <Form.Label>Safety Observations</Form.Label>
              <Form.Control
                as="textarea"
                rows="2"
                value={this.state.data["Safety Observations"]}
                onChange={e => this.onChangeInput(e, "Safety Observations")}
                placeholder="Queues, crowd level &amp; safety precautions"
              />
            </Form.Group>

            <Form.Group controlId="formBasicComments">
              <Form.Label>Useful Information</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={this.state.data["Useful Information"]}
                onChange={e => this.onChangeInput(e, "Useful Information")}
                placeholder="Timings, stock availability, etc."
                required
              />
            </Form.Group>

            <ButtonWithLoading
              isLoading={this.state.isLoading}
              variant="success"
              type="submit"
              className="btn-block text-uppercase font-weight-bold"
            >
              Submit update
            </ButtonWithLoading>
          </div>
        </Form>
      </>
    );
  }
}

export default SubmitForm;
