import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import cx from "classnames";

class AvailabilityTags extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    setTags: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      newTag: "",
    };
  }

  onTagCheck = tagIndex => {
    const { tags } = this.props;
    const currentTag = tags[tagIndex];
    const updatedTag = { ...currentTag, checked: !currentTag.checked };
    const updatedTagsList = [
      ...tags.slice(0, tagIndex),
      updatedTag,
      ...tags.slice(tagIndex + 1),
    ];
    this.props.setTags(updatedTagsList);
  };

  addNewTag = () => {
    const newTagObject = {
      tagName: this.state.newTag.trim(),
      checked: true,
    };

    const updatedTagsList = [...this.props.tags, newTagObject];
    this.props.setTags(updatedTagsList);
    this.toggleEditMode();
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
    const { tags } = this.props;
    const isThereAlreadyADuplicateTag = tags.some(tag => {
      return (
        tag.tagName.toLowerCase() === this.state.newTag.toLowerCase().trim()
      );
    });
    return (
      <div className="availability-tags-wrapper mb-4">
        <div className="d-flex flex-wrap ">
          {tags.map((tag, index) => {
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
