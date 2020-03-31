import React from "react";
import ResultBlock from "./ResultBlock";

class SearchResults extends React.Component {
  render() {
    return this.props.isLoading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      this.props.results.map(result => (
        <div key={result.name}>
          <ResultBlock onClick={() => this.props.onCardClick(result)} result={result} />
        </div>
      ))
    );
  }
}

export default SearchResults;
