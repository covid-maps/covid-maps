import React from "react";
import Form from "react-bootstrap/Form";
import DateFnsUtils from "@date-io/date-fns";
import cx from "classnames";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "react-bootstrap/Alert";
import { format, parse, roundToNearestMinutes, isBefore } from "date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as api from "../api";
import { isMobile, titleCase } from "../utils";
import { recordFormSubmission } from "../gaEvents";
import { withGlobalContext } from "../App";
import {
  FORM_FIELDS,
  STORE_CATEGORIES,
  SUGGESTED_TAGS,
  SAFETY_OBSERVATION_CHECKS,
} from "../constants";
import { AvailabilityTags } from "./AvailabilityTags";
const {
  STORE_NAME,
  STORE_ADDRESS,
  STORE_CATEGORY,
  OPENING_TIME,
  CLOSING_TIME,
  USEFUL_INFORMATION,
  SAFETY_OBSERVATIONS,
  PLACE_ID,
  AVAILABILITY_TAGS,
  TIMESTAMP,
} = FORM_FIELDS;

const enableSafetyChecks = true;

function ButtonWithLoading({ isLoading, ...props }) {
  return isLoading ? (
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

const fieldFormatter = {
  [STORE_NAME]: val => titleCase(val),
  [STORE_ADDRESS]: val => val,
  [STORE_CATEGORY]: val => val,
  [USEFUL_INFORMATION]: val => val,
  [SAFETY_OBSERVATIONS]: val => val,
};

class SubmitForm extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isValid: true,
      data: { ...emptyData },
      showErrorNotification: false,
      tags: this.initializeTags(),
      safety_checks: SAFETY_OBSERVATION_CHECKS,
    };
  }

  toggleErrorNotification = () => {
    this.setState(prevState => {
      return {
        showErrorNotification: !prevState.showErrorNotification,
      };
    });
  };

  clearForm() {
    this.setState({
      data: { ...emptyData },
    });
  }

  onTagsChange = tagsList => {
    this.setState({ tags: tagsList });
  };

  onCheckboxToggle = event => {
    const { name, checked } = event.target;
    console.log({ name, checked });
    this.setState(prevState => {
      return {
        safety_checks: { ...prevState.safety_checks, [name]: checked },
      };
    });
  };

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
        [TIMESTAMP]: new Date().toISOString(),
        [AVAILABILITY_TAGS]: this.getTagsForSubmission(),
      };

      try {
        const response = await api.submit(data);
        console.log(data);
        console.log(response);
        recordFormSubmission();
        this.setState({ isLoading: false }, () => {
          // redirect the user to homepage and
          // keep submittd form data in state for further use
          this.props.history.push(
            `/?submittedStore=${this.getBase64OfFormData(formData)}`
          );
        });
      } catch (error) {
        console.log(error);
        this.setState({ isLoading: false, showErrorNotification: true });
      }
    } else {
      this.setState({ isValid: false, isLoading: false });
    }
  }

  getBase64OfFormData = formData => {
    return btoa(JSON.stringify(formData));
  };

  onChangeInput({ target }, dataKey) {
    this.setState({
      isValid: true,
      data: {
        ...this.state.data,
        [dataKey]: fieldFormatter[dataKey](target.value),
      },
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
        tags: this.initializeTags(selectedStoreData.tags),
        safety_checks: {
          ...this.state.safety_checks,
          ...selectedStoreData.safety_checks,
        },
        searchFieldValue: this.props.location.state.searchFieldValue,
      });
    }
  }

  initializeTags = (tags = []) => {
    // first generate a map for unchecked suggested tags
    // then loop over incoming tagsList to first check suggested tags
    // and then create entries for the custom ones
    const tagsMap = Object.keys(SUGGESTED_TAGS).reduce((acc, tagKey) => {
      acc[tagKey] = {
        name: tagKey,
        checked: false,
      };
      return acc;
    }, {});

    tags.forEach(tag => {
      const formattedTag = tag.toLowerCase().trim();
      const isSuggestedTag = SUGGESTED_TAGS[formattedTag];
      if (isSuggestedTag) {
        tagsMap[formattedTag].checked = true;
      } else {
        tagsMap[tag] = { name: tag, checked: true };
      }
    });

    return Object.keys(tagsMap).map(tagKey => tagsMap[tagKey]);
  };

  setTags = tags => {
    this.setState({ tags });
  };

  getTagsForSubmission = () => {
    return this.state.tags
      .filter(tag => tag.checked)
      .map(tag => tag.name.toLowerCase().trim());
  };

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
      data[CLOSING_TIME] ||
      Boolean(this.getTagsForSubmission().length)
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
    const { translations, location } = this.props;
    const isUpdate =
      location &&
      location.state &&
      location.state.item &&
      location.state.item.StoreId;
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.showErrorNotification}
          onClose={this.toggleErrorNotification}
        >
          <Alert
            show
            key="form-submit-error"
            variant="danger"
            onClose={this.toggleErrorNotification}
            dismissible
          >
            {translations.form_submit_error}
          </Alert>
        </Snackbar>

        <Form onSubmit={e => this.onSubmit(e)}>
          <div className="container p-3">
            <h6 className="text-uppercase font-weight-bold mb-3">
              {translations.add_update_store}
            </h6>

            <Form.Group controlId="formBasicStore">
              <Form.Label className="">
                {titleCase(translations.store_name)}
              </Form.Label>
              <Form.Control
                type="text"
                onChange={e => this.onChangeInput(e, STORE_NAME)}
                value={formData[STORE_NAME]}
                placeholder={translations.store_name_placeholder}
                required
                disabled={isUpdate}
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

            <AvailabilityTags
              tags={this.state.tags}
              setTags={this.setTags}
              translations={translations}
            />

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

            {enableSafetyChecks && (
              <Form.Group controlId="formBasicCrowdDetails">
                <Form.Label>Important Information</Form.Label>
                {Object.keys(this.state.safety_checks).map(check => {
                  return (
                    <Form.Check
                      key={check}
                      name={check}
                      id={check}
                      type="checkbox"
                      className="mb-2 user-select-none"
                      label={translations[check]}
                      checked={this.state.safety_checks[check]}
                      onChange={this.onCheckboxToggle}
                    />
                  );
                })}
              </Form.Group>
            )}

            {!enableSafetyChecks && (
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
            )}

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
