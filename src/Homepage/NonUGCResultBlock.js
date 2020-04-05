import React from "react";
import { Link } from "react-router-dom";
import { recordUpdateStore } from "../gaEvents";

export default class NonUGCResultBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  onClick() {
    window.scrollTo({
      top: 50,
      behavior: "smooth",
    });
    this.props.onClick && this.props.onClick(this.props.result);
  }

  render() {
    const { result } = this.props;
    return (
      <div
        onClick={() => this.onClick()}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        className="card my-1"
        style={{
          cursor: "pointer",
          backgroundColor: this.state.hover ? "#eee" : "white",
        }}
      >
        <div className="card-body p-3 ugc">
          <Link
            to={{ pathname: "/update", state: { "Store Name": result.name } }}
            className="float-right btn btn-sm ugc-button text-uppercase"
            onClick={recordUpdateStore}
          >
            ADD
          </Link>
          <h5 className="card-title m-0 p-0 ugc-heading">
            {result.name}
            <br />
            {result.address}
          </h5>
          <div className="ugc-body">
            We don't have information on this location yet. Help out by adding
            some!
          </div>
        </div>
      </div>
    );
  }
}
