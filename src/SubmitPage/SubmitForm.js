import React from "react";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as api from "../api";
import { isMobile } from "../utils";
import { recordFormSubmission } from "../gaEvents";
import { withGlobalContext } from "../App";

function ButtonWithLoading(props) {
  return props.isLoading ? (
    <Button {...props} disabled>
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

function MapImage({ location }) {
  const size = isMobile() ? `400x250` : `600x350`;
  return location ?
    <img
      style={{ maxWidth: "100%" }}
      alt="Location snapshot"
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&markers=${location.lat},${location.lng}&zoom=15&size=${size}&key=AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA`} />
    : null;
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
  Address: "",
  "Opening Time": "",
  "Closing Time": "",
  Country: "",
};

class SubmitForm extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
  };

  state = {
    isLoading: false,
    isValid: true,
    hasSubmitted: false,
    data: { ...emptyData },
  };

  clearForm() {
    this.setState({
      data: { ...emptyData },
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    if (this.canBeSubmitted()) {
      this.setState({ isLoading: true, isValid: true });
      console.log("Logging: ", this.state.data);
      const data = {
        ...this.state.data,
        Timestamp: new Date().toISOString(),
      };
      const response = await api.submit(data);
      console.log(data);
      console.log(response);
      recordFormSubmission();
      this.setState({ isLoading: false, hasSubmitted: true }, () => {
        window.scrollTo(0, 0);
        this.clearForm();
      });
    } else {
      this.setState({ isValid: false, isLoading: false });
    }
  }

  onChangeInput({ target }, dataKey) {
    this.setState({ data: { ...this.state.data, [dataKey]: target.value } });
  }

  componentDidMount() {
    if (this.props.location.state) {
      // Initial props from "Update this information"
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.location.state.item,
        },
        searchFieldValue: this.props.location.state.searchFieldValue,
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

  canBeSubmitted() {
    const data = this.state.data;
    return (
      data["Safety Observations"].length ||
      data["Useful Information"].length ||
      data["Opening Time"].length ||
      data["Closing Time"].length
    );
  }

  render() {
    const { translations } = this.props;
    const position = this.state.data.Latitude ? {
      lat: parseFloat(this.state.data.Latitude),
      lng: parseFloat(this.state.data.Longitude),
    } : undefined;

    return (
      <>
        <div className='d-flex justify-content-center' style={{ maxWidth: '100%' }}>
          <MapImage location={position} />
        </div>

        {this.state.hasSubmitted ? (
          <div className="alert alert-success text-center mb-0">
            <span>Submitted successfully, thank you!</span>
          </div>
        ) : null}

        <Form onSubmit={e => this.onSubmit(e)}>
          <div className="container p-3">
            <h6 className="text-uppercase font-weight-bold mb-3">
              {translations.add_update_store}
            </h6>
            <Form.Group controlId="formBasicStore">
              <Form.Label className="">{translations.store_name}</Form.Label>
              <Form.Control
                type="text"
                onChange={e => this.onChangeInput(e, "Store Name")}
                value={this.state.data["Store Name"]}
                placeholder={translations.store_name_placeholder}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicServiceType">
              <Form.Label>{translations.store_category}</Form.Label>
              <Form.Control
                as="select"
                value={this.state.data["Store Category"]}
                onChange={e => this.onChangeInput(e, "Store Category")}
              >
                <option>{translations.grocery}</option>
                <option>{translations.restaurant}</option>
                <option>{translations.atm}</option>
                <option>{translations.clinic}</option>
                <option>{translations.pharmacy}</option>
                <option>{translations.other}</option>
              </Form.Control>
            </Form.Group>

            {
              <Row>
                <Col>
                  <Form.Group controlId="formBasicOpenTimings">
                    <Form.Label>{translations.opening_time}</Form.Label>
                    <Form.Control
                      size="sm"
                      type="time"
                      step="1800"
                      placeholder="Open time"
                      value={this.state.data["Opening Time"]}
                      onChange={e => this.onChangeInput(e, "Opening Time")}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formBasicCloseTimings">
                    <Form.Label>{translations.closing_time}</Form.Label>
                    <Form.Control
                      size="sm"
                      type="time"
                      step="1800"
                      placeholder="Close time"
                      value={this.state.data["Closing Time"]}
                      onChange={e => this.onChangeInput(e, "Closing Time")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            }

            <Form.Group controlId="formBasicCrowdDetails">
              <Form.Label>{translations.safety_observations}</Form.Label>
              <Form.Control
                as="textarea"
                rows="2"
                value={this.state.data["Safety Observations"]}
                onChange={e => this.onChangeInput(e, "Safety Observations")}
                placeholder={translations.safety_placeholder}
              />
            </Form.Group>

            <Form.Group controlId="formBasicComments">
              <Form.Label>{translations.useful_information}</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={this.state.data["Useful Information"]}
                onChange={e => this.onChangeInput(e, "Useful Information")}
                placeholder={translations.useful_placeholder}
              />
            </Form.Group>

            {!this.state.isValid ? (
              <div className="alert alert-danger text-center">
                <span>{translations.insufficient_form_data_error}</span>
              </div>
            ) : null}

            <ButtonWithLoading
              isLoading={this.state.isLoading}
              variant="success"
              type="submit"
              className="btn-block text-uppercase font-weight-bold"
            >
              {translations.submit_update}
            </ButtonWithLoading>
          </div>
        </Form>
      </>
    );
  }
}

export default withGlobalContext(SubmitForm);
