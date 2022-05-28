import React, { useState } from 'react'

import Map from './Map';
import { TileLayer, VectorLayer } from './Layers';
import { osm, vector } from './Source';

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";

// Adding Markers function
function addMarkers(lonLatArray) {
    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png",
      }),
    });
    let features = lonLatArray.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(iconStyle);
      return feature;
    });
    return features;
}

const Location = ({ location }) => {
    
    // Using State
    const [center, setCenter] = useState(location);
    const [zoom, setZoom] = useState(14);
    const [features, setFeatures] = useState(addMarkers([center]));

    // Building Layout
    return (
        <Map center={fromLonLat(center)} zoom={zoom}>
            <TileLayer source={osm()} zIndex={0} />
            <VectorLayer source={vector({ features })} />
        </Map>
    )
}

export default Location
