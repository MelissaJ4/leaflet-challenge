// Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (response) {

  // Once we get a response, send the data.features object to the function for each feature.
  console.log(response);


// Access the Leaflet map

let map = L.map('map').setView([0, 0], 2);

// Add the tile layer
 // Create the base layers.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function getColor(depth) {
    switch (true) {
        case depth > 90:
          return "#ea2c2c";
        case depth > 70:
          return "#ea822c";
        case depth > 50:
          return "#ee9c00";
        case depth > 30:
          return "#eecc00";
        case depth > 10:
          return "#d4ee00";
        default:
          return "#98ee00";
     } }

//Get all the earthquake data required
response.features.forEach(function(feature) {
    
    let magnitude = feature.properties.mag;
    let coordinates = feature.geometry.coordinates;
    let depth = coordinates[2];
    let place = feature.properties.place

// Define a markerSize() function that will give each quake a different radius based on its magnitude
    let markerSize = magnitude * 3; 

// Marker size and color based on magnitude depth
    L.circleMarker([coordinates[1], coordinates[0]], {
            radius: markerSize,
            color: 'white',
            fillColor: getColor(depth),
            fillOpacity: .6, 
        }).addTo(map).bindPopup(`Magnitude: ${magnitude} <br> Depth: ${depth} <br> Place: ${place}`);
});

// Create a legend for the map
    let legend = L.control({position: "bottomright" });
    legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ["#98ee00",  "#d4ee00",  "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: "
          + colors[i] 
          + "'></i> "
          + grades[i]
          + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
return div;
    };

  // Adding the legend to the map
  legend.addTo(map);

});