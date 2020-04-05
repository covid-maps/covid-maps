import React from "react";
import ResultBlock from "./ResultBlock";
import { isSameLocation } from "../utils";
import Pagination from "react-js-pagination";


class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            itemPerPage: 10
        };
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

  render() {
    const selectedResult = this.props.results.find(result =>
      isSameLocation(result, this.props.selectedLocation)
    );
    const filtered = this.props.results.filter(
      result => !isSameLocation(result, this.props.selectedLocation)
    );
    const results = selectedResult ? [selectedResult, ...filtered] : filtered;
      let indexOfLastResult = this.state.activePage * this.state.itemPerPage;
      let indexOfFirstResult = indexOfLastResult - this.state.itemPerPage;
      let renderedResults = results.slice(indexOfFirstResult, indexOfLastResult);
    return this.props.isLoading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      <div>{
          renderedResults.map(result => {
        return (
          <div key={result.placeId || result.name}>
            <ResultBlock
              onClick={() => this.props.onCardClick(result)}
              result={result}
            />
          </div>
        );
      })}
          <Pagination
              itemClass="page-item"
              linkClass="page-link"
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemPerPage}
              totalItemsCount={results.length}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange.bind(this)}
          />
      </div>
    );
  }
}

export default SearchResults;
