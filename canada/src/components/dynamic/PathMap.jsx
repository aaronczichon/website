import BasicMap from './BasicMap';

import { useState, useEffect } from 'preact/hooks';
import gpxParser from 'gpxparser'; // Import a library to parse GPX files

// Function to parse GPX file and extract route coordinates
function parseGPX(gpxData) {
  const parser = new gpxParser();
  parser.parse(gpxData);
  const route = parser.tracks[0].points.map(point => [point.lat, point.lon]);
  return route;
}

export default function PathDynamicMap({gpxUrl, zoom}) {
  const [map, setMap] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);

  useEffect(() => {
    // Fetch and parse GPX file
    if (gpxUrl && map) {
      fetch(gpxUrl)
        .then(response => response.text())
        .then(gpxData => {
          const route = parseGPX(gpxData);
          const switchedRoute = route.map(subArray => {
            return [subArray[1], subArray[0]];
        });
          setRouteCoordinates(switchedRoute);
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
            'line-color': '#b33335',
            'line-width': 7
          }
        });
      });
      map.setCenter(routeCoordinates[0]);
    }
  }, [map, routeCoordinates]);

  return (
    <BasicMap zoom={zoom} setMap={setMap} />
  );
}