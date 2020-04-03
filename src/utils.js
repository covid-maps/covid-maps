import React from "react";
import {withRouter} from "react-router-dom";

class ScrollToTopOnMount extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}

export const ScrollToTop = withRouter(ScrollToTopOnMount);

// The API key is restricted through HTTP referer rules.
export const GOOGLE_API_KEY = "AIzaSyB9hwI7b4677POloj5DpmDXaliqU5Dp8sA";

export const geocodeByLatlng = latlng => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise(resolve => {
        geocoder.geocode({location: latlng}, (results, status) => {
            resolve(results);
        });
    });
};

export function getAddressComponent(addressComponents, component) {
    const filtered = addressComponents
        .filter(c => c.types.find(t => t === component))
        .map(c => c.long_name);
    return filtered.length ? filtered[0] : "";
}

export const iconSvgs = {
    default:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ff4646" d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>',
    highlighted:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1fa01f" d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>'
};

export const convertSvgUrl = svg => {
    return "data:image/svg+xml;charset=UTF-8;base64," + btoa(svg);
};

export const isStoreType = types => {
    const invalidTypes = ["political", "locality"];
    return types && !types.filter(type => invalidTypes.indexOf(type) >= 0).length;
};

export function isFunction(functionToCheck) {
    return (
        functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
    );
}

export function getFirstComma(address) {
    const split = address ? address.split(", ") : [];
    return split.length ? split[0] : address;
}
