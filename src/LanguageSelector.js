import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import { withGlobalContext } from "./App";
import { AVAILABLE_LANGUAGES } from "./constants";
import { recordLanguageSelection } from "./gaEvents";

class LanguageSelector extends Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
  };

  handleLanguageSelect = language => {
    recordLanguageSelection(AVAILABLE_LANGUAGES[language]);
    this.props.setLanguage(language);
  };

  render() {
    return (
      <Dropdown className="language-selector" drop="up">
        <Dropdown.Toggle className="language-selector__toggle">
          <i className="far fa-globe"></i>&nbsp;
          {AVAILABLE_LANGUAGES[this.props.currentLanguage]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(AVAILABLE_LANGUAGES).map(key => {
            const langValue = AVAILABLE_LANGUAGES[key];
            return (
              <Dropdown.Item
                key={key}
                active={this.props.currentLanguage === key}
                onClick={() => this.handleLanguageSelect(key)}
                className="language-selector__item"
              >
                {langValue}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withGlobalContext(LanguageSelector);
