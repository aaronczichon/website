import * as mapboxgl from "mapbox-gl";

export const addMapLayer = (map: mapboxgl.Map) => {
  map.addSource("countries", {
    type: "vector",
    url: "mapbox://mapbox.country-boundaries-v1",
  });

  map.addLayer(
    {
      id: "country-boundaries",
      source: "countries",
      "source-layer": "country_boundaries",
      type: "fill",
      paint: {
        "fill-color": "#19bf32",
        "fill-opacity": 0.7,
      },
    },
    "country-label",
  );

  // ISO List: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  map.setFilter("country-boundaries", [
    "in",
    "iso_3166_1_alpha_3",
    "ITA",
    "CAN",
    "DEU",
    "ESP",
    "SVK",
    "SVN",
    "CZE",
    "HRV",
    "BEL",
    "NOR",
    "AUT",
    "LTU",
    "FIN",
    "EST",
    "USA",
    "CHE",
    "FRA",
    "SPM",
  ]);
};
