import React from "react";
import ResultBlock from "./ResultBlock";

class SearchResults extends React.Component {
  render() {
    return this.props.isLoading ? (
      <div>Loading...</div>
    ) : (
      this.props.results.map(result => (
        <ResultBlock {...result} key={result.Timestamp} />
      ))
    );
  }
}

export default SearchResults;
