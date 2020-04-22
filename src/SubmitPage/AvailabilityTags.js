import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Collapse } from "@material-ui/core";
import cx from "classnames";
import { SUGGESTED_TAGS } from "../constants";

const Tag = ({ index, onTagCheck, isChecked, label }) => {
  const onClick = onTagCheck ? () => onTagCheck(index) : undefined;
  return (
    <div
      onClick={onClick}
      className={cx(
        "tag user-select-none border mr-2 mb-2 py-1 px-2 rounded-pill text-capitalize font-weight-bold text-xs",
        {
          isChecked: isChecked,
          "border-secondary": !isChecked,
          "border-success": isChecked,
        }
      )}
    >
      {label}
    </div>
  );
};

export const ReadOnlyTags = ({ labels, translations }) => {
  if (labels) {
    return (
      <div className="availability-tags-wrapper d-flex flex-wrap ">
        {labels.map(label => {
          const correctLabel =
            label in SUGGESTED_TAGS ? translations[label] : label;
          return <Tag key={label} label={correctLabel} isChecked />;
        })}
      </div>
    );
  }
};

export class AvailabilityTags extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
      })
    ).isRequired,
    setTags: PropTypes.func.isRequired,
    translations: PropTypes.object.isRequired,
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
      name: this.state.newTag.trim(),
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
    const { tags, translations } = this.props;
    const isThereAlreadyADuplicateTag = tags.some(tag => {
      return tag.name.toLowerCase() === this.state.newTag.toLowerCase().trim();
    });
    return (
      <div className="availability-tags-wrapper mb-3">
        <div className="mb-2">{translations.available_tags_label}</div>
        <div className="d-flex flex-wrap ">
          {tags.map((tag, index) => {
            const isChecked = tag.checked;
            const label = translations[tag.name] || tag.name;
            return (
              <Tag
                key={tag.name}
                index={index}
                isChecked={isChecked}
                onTagCheck={this.onTagCheck}
                label={label}
              />
            );
          })}
          <div
            className="add-new-tag border border-secondary text-secondary text-center rounded-circle"
            onClick={this.toggleEditMode}
          >
            <i className="far fa-plus"></i>
          </div>
        </div>
        <Collapse in={this.state.editMode}>
          <div className="d-flex align-items-center mt-2">
            <Form.Control
              type="text"
              onChange={this.onNewTagValueChange}
              value={this.state.newTag}
              placeholder="food take-away"
              className="rounded-0 border-dark bg-transparent"
            />
            {isThereAlreadyADuplicateTag ? (
              <div className="text-danger ml-4 text-xs">
                {translations.duplicate_tag_error}
              </div>
            ) : (
              <Fragment>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="ml-3"
                  onClick={this.addNewTag}
                  disabled={!this.state.newTag.trim()}
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
        </Collapse>
      </div>
    );
  }
}
