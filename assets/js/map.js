mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2tkb3ZoNzZrMDZyMzMxbGo0YTF3ZHk2ZyJ9.u6m6_Sxxu5ITBuomsTyA3g';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/grafa/ckdhx8rpo01b61ip8o9e8fth3',
    center: [-119.655,44.268],
    zoom: 6.5,
    hash: true,
    attributionControl: false,
}).addControl(new mapboxgl.AttributionControl({
  customAttribution: '<a href="https://www.oregon.gov/OSMB/Pages/index.aspx">OSMB</a>'}));

// add geocoder
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        localGeocoder: forwardGeocoder,
        placeholder: "e.g Willamette Park"
    })
);

// add nav controls
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: false
}), 'top-right');


function forwardGeocoder(query) {
  let launches = map.querySourceFeatures('osmw-launches', {
    sourceLayer: 'osmw-launches'
  });

  if (launches) {
    // only list unique features from vector tiles
    let uniqueFeatures = getUniqueFeatures(launches, "FACILNM");
    let matchingFeatures = [];
    for (i=0; i<uniqueFeatures.length; i++){
      let feature = uniqueFeatures[i]
      query.toLowerCase();
      if (feature.properties.FACILNM && feature.properties.FACILNM.toLowerCase().search(query.toLowerCase()) !== -1) {
        feature['place_name']= '🏄‍♀️ ' + feature.properties.FACILNM
        feature['center'] = feature.geometry.coordinates
        matchingFeatures.push(feature);
      }
    }
    console.log(matchingFeatures);
    return matchingFeatures;
  }
};

function getUniqueFeatures(array, comparatorProperty) {
    let existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    let uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });
    return uniqueFeatures;
}

