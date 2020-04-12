import React from "react";
import PropTypes from "prop-types";
import ResultBlock from "./ResultBlock";
import { isSameLocation } from "../utils";
import Button from "react-bootstrap/Button";

const ITEM_PER_PAGE = 7;

function applySearchFilter(query, entries) {
  if (!query) {
    return entries;
  }
  return entries.filter(store => {
    const { entries } = store;
    const q = query.toLowerCase();
    return (
      store.name.toLowerCase().indexOf(q) >= 0 ||
      entries.find(entry => {
        return (
          (entry["Safety Observations"] &&
            entry["Safety Observations"].toLowerCase().indexOf(q) >= 0) ||
          (entry["Useful Information"] &&
            entry["Useful Information"].toLowerCase().indexOf(q) >= 0)
        );
      })
    );
  });
}

class SearchResults extends React.Component {
  static propTypes = {
    selectedStoreName: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    selectedLocation: PropTypes.object,
    isLoading: PropTypes.bool,
    onCardClick: PropTypes.func.isRequired,
    textFilter: PropTypes.string,
  }

  state = {
    resultsShown: ITEM_PER_PAGE,
  };

  loadMore() {
    this.setState({ resultsShown: this.state.resultsShown + ITEM_PER_PAGE });
  }

  render() {
    const selectedResult = this.props.results.find(result => (
      isSameLocation(result, this.props.selectedLocation)
      && this.props.selectedStoreName === result.name
    ));
    let filtered = this.props.results.filter(
      result => !isSameLocation(result, this.props.selectedLocation)
    );
    filtered = applySearchFilter(this.props.textFilter, filtered);
    const renderedResults = filtered.slice(0, this.state.resultsShown);
    const isPaginated = filtered.length > this.state.resultsShown;
    return this.props.isLoading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      <>
        {selectedResult ? (
          <div>
            <ResultBlock result={selectedResult} isSelected />
          </div>
        ) : null}
        <div>
          {renderedResults.map(result => {
            return (
              <div key={result.placeId || result.name}>
                <ResultBlock
                  highlightedText={this.props.textFilter}
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
              onClick={() => this.loadMore()}
            >
              {this.props.loadMoreBtnText}
            </Button>
          ) : null}
        </div>
      </>
    );
  }
}

export default SearchResults;
