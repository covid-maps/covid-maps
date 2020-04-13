import React from "react";
import PropTypes from "prop-types";
import Alert from "react-bootstrap/Alert";
import { ALERTS_TYPE } from "../constants";
import Snackbar from "@material-ui/core/Snackbar";
import ShareButton from "../ShareButton";

const HomepageAlerts = props => {
  const { translations } = props;

  switch (this.state.alertType) {
    case ALERTS_TYPE.WEBSITE_PURPOSE:
      return (
        <Alert
          key="no-of-users"
          className="card no-of-users-alert"
          variant="primary"
          show={this.state.showAlert}
          onClose={this.toggleAlert}
          dismissible
        >
          {translations.website_purpose_banner}
        </Alert>
      );
    case ALERTS_TYPE.FORM_SUBMIT_SUCESS:
      return (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.showAlert}
          onClose={this.toggleAlert}
        >
          <Alert
            className="mb-0"
            show={this.state.showAlert}
            key="form-submit-success"
            variant="success"
            onClose={this.toggleAlert}
            dismissible
          >
            {translations.form_submit_success}
            <ShareButton
              className="d-block mt-2"
              variant="success"
              size="sm"
              title="Covid Maps"
              url="https://covidmaps.in/"
              text={translations.website_share_description}
            >
              {translations.share_app}
            </ShareButton>
          </Alert>
        </Snackbar>
      );
    default:
      return null;
  }
};

HomepageAlerts.propTypes = {
  translations: PropTypes.object.isRequired,
  showAlert: PropTypes.bool.isRequired,
  toggleAlert: PropTypes.func.isRequired,
};

export default HomepageAlerts;
