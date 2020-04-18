import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import cx from "classnames";

class AvailabilityTags extends Component {
  static propTypes = {
    onChangeCallback: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      tags: [
        { tagName: "medicines", checked: false, translationKey: "medicines" },
        { tagName: "groceries", checked: false, translationKey: "groceries" },
        { tagName: "vegetables", checked: false, translationKey: "vegetables" },
        {
          tagName: "meat_and_dairy",
          checked: false,
          translationKey: "meat_and_dairy",
        },
        {
          tagName: "personal_and_homecare",
          checked: false,
          translationKey: "personal_and_homecare",
        },
      ],
      editMode: false,
      newTag: "",
    };
  }

  onTagCheck = tagIndex => {
    this.setState(
      prevState => {
        const currentTag = prevState.tags[tagIndex];
        const updatedTag = { ...currentTag, checked: !currentTag.checked };
        const updatedTagsList = [
          ...prevState.tags.slice(0, tagIndex),
          updatedTag,
          ...prevState.tags.slice(tagIndex + 1),
        ];
        return {
          tags: updatedTagsList,
        };
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.getCheckedTagKeys());
        }
      }
    );
  };

  addNewTag = () => {
    const newTagObject = {
      tagName: this.state.newTag.trim(),
      checked: true,
    };

    const updatedTagsList = [...this.state.tags, newTagObject];
    this.setState({ tags: updatedTagsList }, this.toggleEditMode);
  };

  onNewTagValueChange = e => {
    this.setState({ newTag: e.target.value });
  };

  toggleEditMode = () => {
    this.setState(prevState => {
      return { editMode: !prevState.editMode, newTag: "" };
    });
  };

  getCheckedTagKeys = () => {
    return this.state.tags.filter(tag => tag.checked).map(tag => tag.tagName);
  };

  render() {
    const isThereAlreadyADuplicateTag = this.state.tags.some(tag => {
      return (
        tag.tagName.toLowerCase() === this.state.newTag.toLowerCase().trim()
      );
    });
    return (
      <div className="availability-tags-wrapper mb-4">
        <div className="d-flex flex-wrap ">
          {this.state.tags.map((tag, index) => {
            const isChecked = tag.checked;
            return (
              <div
                key={tag.tagName}
                onClick={() => this.onTagCheck(index)}
                className={cx(
                  "tag border mr-2 mb-2 py-1 px-2 rounded-pill text-capitalize font-weight-bold text-xs",
                  {
                    isChecked: isChecked,
                    "border-secondary": !isChecked,
                    "border-success": isChecked,
                  }
                )}
              >
                {tag.tagName}
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
          <div className="d-flex align-items-center mt-2">
            <Form.Control
              type="text"
              onChange={this.onNewTagValueChange}
              value={this.state.newTag}
              placeholder="food take-away"
              className="rounded-0 border-dark bg-transparent text-sm"
            />
            {isThereAlreadyADuplicateTag ? (
              <div className="text-danger ml-4 text-xs">
                Oops, this tag already exists
              </div>
            ) : (
              <Fragment>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="ml-3"
                  onClick={this.addNewTag}
                >
                  Add
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ml-3"
                  onClick={this.toggleEditMode}
                >
                  Cancel
                </Button>
              </Fragment>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default AvailabilityTags;
