import React from "react";
import Map from "../Map";
import LocationSearchControl from "./LocationSearch";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import * as api from "../api";

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

class SubmitForm extends React.Component {
  state = {
    isLoading: false,
    hasSubmitted: false,
    position: undefined
  };

  onLocationSearchCompleted = ({ position, name }) => {
    this.setState({ position });
  };

  onSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const elements = event.target.elements;
    const data = {
      Timestamp: new Date().toISOString(),
      "Store Name": elements.formBasicStore.value,
      "Store Category": elements.formBasicServiceType.value,
      "Useful Information": elements.formBasicComments.value,
      "Safety Observation": elements.formBasicCrowdDetails,
      "Place Id": "",
      Latitude: "",
      Longitude: "",
      City: "",
      Locality: "",
      Address: ""
    };
    api.submit(data).then(response => {
      console.log(response);
      this.setState({ isLoading: false, hasSubmitted: true });
    });
  }

  render() {
    return (
      <Form onSubmit={e => this.onSubmit(e)}>
        <div className="container">
          <Form.Group controlId="formBasicLocation">
            <LocationSearchControl
              text={"text"}
              onSuccess={this.onLocationSearchCompleted}
            />
          </Form.Group>
        </div>

        <Map style={{ height: 200 }} position={this.state.position} />

        <div className="container">
          <Form.Group controlId="formBasicStore">
            <Form.Label>Store Name</Form.Label>
            <Form.Control type="text" placeholder="Enter store name" required />
          </Form.Group>

          <Form.Group controlId="formBasicServiceType">
            <Form.Label>Service Type</Form.Label>
            <Form.Control as="select">
              <option>Grocery</option>
              <option>Restaurant</option>
              <option>ATM</option>
              <option>Clinic</option>
              <option>Pharmacy</option>
              <option>Other</option>
            </Form.Control>
          </Form.Group>

          {/*}
          <Form.Row>
            <Col>
              <Form.Group controlId="formBasicOpenTimings">
                <Form.Label>Opening Time</Form.Label>
                <Form.Control
                  type="text"
                  id="time"
                  data-format="HH:mm"
                  data-template="HH : mm"
                  name="datetime"
                  placeholder="Open time"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formBasicCloseTimings">
                <Form.Label>Closing Time</Form.Label>
                <Form.Control type="time" placeholder="Closing time" />
              </Form.Group>
            </Col>
          </Form.Row>
            */}

          <Form.Group controlId="formBasicCrowdDetails">
            <Form.Label>Safety Observations</Form.Label>
            <Form.Control
              as="textarea"
              rows = "2"
              placeholder="Queues, crowd level &amp; safety precautions"
            />
          </Form.Group>

          <Form.Group controlId="formBasicComments">
            <Form.Label>Useful Information</Form.Label>
            <Form.Control
              as="textarea"
              rows = "3"
              placeholder="Contact number, timing, stock availability, etc."
            />
          </Form.Group>

          {this.state.hasSubmitted ? (
            <Alert variant="success">Submitted!</Alert>
          ) : null}

          <ButtonWithLoading
            isLoading={this.state.isLoading}
            variant="primary"
            type="submit"
          >
            Submit
          </ButtonWithLoading>
        </div>
      </Form>
    );
  }
}

export default SubmitForm;
