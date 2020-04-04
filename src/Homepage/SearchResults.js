import React from "react";
import ResultBlock from "./ResultBlock";
import { isSameLocation } from "../utils";

class SearchResults extends React.Component {
  render() {
    const selectedResult = this.props.results.find(result =>
      isSameLocation(result, this.props.selectedLocation)
    );
    const filtered = this.props.results.filter(
      result => !isSameLocation(result, this.props.selectedLocation)
    );
    const results = selectedResult ? [selectedResult, ...filtered] : filtered;
    return this.props.isLoading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      results.map(result => {
        return (
          <div key={result.placeId || result.name}>
            <ResultBlock
              onClick={() => this.props.onCardClick(result)}
              result={result}
            />
          </div>
        );
      })
    );
  }
}

export default SearchResults;
