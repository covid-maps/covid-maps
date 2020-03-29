import React from "react";
import SearchResults from "./SearchResults";
import GoogleMap from "../Map";
import { ScrollToTopOnMount } from "../utils";
import * as api from "../api";

class Homepage extends React.Component {
  state = {
    results: [],
    isLoading: true
  };

  componentDidMount() {
    api.query().then(data => {
      console.log(data);
      this.setState({
        results: data,
        isLoading: false
      });
    });
  }

  render() {
    const locations = this.state.results.map(result => ({ lat: Number(result.Latitude), lng: Number(result.Longitude) }));

    return (
      <div>
        <ScrollToTopOnMount />
        <GoogleMap style={{ height: 400 }} locations={locations} />
        <div className="container">
          <SearchResults loading={this.state.isLoading} results={this.state.results} />
        </div>
      </div>
    );
  }
}

export default Homepage;
