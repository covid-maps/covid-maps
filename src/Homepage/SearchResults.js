import React from "react";
import ResultBlock from "./ResultBlock";
import * as api from "../api";

class SearchResults extends React.Component {
  state = {
    results: []
  };

  componentDidMount() {
    api.query().then(data => {
      this.setState({ results: data });
    });
  }

  render() {
    return this.state.results.map(result => (
      <ResultBlock {...result} key={result.name} />
    ));
  }
}

export default SearchResults;
