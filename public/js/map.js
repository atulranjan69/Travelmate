document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken = mapToken;
  const map = (window.map = new mapboxgl.Map({
    container: "map",
    center: listing.geometry.coordinates,
    zoom: 9,
    pitch: 42,
    bearing: -50,
    style: "mapbox://styles/mapbox/standard",
    minZoom: 15,
    maxZoom: 16,
  }));

  map.on("style.load", () => {
    // set the light preset to be in dusk mode.
    map.setConfigProperty("basemap", "lightPreset", "dusk");

    // add a geojson source with a polygon to be used in the clip layer.
    map.addSource("eraser", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [
                  [-0.12573, 51.53222],
                  [-0.12458, 51.53219],
                  [-0.12358, 51.53492],
                  [-0.12701, 51.53391],
                  [-0.12573, 51.53222],
                ],
              ],
              type: "Polygon",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "eraser",
      type: "clip",
      source: "eraser",
      layout: {
        "clip-layer-types": ["symbol", "model"],
        "clip-layer-scope": ["basemap"],
      },
    });

    map.addSource("model", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {
          "model-uri": "https://docs.mapbox.com/mapbox-gl-js/assets/tower.glb",
        },
        geometry: {
          type: "Point",
          coordinates: listing.geometry.coordinates,
        },
      },
    });

    map.addLayer({
      id: "tower",
      type: "model",
      slot: "middle",
      source: "model",
      minzoom: 15,
      layout: {
        "model-id": ["get", "model-uri"],
      },
      paint: {
        "model-opacity": 1,
        "model-rotation": [0.0, 0.0, 35.0],
        "model-scale": [0.8, 0.8, 1.2],
        "model-color-mix-intensity": 0,
        "model-cast-shadows": true,
        "model-emissive-strength": 0.8,
      },
    });
  });

  const popup = new mapboxgl.Popup({
    offset: 25,
  }).setHTML(
    `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
  );

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
});