map.on('load', function() {
    map.addSource('osmw-launches', {
        type: 'vector',
        url: 'mapbox://grafa.osmw-launches'
    });

    map.addLayer({
        id: 'osmw-launches',
        source: 'osmw-launches',
        'source-layer': 'osmw-launches',
        type: 'symbol',
        layout: {
            // Set the label content to the
            // feature's `name` property
            // text-field: ['get', 'name'],
            'icon-image': [
                "step",
                ["zoom"],
                "slipway-15",
                13,
                "slipway-15",
                22,
                "slipway-15"
                ],
            'icon-size': [
                'interpolate', ['linear'], ['zoom'],
                0, 0.3,
                11, 0.5,
                15, 1
            ],
            'icon-allow-overlap': true
        },
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'osmw-launches', function(e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let props = e.features[0].properties;
        let launchName = props.FACILNM,
            launchPhoto = props.PHOTOURL,
            launchFacilType = props.FACILTYPE,
            launchRampType = props.RAMPTYPE,
            launchUseFee = props.USEFEE,
            launchURL = props.FACILURL;

            osmNode  = e.features[0].properties['@id'];
            description = (launchPhoto) ? '<h2>' + launchName + '</h2><img src=" '+ launchPhoto +' " /><br>' +
                              'Facility type: ' + launchFacilType + '<br>' + 
                              'Use fee: ' + launchUseFee + '<br>' + 
                              '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a>': 
                              '<h2>' + launchName + '</h2>' +
                              'Facility type: ' + launchFacilType + '<br>' + 
                              'Ramp type: ' + launchRampType + '<br>' + 
                              'Use fee: ' + launchUseFee + '<br>' + 
                              '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="' + launchURL + '" target="_blank">🌍Website</a><br>';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            
        map.flyTo({
            center: coordinates,
            pitch: 72,
            zoom:15,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'osmw-launches', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        let coordinates = e.features[0].geometry.coordinates.slice();
        let props = e.features[0].properties;
        let launchName = props.FACILNM,
            launchPhoto = props.PHOTOURL,
            launchFacilType = props.FACILTYPE,
            launchRampType = props.RAMPTYPE,
            launchUseFee = props.USEFEE,
            launchURL = props.FACILURL;

            osmNode  = e.features[0].properties['@id'];
            description = (launchPhoto) ? '<h2>' + launchName + '</h2><img src=" '+ launchPhoto +'" /><br>' +
                              'Facility type: ' + launchFacilType + '<br>' + 
                              'Use fee: ' + launchUseFee + '<br>' + 
                              '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="' + launchURL + '" target="_blank">🌍Website</a><br>':
                              '<h2>' + launchName + '</h2>' +
                              'Facility type: ' + launchFacilType + '<br>' + 
                              'Ramp type: ' + launchRampType + '<br>' + 
                              'Use fee: ' + launchUseFee + '<br>' + 
                              '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a>';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'osmw-launches', function() {
        map.getCanvas().style.cursor = '';
    });

    // =============================


    map.addSource('slipways', {
        type: 'vector',
        url: 'mapbox://grafa.slipways'
    });

    map.addLayer({
        id: 'slipways',
        source: 'slipways',
        'source-layer': 'slipways',
        type: 'symbol',
        layout: {
            // Set the label content to the
            // feature's `name` property
            // text-field: ['get', 'name'],
            'icon-image': [
                "step",
                ["zoom"],
                "dot-blue",
                13,
                "dot-blue",
                22,
                "dot-blue"
                ],
            'icon-size': [
                'interpolate', ['linear'], ['zoom'],
                0, 0.3,
                11, 0.5,
                15, 1
            ],
            'icon-allow-overlap': true
        },
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'slipways', function(e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let props = e.features[0].properties;
        let launchName = props.name;
            // launchPhoto = props.PHOTOURL,
            // launchFacilType = props.FACILTYPE,
            // launchRampType = props.RAMPTYPE,
            // launchUseFee = props.USEFEE,
            // launchURL = props.FACILURL;
            var osmNode  = e.features[0].properties['@id'];
            var description = (launchName) ? '<h2>' + launchName + '</h2>🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="https://www.openstreetmap.org/' + osmNode + '" target="_blank">Suggest edit</a>' : '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="https://www.openstreetmap.org/" target="_blank">Suggest edit</a>';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            
        map.flyTo({
            center: coordinates,
            pitch: 60,
            zoom:15,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'slipways', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        let coordinates = e.features[0].geometry.coordinates.slice();
        let props = e.features[0].properties;
        let launchName = props.name;
            // launchPhoto = props.PHOTOURL,
            // launchFacilType = props.FACILTYPE,
            // launchRampType = props.RAMPTYPE,
            // launchUseFee = props.USEFEE,
            // launchURL = props.FACILURL;
            var osmNode  = props['@id'];
            var description = (launchName) ? '<h2>' + launchName + '</h2>🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="https://www.openstreetmap.org/' + osmNode + '" target="_blank">Suggest edit</a>' : '🚗 <a href="javascript:void(0)" onclick="getLocation(getRoute)";return false;>Directions</a> | <a href="https://www.openstreetmap.org/' + osmNode + '" target="_blank">Suggest edit</a>';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'slipways', function() {
        map.getCanvas().style.cursor = '';
    });
    forwardGeocoder();
});

// geolocation
const getLocation = (callback) => {
  navigator.geolocation.getCurrentPosition(function(position) {
    let startLon = position.coords.longitude;
    let startLat = position.coords.latitude;
    callback(startLon,startLat);
  });
};

// directions
const getRoute = (startLon,startLat,dest) => {
    console.log(dest);
  var dest = popup.getLngLat();
  let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + startLon + ',' + startLat + ';' + dest.lng + ',' + dest.lat + '?geometries=geojson&overview=full&access_token=' + mapboxgl.accessToken;
  let req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload  = function() {
    let data = req.response.routes[0];
    let route = data.geometry.coordinates;
    let geojsonRoute = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": route
      }
    };
    let geojsonStart = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [startLon,startLat]
      }
    };
    if (map.getSource('route')) {
      map.getSource('route').setData(geojsonRoute);
      map.getSource('start').setData(geojsonStart);
    } else {
      map.addLayer({
        "id": "start",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": geojsonStart
        },
        "layout": {
            "icon-image": "circle-stroked-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
      },'osmw-launches');
      map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": route
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "rgba(0, 30, 84, 0.78)",
          "line-width": 8,
          "line-opacity": 0.75
        }
      },'waterway-label');
    };

    let coordinates = geojsonRoute.geometry.coordinates;

    // Pass the first coordinates in the LineString to `lngLatBounds` &
    // wrap each coordinate pair in `extend` to include them in the bounds
    // result. A letiation of this technique could be applied to zooming
    // to the bounds of multiple Points or Polygon geomteries - it just
    // requires wrapping all the coordinates with the extend method.
    let bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.fitBounds(bounds, {
        padding: 20
    });

    popup.setLngLat([startLon,startLat])
      .setHTML('<span class="duration">' + Math.floor(data.duration/60) + ' min 🚗💨</span>');
    popup.addTo(map);
  };
  req.send();
};

// popup
let markerHeight = 20, markerRadius = 10, linearOffset = 25;
let popupOffsets = {
 'top': [0, 0],
 'top-left': [0,0],
 'top-right': [0,0],
 'bottom': [0, -markerHeight],
 'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
 'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
 'left': [markerRadius, (markerHeight - markerRadius) * -1],
 'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};

let popup = new mapboxgl.Popup({
  offset: popupOffsets
});

document.getElementById('globe').addEventListener('click', function() {
  // Fly to a random location by offsetting the point -74.50, 40
  // by up to 5 degrees.
  map.flyTo({
    center: [-119.655,44.268],
    zoom: 6.5,
    pitch: 0,
    bearing: 0,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
});