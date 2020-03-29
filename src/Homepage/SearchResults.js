import React from "react";
import ResultBlock from "./ResultBlock";
import * as api from "../api";

class SearchResults extends React.Component {
  state = {
    results: [],
    isLoading: true
  };

  componentDidMount() {
    api.query().then(data => {
      this.setState({
        results: data,
        isLoading: false
      });
    });
  }

  render() {
    return this.state.isLoading ? (
      <div>Loading...</div>
    ) : (
        <ResultBlock results={this.state.results} />
    );
  }
}

export default SearchResults;
