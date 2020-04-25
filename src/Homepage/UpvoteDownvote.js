import React, { Component } from "react";
import PropTypes from "prop-types";
import { withLocalStorage } from "../withStorage";
import cx from "classnames";
import { FORM_FIELDS, VOTE } from "../constants";
const { UP, DOWN } = VOTE;

class UpvoteDownvote extends Component {
  static propTypes = {
    getItemFromStorage: PropTypes.func.isRequired,
    setItemToStorage: PropTypes.func.isRequired,
    entry: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const voteKey = this.getVoteKey(props.entry);

    this.state = {
      voteKey,
      voteValue: props.getItemFromStorage(voteKey),
    };

    this.getVoteKey = this.getVoteKey.bind(this);
    this.handleVote = this.handleVote.bind(this);
  }

  getVoteKey(entry) {
    return `vote_${entry[FORM_FIELDS.STORE_ID]}_${
      entry[FORM_FIELDS.TIMESTAMP]
    }`;
  }

  handleVote(event, newVoteValue) {
    event.stopPropagation();

    // update local state
    // update local storage
    // make api call

    if (newVoteValue !== this.state.voteValue) {
      this.setState({ voteValue: newVoteValue }, () => {
        this.props.setItemToStorage(this.state.voteKey, newVoteValue);
      });

      // then make api call
    }
  }

  render() {
    const isUp = this.state.voteValue === UP;
    const isDown = this.state.voteValue === DOWN;

    return (
      <div className="d-flex align-items-center mt-4">
        <span className="mr-2">Is this information correct?</span>
        <button
          className={cx("mr-2 rounded-pill text-xs px-2 border outline-none", {
            "border-success text-success font-weight-bold": isUp,
            "bg-white": !isUp,
          })}
          onClick={e => this.handleVote(e, UP)}
        >
          <span className="mr-2">Yes</span>
          <span role="img" aria-label="thumbs up">
            👍
          </span>
        </button>
        <button
          className={cx("mr-2 rounded-pill text-xs px-2 border outline-none", {
            "border-danger text-danger font-weight-bold": isDown,
            "bg-white": !isDown,
          })}
          onClick={e => this.handleVote(e, DOWN)}
        >
          <span className="mr-2">No</span>
          <span role="img" aria-label="thumbs down">
            👎
          </span>
        </button>
      </div>
    );
  }
}

export default withLocalStorage(UpvoteDownvote);
