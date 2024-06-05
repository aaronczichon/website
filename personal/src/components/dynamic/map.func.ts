import * as mapboxgl from 'mapbox-gl';

export const addMapLayer = (map: mapboxgl.Map) => {
  map.addSource('countries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v1'
});

  map.addLayer(
    {
      id: 'country-boundaries',
      source: 'countries',
      'source-layer': 'country_boundaries',
      type: 'fill',
      paint: {
        'fill-color': '#19bf32',
        'fill-opacity': 0.7,
      },
    },
    'country-label'
  );

  // ISO List: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  map.setFilter('country-boundaries', [
    "in",
    "iso_3166_1_alpha_3",
    'ITA',
    'DEU',
    'ESP',
    'SVK',
    'SVN',
    'CZE',
    'HRV',
    'BEL',
    'NOR',
    'AUT',
    'LTU',
    'FIN',
    'EST',
    'CHE',
    'FRA'
  ]);
}


export const addCanadaProvinceLayer = (map: mapboxgl.Map) => {
  map.addSource('canada-provinces', {
    'type': 'geojson',
    'data': 'https://directus.aaronczichon.de/assets/5a299041-2049-4ce9-ab0c-27de01cd3697.geojson' // Replace with the path to your GeoJSON file
});

// Add a new layer to visualize the provinces
map.addLayer({
    'id': 'can-provinces-layer',
    'type': 'fill',
    'source': 'canada-provinces',
    'layout': {},
    'paint': {
      'fill-color': '#19bf32',
      'fill-opacity': 0.7,
    }
});
}

export const addUsStateLayer = (map: mapboxgl.Map) => {
  map.addSource('us-states', {
    'type': 'geojson',
    'data': 'https://directus.aaronczichon.de/assets/279dcd14-2c8f-4065-95dc-4b0bb77d983c.json' // Replace with the path to your GeoJSON file
});

// Add a new layer to visualize the provinces
map.addLayer({
    'id': 'us-states-layer',
    'type': 'fill',
    'source': 'us-states',
    'layout': {},
    'paint': {
      'fill-color': '#19bf32',
      'fill-opacity': 0.7,
    }
});
}
