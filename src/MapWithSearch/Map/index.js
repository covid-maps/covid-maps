import React, { useRef, useState } from "react";
import { GoogleMap, withGoogleMap, Marker } from "react-google-maps";
import { GOOGLE_API_KEY, icons, markerIcon, dotIcon } from "../../utils";

const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

const defaultMapOptions = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  // `greedy` will disable the two-finger
  // drag behavior on mobile.
  gestureHandling: "greedy",
  styles: [
    {
      "featureType": "landscape",
      "stylers": [
        {
          "hue": "#FFBB00"
        },
        {
          "saturation": 43.400000000000006
        },
        {
          "lightness": 37.599999999999994
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "road.highway",
      "stylers": [
        {
          "hue": "#FFC200"
        },
        {
          "saturation": -61.8
        },
        {
          "lightness": 45.599999999999994
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {
          "hue": "#FF0300"
        },
        {
          "saturation": -100
        },
        {
          "lightness": 51.19999999999999
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "hue": "#FF0300"
        },
        {
          "saturation": -100
        },
        {
          "lightness": 52
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "hue": "#0078FF"
        },
        {
          "saturation": -13.200000000000003
        },
        {
          "lightness": 2.4000000000000057
        },
        {
          "gamma": 1
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "hue": "#00FF6A"
        },
        {
          "saturation": -1.0989010989011234
        },
        {
          "lightness": 11.200000000000017
        },
        {
          "gamma": 1
        }
      ]
    }
  ]
};

const defaultCenter = { lat: 49.281376, lng: -123.111382 };

function MyGoogleMap(props) {
  const [markerPosition, setMarkerPosition] = useState();
  const refMap = useRef(null);

  const handlePositionChanged = center => {
    setMarkerPosition(center);
    props.onBoundsChanged &&
      props.onBoundsChanged({ lat: center.lat(), lng: center.lng() });
  };

  const handleBoundsChanged = () => {
    const mapCenter = refMap.current.getCenter();
    handlePositionChanged(mapCenter);
  };

  const centerProps = props.position
    ? { center: props.position }
    : { defaultCenter };
  const defaultIcon = markerIcon(icons.default);

  return (
    <GoogleMap
      ref={refMap}
      defaultZoom={15}
      defaultOptions={defaultMapOptions}
      defaultCenter={{ lat: 54, lng: 25 }}
      onBoundsChanged={handleBoundsChanged}
      {...centerProps}
      onDragEnd={() => {
        const mapCenter = refMap.current.getCenter();
        props.onMarkerDragged && props.onMarkerDragged(mapCenter);
      }}
      mapContainerStyle={{
        height: "100vh",
        width: "100%"
      }}
    >
      <Marker position={props.currentLocation} icon={dotIcon} />
      {props.isMarkerShown && (
        <Marker
          draggable={!!props.onMarkerDragged}
          position={markerPosition}
          icon={defaultIcon}
          zIndex={10}
          onDragEnd={event =>
            props.onMarkerDragged &&
            props.onMarkerDragged({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            })
          }
        />
      )}
    </GoogleMap>
  );
}

const MyMap = withGoogleMap(MyGoogleMap);

class Map extends React.Component {
  render() {
    return (
      <MyMap
        position={this.props.position}
        currentLocation={this.props.currentLocation}
        onMarkerDragged={this.props.onMarkerDragged}
        onBoundsChanged={this.props.onBoundsChanged}
        onPositionChanged={this.props.onPositionChanged}
        isMarkerShown={this.props.isMarkerShown}
        googleMapURL={URL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={this.props.style} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default Map;
