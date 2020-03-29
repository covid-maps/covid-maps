import React from "react";
import ResultBlock from "./ResultBlock";

class SearchResults extends React.Component {
  render() {
    return this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.results.map(result => (
      <div key={result.name}>
        <ResultBlock result={result} />
      </div>
    ));
  }
}

export default SearchResults;
