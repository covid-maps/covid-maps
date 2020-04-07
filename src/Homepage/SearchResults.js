import React from "react";
import ResultBlock from "./ResultBlock";
import { isSameLocation } from "../utils";
import Button from "react-bootstrap/Button";

const ITEM_PER_PAGE = 7;

class SearchResults extends React.Component {
  state = {
    resultsShown: ITEM_PER_PAGE
  };

  loadMore() {
    this.setState({ resultsShown: this.state.resultsShown + ITEM_PER_PAGE })
  }

  render() {
    const selectedResult = this.props.results.find(result =>
      isSameLocation(result, this.props.selectedLocation)
    );
    const filtered = this.props.results.filter(
      result => !isSameLocation(result, this.props.selectedLocation)
    );
    const results = selectedResult ? [selectedResult, ...filtered] : filtered;
    const renderedResults = results.slice(0, this.state.resultsShown);
    const isPaginated = results.length > this.state.resultsShown;

    return this.props.isLoading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
        <div>
          {renderedResults.map(result => {
            return (
              <div key={result.placeId || result.name}>
                <ResultBlock
                  onClick={() => this.props.onCardClick(result)}
                  result={result}
                />
              </div>
            );
          })}
          {isPaginated ? (
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => this.loadMore()}>Load more</Button>
          ) : null}
        </div>
      );
  }
}

export default SearchResults;
