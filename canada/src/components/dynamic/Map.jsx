import { useState, useEffect } from 'preact/hooks';
import * as mapboxgl from 'mapbox-gl';

// Function to parse GPX file and extract route coordinates
function parseGPX(gpxData) {
  const parser = new gpxParser();
  parser.parse(gpxData);
  const route = parser.tracks[0].points.map(point => [point.lat, point.lon]);
  return route;
}

export default function DynamicMap({ gpxUrl }) {
  const [mapId] = useState('map-' + Math.random().toString(36).substr(2, 9))[0];
  const [map, setMap] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  
  useEffect(() => {
    // mapboxgl.accessToken =
    // 'pk.eyJ1Ijoid2ViYXRsYXMiLCJhIjoiY2xrdHB6dHg0MGVqbTNnbzR4Z3pvbTBvNCJ9.jSswMTOvnmDuLu9v9mdp9w';
    const accessToken = 'pk.eyJ1Ijoid2ViYXRsYXMiLCJhIjoiY2lvYmt1djVqMDA0OXV3bTFuMHZjNWI5MCJ9.ltEAHRP0jWVKshgCqt5Z7g'
    const map = new mapboxgl.Map({
      container: mapId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-63.582687, 44.65107],
      zoom: 10,
      accessToken
    });

    setMap(map);

    // Clean up function (optional)
    return () => {
      map.remove(); // Cleanup Mapbox map
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  useEffect(() => {
    // Fetch and parse GPX file
    if (gpxUrl && map) {
      fetch(gpxUrl)
        .then(response => response.text())
        .then(gpxData => {
          const route = parseGPX(gpxData);
          setRouteCoordinates(route);
        })
        .catch(error => {
          console.error('Error fetching GPX file:', error);
        });
    }
  }, [gpxUrl, map]);

  useEffect(() => {
    // Add route to map
    if (map && routeCoordinates) {
      map.on('load', () => {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 8
          }
        });
      });
    }
  }, [map, routeCoordinates]);

  return (
    <div id={mapId} class="map-container"></div>
  );
}