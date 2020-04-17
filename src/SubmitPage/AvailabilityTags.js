import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import cx from "classnames";

class AvailabilityTags extends Component {
  static propTypes = {
    onChangeCallback: PropTypes.func,
    sendCheckedTags: PropTypes.func,
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
      editMode: false,
      newTag: "",
    };
  }

  onTagCheck = tagKey => {
    this.setState(
      prevState => {
        return {
          tags: {
            ...prevState.tags,
            [tagKey]: !prevState.tags[tagKey],
          },
        };
      },
      () => {
        if (this.props.sendCheckedTags) {
          const checkedTags = Object.keys(this.state.tags).filter(tag => {
            return this.state.tags[tag];
          });
          this.props.sendCheckedTags(checkedTags);
        }
      }
    );
  };

  onNewTagValueChange = e => {
    this.setState({ newTag: e.target.value });
  };

  toggleEditMode = () => {
    this.setState(prevState => {
      return { editMode: !prevState.editMode, newTag: "" };
    });
  };

  render() {
    return (
      <div className="availability-tags-wrapper">
        <div className="d-flex flex-wrap ">
          {Object.keys(this.state.tags).map(tag => {
            const isCurrentChecked = this.state.tags[tag];
            return (
              <div
                key={tag}
                onClick={() => this.onTagCheck(tag)}
                className={cx(
                  "tag border mr-2 mb-2 py-1 px-2 rounded-pill text-capitalize font-weight-bold text-xs",
                  {
                    isChecked: isCurrentChecked,
                    "border-secondary": !isCurrentChecked,
                    "border-success": isCurrentChecked,
                  }
                )}
              >
                {tag}
              </div>
            );
          })}
          <div
            className="add-new-tag border border-secondary text-secondary text-center rounded-circle"
            onClick={this.toggleEditMode}
          >
            <i className="far fa-plus"></i>
          </div>
        </div>
        {this.state.editMode && (
          <div className="d-flex align-items-center justify-content-between">
            <Form.Control
              type="text"
              onChange={this.onNewTagValueChange}
              value={this.state.newTag}
              placeholder="Add new tag"
            />
            <i className="far fa-check"></i>
            <i className="far fa-times"></i>
          </div>
        )}
      </div>
    );
  }
}

export default AvailabilityTags;
