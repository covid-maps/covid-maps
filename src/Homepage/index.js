import React from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import SearchResults from "./SearchResults";
import MissingBlock from "./MissingBlock";
import * as api from "../api";
import {getDistance} from "geolib";
import MapWithSearch from "../MapWithSearch";
import {isStoreType, getFirstComma} from "../utils";
import {recordAddNewStore} from "../gaEvents";
import Accordion from "react-bootstrap/Accordion";

function searchResultToFormEntry(searchResult) {
    if (!searchResult) return undefined;
    return {
        "Store Name": getFirstComma(searchResult.name),
        Latitude: searchResult.latLng.lat,
        Longitude: searchResult.latLng.lng,
        "Place Id": searchResult.place_id,
        City: searchResult.city,
        Locality: searchResult.locality,
        Address: searchResult.address
    };
}

class Homepage extends React.Component {
    state = {
        results: [],
        markers: [],
        isLoading: true,
        center: {},
        searchResultLatlng: undefined,
        searchResult: undefined
    };

    componentDidMount() {
        api.query().then(data => {
            this.setState({
                results: this.formatResults(data),
                markers: data.map(result => ({
                    lat: Number(result.Latitude),
                    lng: Number(result.Longitude)
                })),
                isLoading: false
            });
        });
    }

    calculateDistance(result, center) {
        if (!result || !center || !center.lat || !center.lng) {
            return Number.MAX_SAFE_INTEGER;
        }
        return getDistance(
            {latitude: result.lat, longitude: result.lng},
            {latitude: center.lat, longitude: center.lng}
        );
    }

    calculateGroupDistance(grouped) {
        const groupedResult = grouped.map(group => ({
            ...group,
            distance: this.calculateDistance(group, this.state.center)
        }));
        return groupedResult.sort((a, b) => a.distance - b.distance);
    }

    formatResults(results) {
        const grouped = Object.values(
            results.reduce(function (obj, result) {
                if (!obj.hasOwnProperty(result["Place Id"] || result["Store Name"])) {
                    obj[result["Place Id"] || result["Store Name"]] = [];
                }
                obj[result["Place Id"] || result["Store Name"]].push(result);
                return obj;
            }, {})
        ).map(entries => ({
            name: entries[0]["Store Name"],
            placeId: entries[0]["Place Id"],
            lat: entries[0].Latitude,
            lng: entries[0].Longitude,
            entries: entries.sort((a, b) => b.Timestamp - a.Timestamp).reverse()
        }));
        return this.calculateGroupDistance(grouped);
    }

    isMissingLocationInformation(location) {
        return (
            location &&
            isStoreType(location.types) &&
            location.name &&
            !this.state.results.find(result => result.placeId === location.place_id)
        );
    }

    onBoundsChanged(center) {
        this.setState({
            results: this.calculateGroupDistance(this.state.results),
            center: center
        });
    }

    onCardClick(card) {
        this.setState({
            center: {lat: Number(card.lat), lng: Number(card.lng)},
            results: this.calculateGroupDistance(this.state.results),
            searchResultLatlng: {lat: Number(card.lat), lng: Number(card.lng)}
        });
    }

    getLinkState() {
        const item = searchResultToFormEntry(this.state.searchResult);
        return item
            ? {
                item: searchResultToFormEntry(this.state.searchResult)
            }
            : undefined;
    }

    getLinkTo() {
        const state = this.getLinkState();
        return state && state["Store Name"]
            ? {pathname: "/update", state}
            : {pathname: "/location"};
    }

    render() {
        let missingBlock = null;
        if (this.isMissingLocationInformation(this.state.searchResult)) {
            const {searchResult} = this.state;
            missingBlock = (
                <MissingBlock
                    missing={true}
                    result={{
                        name: searchResult.name,
                        entries: [searchResultToFormEntry(searchResult)]
                    }}
                ></MissingBlock>
            );
        }
        const closeByResults = this.state.results.filter(
            result => result.distance < 200000
        );
        return (
            <div>
                <MapWithSearch
                    value=""
                    onSuccess={result => {
                        if (result && result.latLng) {
                            this.setState(
                                {
                                    searchResultLatlng: result.latLng,
                                    searchResult: result
                                },
                                this.onBoundsChanged(result.latLng)
                            );
                        }
                    }}
                    style={{height: "85vh", width: "100vw"}}
                    position={this.state.searchResultLatlng}
                    locations={this.state.markers}
                    onBoundsChanged={center => this.onBoundsChanged(center)}
                    onPositionChanged={position =>
                        this.setState({
                            searchResultLatlng: position,
                            searchResult: null
                        })
                    }
                />
                <Accordion className="map-wide-data-container">
                    <div>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" className="toggle-button">
                            <span>
                                Locations near you <i className="fas fa-list-ul float-right"></i>
                            </span>
                        </Accordion.Toggle>
                    </div>
                    <div>
                        <Accordion.Collapse eventKey="0" className="toggle-container">
                            <div className="my-2 mx-2">
                                <Link to={this.getLinkTo()}>
                                    <Button
                                        size="md"
                                        variant="success"
                                        className="text-uppercase btn-block mb-2"
                                        onClick={recordAddNewStore}
                                    >
                                        Add a location
                                    </Button>
                                </Link>
                                {missingBlock}
                                <SearchResults
                                    onCardClick={card => this.onCardClick(card)}
                                    isLoading={this.state.isLoading}
                                    results={closeByResults}
                                    center={this.state.center}
                                />
                            </div>
                        </Accordion.Collapse>
                    </div>
                </Accordion>
            </div>
        );
    }
}

export default Homepage;
