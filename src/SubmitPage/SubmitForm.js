import React from "react";
import Form from "react-bootstrap/Form";
import DateFnsUtils from "@date-io/date-fns";
import cx from "classnames";
import { format, parse, roundToNearestMinutes, isBefore } from "date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as api from "../api";
import { isMobile } from "../utils";
import { recordFormSubmission } from "../gaEvents";
import { withGlobalContext } from "../App";
import { FORM_FIELDS, STORE_CATEGORIES } from "../constants";
const {
  STORE_NAME,
  STORE_ADDRESS,
  STORE_CATEGORY,
  OPENING_TIME,
  CLOSING_TIME,
  USEFUL_INFORMATION,
  SAFETY_OBSERVATIONS,
  PLACE_ID,
} = FORM_FIELDS;

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
  const zoomLevel = 14;
  return location ? (
    <img
      style={{ maxWidth: "100%" }}
      alt="Location snapshot"
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&markers=${location.lat},${location.lng}&zoom=${zoomLevel}&size=${size}&key=AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA`}
    />
  ) : null;
}

const emptyData = {
  [STORE_NAME]: "",
  [STORE_CATEGORY]: STORE_CATEGORIES.GROCERY, // default selection
  [USEFUL_INFORMATION]: "",
  [SAFETY_OBSERVATIONS]: "",
  Latitude: "",
  Longitude: "",
  City: "",
  Locality: "",
  [PLACE_ID]: "",
  [STORE_ADDRESS]: "",
  [OPENING_TIME]: null,
  [CLOSING_TIME]: null,
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

      const formData = this.state.data;

      const data = {
        ...formData,
        [OPENING_TIME]: this.convertDateObjectToTime(formData[OPENING_TIME]),
        [CLOSING_TIME]: this.convertDateObjectToTime(formData[CLOSING_TIME]),
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
    this.setState({
      isValid: true,
      data: { ...this.state.data, [dataKey]: target.value }
    });
  }

  componentDidMount() {
    if (this.props.location.state) {
      // Initial props from "Update this information"

      const selectedStoreData = this.props.location.state.item;
      this.setState({
        data: {
          ...this.state.data,
          ...selectedStoreData,
          [OPENING_TIME]: this.parseTimeAndRoundToNearestHalfHour(
            selectedStoreData[OPENING_TIME]
          ),
          [CLOSING_TIME]: this.parseTimeAndRoundToNearestHalfHour(
            selectedStoreData[CLOSING_TIME]
          ),
        },
        searchFieldValue: this.props.location.state.searchFieldValue,
      });
    }
  }

  parseTimeAndRoundToNearestHalfHour = time => {
    if (time) {
      const incomingFormat = "HH:mm";
      const dateObject = parse(time, incomingFormat, new Date());
      const roundOfDate = roundToNearestMinutes(dateObject, { nearestTo: 30 });
      return roundOfDate;
    }

    return null;
  };

  handleTimeChange = (date, key) => {
    const roundOfDate = roundToNearestMinutes(date, { nearestTo: 30 });
    this.setState({
      data: { ...this.state.data, [key]: date ? roundOfDate : null },
    });
  };

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
      data[SAFETY_OBSERVATIONS].length ||
      data[USEFUL_INFORMATION].length ||
      data[OPENING_TIME] ||
      data[CLOSING_TIME]
    );
  }

  convertDateObjectToTime = dateObject => {
    if (dateObject) {
      const timeFormat = "HH:mm";
      const time = format(dateObject, timeFormat);
      return time;
    }

    return "";
  };

  isClosingTimeInvalid = () => {
    const formData = this.state.data;
    let isClosingTimeInvalid = false;
    if (formData[OPENING_TIME]) {
      isClosingTimeInvalid = isBefore(
        formData[CLOSING_TIME],
        formData[OPENING_TIME]
      );
    }

    return isClosingTimeInvalid;
  };

  render() {
    const { translations } = this.props;
    const position = this.state.data.Latitude
      ? {
          lat: parseFloat(this.state.data.Latitude),
          lng: parseFloat(this.state.data.Longitude),
        }
      : undefined;
    const formData = this.state.data;
    const isClosingTimeInvalid = this.isClosingTimeInvalid();

    return (
      <>
        <div
          className="d-flex justify-content-center"
          style={{ maxWidth: "100%" }}
        >
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
                onChange={e => this.onChangeInput(e, STORE_NAME)}
                value={formData[STORE_NAME]}
                placeholder={translations.store_name_placeholder}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStoreAddress">
              <Form.Label className="">{translations.store_address}</Form.Label>
              <Form.Control
                type="text"
                onChange={e => this.onChangeInput(e, STORE_ADDRESS)}
                value={formData[STORE_ADDRESS]}
                placeholder={translations.store_address_placeholder}
              />
            </Form.Group>

            <Form.Group controlId="formBasicServiceType">
              <Form.Label>{translations.store_category}</Form.Label>
              <Form.Control
                as="select"
                value={formData[STORE_CATEGORY]}
                onChange={e => this.onChangeInput(e, STORE_CATEGORY)}
              >
                <option value={STORE_CATEGORIES.GROCERY}>
                  {translations.grocery}
                </option>
                <option value={STORE_CATEGORIES.RESTAURANT}>
                  {translations.restaurant}
                </option>
                <option value={STORE_CATEGORIES.ATM}>{translations.atm}</option>
                <option value={STORE_CATEGORIES.CLINIC}>
                  {translations.clinic}
                </option>
                <option value={STORE_CATEGORIES.PHARMACY}>
                  {translations.pharmacy}
                </option>
                <option value={STORE_CATEGORIES.OTHER}>
                  {translations.other}
                </option>
              </Form.Control>
            </Form.Group>

            {
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Row>
                  <Col>
                    <Form.Group controlId="formBasicOpenTimings">
                      <Form.Label>{translations.opening_time}</Form.Label>
                      <TimePicker
                        clearable
                        className="time-picker"
                        placeholder="08:00 AM"
                        minutesStep={30}
                        value={formData[OPENING_TIME]}
                        onChange={time =>
                          this.handleTimeChange(time, OPENING_TIME)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formBasicCloseTimings">
                      <Form.Label>{translations.closing_time}</Form.Label>
                      <TimePicker
                        clearable
                        className={cx("time-picker", {
                          hasError: isClosingTimeInvalid,
                        })}
                        placeholder="08:00 PM"
                        minutesStep={30}
                        value={formData[CLOSING_TIME]}
                        onChange={time =>
                          this.handleTimeChange(time, CLOSING_TIME)
                        }
                      />
                      {isClosingTimeInvalid && (
                        <p className="closing-time-error">
                          {translations.closing_time_error}
                        </p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </MuiPickersUtilsProvider>
            }

            <Form.Group controlId="formBasicCrowdDetails">
              <Form.Label>{translations.safety_observations}</Form.Label>
              <Form.Control
                as="textarea"
                rows="2"
                value={formData[SAFETY_OBSERVATIONS]}
                onChange={e => this.onChangeInput(e, SAFETY_OBSERVATIONS)}
                placeholder={translations.safety_placeholder}
              />
            </Form.Group>

            <Form.Group controlId="formBasicComments">
              <Form.Label>{translations.useful_information}</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={formData[USEFUL_INFORMATION]}
                onChange={e => this.onChangeInput(e, USEFUL_INFORMATION)}
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
              disabled={isClosingTimeInvalid || !this.state.isValid}
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
