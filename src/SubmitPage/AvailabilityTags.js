import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

class AvailabilityTags extends Component {
  static propTypes = {
    onChangeCallback: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      tags: {
        medecines: false,
        groceries: false,
        vegetables: false,
        meat_and_dairy: false,
        personal_and_homecare: false,
      },
    };
  }

  onTagCheck = tagKey => {
    this.setState(prevState => {
      return {
        tags: {
          ...prevState.tags,
          [tagKey]: !prevState.tags[tagKey],
        },
      };
    });
  };

  render() {
    return (
      <div className="d-flex flex-wrap">
        {Object.keys(this.state.tags).map(tag => {
          return (
            <div
              key={tag}
              onClick={() => this.onTagCheck(tag)}
              className={cx(
                "availability_tag border border-secondary mr-2 mb-2 py-1 px-2 rounded-pill text-capitalize text-xs",
                {
                  isChecked: this.state.tags[tag],
                }
              )}
            >
              {tag}
            </div>
          );
        })}
      </div>
    );
  }
}

export default AvailabilityTags;
