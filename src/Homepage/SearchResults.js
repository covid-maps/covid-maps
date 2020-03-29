import React from "react";
import ResultBlock from "./ResultBlock";

class SearchResults extends React.Component {
  render() {
    return this.props.isLoading ? (
      <div>Loading...</div>
    ) : (
        <ResultBlock results={this.props.results} />
    );
  }
}

export default SearchResults;
