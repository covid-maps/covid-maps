import React from "react";
import ResultBlock from "./ResultBlock";
import NonUGCResultBlock from "./NonUGCResultBlock";
import { isSameLocation } from "../utils";

class SearchResults extends React.Component {
  createView(results, nonUGCStores) {
    nonUGCStores = nonUGCStores || [];
    let nonUGCRendered = 0;
    let resultBlock = [];
    let placeIds = [];
    for (let i = 1; i < results.length + nonUGCStores.length; i++) {
      if (
        i % 5 == 0 &&
        nonUGCRendered < 10 &&
        nonUGCStores.length > nonUGCRendered
      ) {
        let result = nonUGCStores[nonUGCRendered];
        if (!(result.placeId in placeIds)) {
          resultBlock.push(
            <div key={result.placeId || result.name}>
              <NonUGCResultBlock
                onClick={() => this.props.onCardClick(result)}
                result={result}
              />
            </div>
          );
          nonUGCRendered += 1;
        }
      } else {
        if (i > results.length - 1) break;
        let result = results[i];
        placeIds.push(result.placeId);
        resultBlock.push(
          <div key={result.placeId || result.name}>
            <ResultBlock
              onClick={() => this.props.onCardClick(result)}
              result={result}
            />
          </div>
        );
      }
    }
    return resultBlock;
  }

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
      this.createView(this.props.results, this.props.nonUGCStores)
    );
  }
}

export default SearchResults;
