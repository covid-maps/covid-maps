import React from "react";
import ResultBlock from "./ResultBlock";
import { isSameLocation } from "../utils";
import Pagination from "react-js-pagination";

const ITEM_PER_PAGE = 10;

class SearchResults extends React.Component {
  state = {
    activePage: 1
  };

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  render() {
    const selectedResult = this.props.results.find(result =>
      isSameLocation(result, this.props.selectedLocation)
    );
    const filtered = this.props.results.filter(
      result => !isSameLocation(result, this.props.selectedLocation)
    );
    const results = selectedResult ? [selectedResult, ...filtered] : filtered;

    const isPaginated = results.length > ITEM_PER_PAGE;
    let indexOfLastResult = this.state.activePage * ITEM_PER_PAGE;
    let indexOfFirstResult = indexOfLastResult - ITEM_PER_PAGE;
    let renderedResults = results.slice(indexOfFirstResult, indexOfLastResult);
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
          <Pagination
            itemClass="page-item"
            linkClass="page-link"
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.itemPerPage}
            totalItemsCount={results.length}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default SearchResults;
